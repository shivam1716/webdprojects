import './style.css';
import { HandTracker } from './handTracker.js';
import { Renderer } from './renderer.js';

const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const startBtn = document.getElementById('btn-start');
const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const modeSwitch = document.getElementById('mode-switch');
const controls = document.getElementById('controls');
const homeBtn = document.getElementById('btn-home');

let tracker;
let renderer;
let isRunning = false;

let currentMode = 'flower';
let isChargingStars = false;

// Active strokes array for spatial tracking
let activeStrokes = [];

const FLOWER_SPACING = 0.015; 
const STAR_SPACING = 0.08; 
const BREAK_STROKE_THRESHOLD = 10; 
const MAX_CONNECT_DISTANCE = 0.2; 
const SMOOTHING_FACTOR = 0.35; 

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    currentMode = e.target.id.replace('btn-', '').replace('-mode', '');
  });
});

async function init() {
  tracker = new HandTracker(videoElement);
  renderer = new Renderer(canvasElement, videoElement);
  await renderer.loadSprites();
}

async function start() {
  startScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  
  try {
    await tracker.initialize();
    await tracker.startCamera();
    
    loadingScreen.classList.add('hidden');
    modeSwitch.classList.remove('hidden');
    controls.classList.remove('hidden');
    homeBtn.classList.remove('hidden');
    
    isRunning = true;
    requestAnimationFrame(loop);
  } catch (e) {
    alert("Could not start camera or models. Check permissions and console.");
    loadingScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  }
}

function loop(time) {
  if (!isRunning) return;
  
  const results = tracker.detect();
  
  const currentPoints = [];
  let isClearing = false;
  
  if (results && results.landmarks && results.landmarks.length > 0) {
    for (let i = 0; i < results.landmarks.length; i++) {
      const hand = results.landmarks[i];
      
      const isPalm = tracker.isOpenPalm(hand);
      const isFist = tracker.isClosedFist(hand);
      
      if (currentMode === 'flower' && isPalm) {
        if (!renderer.isPopping) {
          renderer.triggerPop();
        }
        isClearing = true;
        activeStrokes = []; 
      }
      
      if (currentMode === 'star' && isFist) {
        if (!isChargingStars) {
          isChargingStars = true;
          renderer.setStarsGlowing(true); 
        }
        isClearing = true;
        activeStrokes = []; 
      }
      
      if (tracker.isPointing(hand)) {
        const tip = tracker.getIndexFingerTip(hand);
        if (tip) {
          currentPoints.push(tip);
        }
      }
    }
  }

  // Handle shooting stars release
  if (currentMode === 'star') {
    let fistCurrentlyFound = false;
    if (results && results.landmarks) {
      for (const hand of results.landmarks) {
        if (tracker.isClosedFist(hand)) {
          fistCurrentlyFound = true;
        }
      }
    }
    
    if (!fistCurrentlyFound && isChargingStars) {
      isChargingStars = false;
      renderer.setStarsGlowing(false); // Explicitly disable glow on release
      renderer.triggerShootingStars();
    }
  }

  if (!isClearing && !renderer.isPopping && !renderer.isShooting && !isChargingStars) {
    const matchedStrokes = new Set();
    
    currentPoints.forEach(pt => {
      let closestStroke = null;
      let minDiff = Infinity;
      
      for (const stroke of activeStrokes) {
        if (matchedStrokes.has(stroke)) continue;
        
        const dist = Math.hypot(pt.x - stroke.smoothedFingertip.x, pt.y - stroke.smoothedFingertip.y);
        
        if (dist < minDiff && dist < MAX_CONNECT_DISTANCE) {
          minDiff = dist;
          closestStroke = stroke;
        }
      }
      
      if (closestStroke) {
        matchedStrokes.add(closestStroke);
        
        const smoothedX = closestStroke.smoothedFingertip.x + (pt.x - closestStroke.smoothedFingertip.x) * SMOOTHING_FACTOR;
        const smoothedY = closestStroke.smoothedFingertip.y + (pt.y - closestStroke.smoothedFingertip.y) * SMOOTHING_FACTOR;
        const smoothedPt = { x: smoothedX, y: smoothedY };
        
        const SPACING = currentMode === 'star' ? STAR_SPACING : FLOWER_SPACING;
        
        const distFromLastParticle = Math.hypot(smoothedPt.x - closestStroke.lastParticlePos.x, smoothedPt.y - closestStroke.lastParticlePos.y);
        
        if (distFromLastParticle >= SPACING) {
          const dx = smoothedPt.x - closestStroke.lastParticlePos.x;
          const dy = smoothedPt.y - closestStroke.lastParticlePos.y;
          
          const origLastX = closestStroke.lastParticlePos.x;
          const origLastY = closestStroke.lastParticlePos.y;
          
          let covered = SPACING;
          while (covered <= distFromLastParticle) {
            const ratio = covered / distFromLastParticle;
            const px = origLastX + dx * ratio;
            const py = origLastY + dy * ratio;
            renderer.addParticle(px, py, currentMode, closestStroke.id);
            
            closestStroke.lastParticlePos = { x: px, y: py };
            covered += SPACING;
          }
        }
        
        closestStroke.lastFingertip = smoothedPt;
        closestStroke.smoothedFingertip = smoothedPt;
        closestStroke.breakStrokeFrames = 0; 
        
      } else {
        const strokeId = Math.random().toString(36);
        renderer.addParticle(pt.x, pt.y, currentMode, strokeId);
        
        activeStrokes.push({
          id: strokeId,
          lastFingertip: pt,
          smoothedFingertip: pt,
          lastParticlePos: pt,
          breakStrokeFrames: 0
        });
        matchedStrokes.add(activeStrokes[activeStrokes.length - 1]);
      }
    });
    
    activeStrokes = activeStrokes.filter(stroke => {
      if (!matchedStrokes.has(stroke)) {
        stroke.breakStrokeFrames++;
        if (stroke.breakStrokeFrames > BREAK_STROKE_THRESHOLD) {
          return false; 
        }
      }
      return true;
    });
  }
  
  renderer.draw(results ? results.landmarks : null, currentMode, activeStrokes);
  requestAnimationFrame(loop);
}

homeBtn.addEventListener('click', () => {
  isRunning = false; // Stop the animation loop
  
  if (renderer) {
    renderer.particles = [];
    renderer.ctx.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
  }
  
  // Hide in-app UI
  modeSwitch.classList.add('hidden');
  controls.classList.add('hidden');
  homeBtn.classList.add('hidden');
  
  // Show start screen
  startScreen.classList.remove('hidden');
});

startBtn.addEventListener('click', start);
init();
