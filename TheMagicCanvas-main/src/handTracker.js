import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export class HandTracker {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.handLandmarker = null;
    this.lastVideoTime = -1;
    this.results = null;
    this.isReady = false;
  }

  async initialize() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.isReady = true;
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" }
      });
      this.videoElement.srcObject = stream;

      return new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play();
          resolve();
        };
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      throw err;
    }
  }

  detect() {
    if (!this.isReady || !this.videoElement || this.videoElement.readyState !== 4) {
      return null;
    }

    let startTimeMs = performance.now();
    if (this.lastVideoTime !== this.videoElement.currentTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      this.results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);
    }

    return this.results;
  }

  // Helper to extract index finger tip
  getIndexFingerTip(hand) {
    if (!hand) return null;
    // Landmark 8 is index finger tip
    const tip = hand[8];
    // Notice: Video is horizontally flipped, so we mirror X
    return {
      x: 1 - tip.x,
      y: tip.y
    };
  }

  // Helper to check for open palm
  isOpenPalm(hand) {
    if (!hand) return false;

    // Landmark 0 is wrist
    const wrist = hand[0];

    // Fingertips (4, 8, 12, 16, 20) and MCP (2, 5, 9, 13, 17)
    // We check if fingertips are further from wrist than their corresponding MCP
    const tips = [8, 12, 16, 20]; // Ignore thumb for easier open palm
    const mcps = [5, 9, 13, 17];

    let extendedFingers = 0;
    for (let i = 0; i < 4; i++) {
      const tip = hand[tips[i]];
      const mcp = hand[mcps[i]];

      const tipDist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const mcpDist = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);

      if (tipDist > mcpDist * 1.2) { // 1.2 adds some margin
        extendedFingers++;
      }
    }

    // Consider palm open if all 4 main fingers are extended
    return extendedFingers >= 4;
  }

  // Helper to check if ONLY the index finger is pointing (for drawing)
  isPointing(hand) {
    if (!hand) return false;

    const wrist = hand[0];

    // Helper to check if a specific finger is extended
    const isFingerExtended = (tipIdx, mcpIdx) => {
      const tipDist = Math.hypot(hand[tipIdx].x - wrist.x, hand[tipIdx].y - wrist.y);
      const mcpDist = Math.hypot(hand[mcpIdx].x - wrist.x, hand[mcpIdx].y - wrist.y);
      return tipDist > mcpDist * 1.2;
    };

    const indexExt = isFingerExtended(8, 5);
    const middleExt = isFingerExtended(12, 9);
    const ringExt = isFingerExtended(16, 13);
    const pinkyExt = isFingerExtended(20, 17);

    // It's a drawing pose if the index is extended, and at least the middle and ring fingers are curled.
    // We ignore the thumb as its tracking can be ambiguous depending on hand rotation.
    return indexExt && !middleExt && !ringExt && !pinkyExt;
  }

  // Helper to check if ALL fingers are curled into a fist
  isClosedFist(hand) {
    if (!hand) return false;

    const wrist = hand[0];

    // Check if tip is closer to wrist than MCP (or roughly similar)
    const isFingerCurled = (tipIdx, mcpIdx) => {
      const tipDist = Math.hypot(hand[tipIdx].x - wrist.x, hand[tipIdx].y - wrist.y);
      const mcpDist = Math.hypot(hand[mcpIdx].x - wrist.x, hand[mcpIdx].y - wrist.y);
      return tipDist < mcpDist * 1.1;
    };

    // Check index, middle, ring, pinky
    return isFingerCurled(8, 5) && isFingerCurled(12, 9) && isFingerCurled(16, 13) && isFingerCurled(20, 17);
  }
}
