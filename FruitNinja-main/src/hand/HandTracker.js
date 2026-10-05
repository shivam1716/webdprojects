import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { CONFIG } from '../utils/config.js';

export class HandTracker {
  constructor(videoElement, onHandsDetected, onTrackingLost) {
    this.video = videoElement;
    this.handLandmarker = null;
    this.isInitialized = false;
    this.onHandsDetected = onHandsDetected; // Callback with array of hands
    this.onTrackingLost = onTrackingLost;
    this.lastVideoTime = -1;
    
    // State per hand. We'll index them by handedness or simply by tracking index.
    // MediaPipe gives us handedness. Let's use 'Left' and 'Right' as keys.
    this.handsState = {
      'Left': { recentPositions: [], currentPosition: null },
      'Right': { recentPositions: [], currentPosition: null }
    };
  }

  async initialize() {
    if (this.isInitialized) return true;
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.13/wasm"
      );
      
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2, // Support 2 hands
        minHandDetectionConfidence: 0.7,
        minHandPresenceConfidence: 0.7,
        minTrackingConfidence: 0.7
      });
      
      this.isInitialized = true;
      console.log("MediaPipe HandLandmarker initialized successfully (2 hands supported).");
      return true;
    } catch (error) {
      console.error("Error initializing MediaPipe:", error);
      return false;
    }
  }

  async requestCamera() {
    if (this.video.srcObject) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      this.video.srcObject = stream;
      
      return new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve(true);
        };
      });
    } catch (error) {
      console.error("Camera access denied or error:", error);
      return false;
    }
  }

  detect(canvasWidth, canvasHeight) {
    if (!this.isInitialized || this.video.currentTime === this.lastVideoTime) {
      return null;
    }

    const startTimeMs = performance.now();
    const results = this.handLandmarker.detectForVideo(this.video, startTimeMs);
    this.lastVideoTime = this.video.currentTime;

    const detectedHandsData = [];
    
    // Keep track of which hands were seen this frame
    const seenHands = new Set();

    if (results.landmarks && results.landmarks.length > 0) {
      for (let i = 0; i < results.landmarks.length; i++) {
        const landmarks = results.landmarks[i];
        
        // MediaPipe returns Left/Right. 
        // Note: because the webcam is mirrored visually, MediaPipe's "Left" 
        // might correspond to the user's right hand physically. 
        // We use it purely as a unique identifier for state tracking.
        let handLabel = "Unknown_" + i;
        if (results.handednesses && results.handednesses[i] && results.handednesses[i].length > 0) {
           handLabel = results.handednesses[i][0].categoryName; 
           // e.g., "Left" or "Right"
        }
        
        seenHands.add(handLabel);

        // Ensure state exists for this label (in case it's unknown)
        if (!this.handsState[handLabel]) {
          this.handsState[handLabel] = { recentPositions: [], currentPosition: null };
        }

        const state = this.handsState[handLabel];
        
        // Index fingertip is landmark 8
        const indexTip = landmarks[8];
        
        // Map normalized coordinates (0-1) to canvas dimensions.
        // Invert X because the video is mirrored via CSS scaleX(-1)
        const mappedX = (1 - indexTip.x) * canvasWidth;
        const mappedY = indexTip.y * canvasHeight;

        state.currentPosition = { x: mappedX, y: mappedY, time: performance.now() };
        state.recentPositions.push(state.currentPosition);
        
        // Keep only recent positions (e.g., last 150ms)
        const now = performance.now();
        state.recentPositions = state.recentPositions.filter(p => now - p.time <= CONFIG.TRAIL_DURATION);

        detectedHandsData.push({
          label: handLabel,
          currentPosition: state.currentPosition,
          trail: [...state.recentPositions],
          landmarks: landmarks,
          swipe: this.getSwipeSegment(state) // Calculate swipe for this hand
        });
      }
    }

    // Clear state for hands not seen in this frame
    for (const label in this.handsState) {
      if (!seenHands.has(label)) {
        this.handsState[label].currentPosition = null;
        this.handsState[label].recentPositions = [];
      }
    }

    if (detectedHandsData.length > 0) {
      if (this.onHandsDetected) {
        this.onHandsDetected(detectedHandsData);
      }
      return results;
    } else {
      if (this.onTrackingLost) {
        this.onTrackingLost();
      }
      return null;
    }
  }

  getSwipeSegment(state) {
    if (state.recentPositions.length < 2) return null;
    
    const current = state.currentPosition;
    const oldest = state.recentPositions[0];

    const dx = current.x - oldest.x;
    const dy = current.y - oldest.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const dt = current.time - oldest.time;
    const speed = dt > 0 ? distance / dt : 0;

    if (distance > CONFIG.SWIPE_MIN_DISTANCE && speed > CONFIG.SWIPE_MIN_SPEED) {
      return {
        startX: oldest.x,
        startY: oldest.y,
        endX: current.x,
        endY: current.y,
        speed: speed
      };
    }
    return null;
  }

  resetHistory() {
    for (const label in this.handsState) {
      this.handsState[label].recentPositions = [];
      this.handsState[label].currentPosition = null;
    }
  }
}
