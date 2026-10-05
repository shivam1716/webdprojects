import { HandTracker } from './hand/HandTracker.js';
import { CONFIG } from './utils/config.js';
import { Fruit } from './game/Fruit.js';
import { Bomb } from './game/Bomb.js';
import { lineIntersectsCircle } from './game/collision.js';
import { ParticleSystem } from './game/Particles.js';
import { AudioManager } from './audio/AudioManager.js';

class GameApp {
  constructor() {
    this.video = document.getElementById('webcam');
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // UI Elements
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.btnStart = document.getElementById('btn-start');
    this.btnRetryCam = document.getElementById('btn-retry-cam');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnMainMenu = document.getElementById('btn-main-menu');
    this.cameraError = document.getElementById('camera-error');
    this.trackingLostMsg = document.getElementById('tracking-lost');
    this.debugToggle = document.getElementById('debug-toggle');
    this.soundToggle = document.getElementById('sound-toggle');
    this.hud = document.getElementById('hud');
    this.scoreElement = document.getElementById('score');
    this.finalScoreElement = document.getElementById('final-score');
    this.bestScoreElement = document.getElementById('best-score');
    
    this.comboContainer = document.querySelector('.combo-container');
    this.comboElement = document.getElementById('combo');
    this.lifeElements = document.querySelectorAll('.life');

    this.handTracker = new HandTracker(
      this.video, 
      this.onHandsDetected.bind(this), 
      this.onTrackingLost.bind(this)
    );

    this.audioManager = new AudioManager();
    this.particleSystem = new ParticleSystem();

    this.isRunning = false;
    this.handsData = []; // Array of hand objects { label, currentPosition, trail, landmarks, swipe }
    
    // Game State
    this.score = 0;
    this.lives = CONFIG.STARTING_LIVES;
    this.combo = 0;
    this.lastSliceTime = 0;
    
    this.spawnables = [];
    this.lastSpawnTime = 0;
    
    this.currentSpawnInterval = CONFIG.FRUIT_SPAWN_INTERVAL_MS;

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    
    this.bindEvents();
    
    this.bestScore = parseInt(localStorage.getItem('fn_best_score') || '0');
  }

  bindEvents() {
    this.btnStart.addEventListener('click', () => {
      if (this.audioManager.ctx.state === 'suspended') {
        this.audioManager.ctx.resume();
      }
      this.startGame();
    });
    this.btnRetryCam.addEventListener('click', () => this.startGame());
    this.btnPlayAgain.addEventListener('click', () => {
      this.resetGame();
    });
    this.btnMainMenu.addEventListener('click', () => {
      this.gameOverScreen.classList.add('hidden');
      this.startScreen.classList.remove('hidden');
    });
    
    this.debugToggle.addEventListener('change', (e) => {
      CONFIG.DEBUG_MODE = e.target.checked;
    });

    this.soundToggle.addEventListener('change', (e) => {
      this.audioManager.enabled = e.target.checked;
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  async startGame() {
    this.btnStart.innerText = "INITIALIZING...";
    this.btnStart.disabled = true;
    this.cameraError.classList.add('hidden');
    this.btnRetryCam.classList.add('hidden');

    const camSuccess = await this.handTracker.requestCamera();
    if (!camSuccess) {
      this.cameraError.classList.remove('hidden');
      this.btnRetryCam.classList.remove('hidden');
      this.btnStart.innerText = "START GAME";
      this.btnStart.disabled = false;
      return;
    }

    this.btnStart.innerText = "LOADING AI...";
    const mpSuccess = await this.handTracker.initialize();
    if (!mpSuccess) {
      this.cameraError.innerText = "Failed to load hand tracking model.";
      this.cameraError.classList.remove('hidden');
      this.btnStart.innerText = "START GAME";
      this.btnStart.disabled = false;
      return;
    }

    this.startScreen.classList.add('hidden');
    this.btnStart.innerText = "START GAME";
    this.btnStart.disabled = false;
    this.resetGame();
  }

  resetGame() {
    this.gameOverScreen.classList.add('hidden');
    this.hud.classList.remove('hidden');
    
    this.score = 0;
    this.lives = CONFIG.STARTING_LIVES;
    this.combo = 0;
    this.currentSpawnInterval = CONFIG.FRUIT_SPAWN_INTERVAL_MS;
    
    this.spawnables = [];
    this.particleSystem = new ParticleSystem();
    this.lastSpawnTime = performance.now();
    this.lastSliceTime = 0;
    
    this.handTracker.resetHistory();
    this.handsData = [];
    
    this.updateHUD();
    
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }
  
  endGame() {
    this.isRunning = false;
    this.hud.classList.add('hidden');
    this.gameOverScreen.classList.remove('hidden');
    
    this.finalScoreElement.innerText = this.score;
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('fn_best_score', this.bestScore.toString());
    }
    this.bestScoreElement.innerText = this.bestScore;
  }

  updateHUD() {
    this.scoreElement.innerText = this.score;
    
    this.lifeElements.forEach((el, index) => {
      if (index < this.lives) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    if (this.combo > 1) {
      this.comboContainer.classList.remove('hidden');
      this.comboElement.innerText = this.combo;
    } else {
      this.comboContainer.classList.add('hidden');
    }
  }

  onHandsDetected(handsData) {
    this.handsData = handsData;
    this.trackingLostMsg.classList.add('hidden');
  }

  onTrackingLost() {
    this.handsData = [];
    this.trackingLostMsg.classList.remove('hidden');
  }
  
  spawnObjects(now) {
    if (now - this.lastSpawnTime > this.currentSpawnInterval) {
      if (this.spawnables.length < CONFIG.MAX_FRUITS_ON_SCREEN) {
        const count = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < count; i++) {
          if (Math.random() < CONFIG.BOMB_PROBABILITY) {
            this.spawnables.push(new Bomb(this.canvas.width, this.canvas.height));
          } else {
            this.spawnables.push(new Fruit(this.canvas.width, this.canvas.height));
          }
        }
        
        if (this.currentSpawnInterval > 500) {
          this.currentSpawnInterval -= 10;
        }
      }
      this.lastSpawnTime = now;
    }
  }

  gameLoop(now) {
    if (!this.isRunning) return;
    
    if (this.combo > 1 && now - this.lastSliceTime > 1500) {
      this.combo = 0;
      this.updateHUD();
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.handTracker.detect(this.canvas.width, this.canvas.height);
    this.spawnObjects(now);
    
    this.spawnables.forEach(obj => {
      obj.update();
      obj.draw(this.ctx);
      
      if (!obj.isActive && !obj.isSliced && !obj.isBomb) {
        if (this.combo > 1) {
          this.combo = 0;
          this.updateHUD();
        }
      }
    });
    this.spawnables = this.spawnables.filter(f => f.isActive);

    this.particleSystem.update();
    this.particleSystem.draw(this.ctx);

    // Handle each detected hand independently
    if (this.handsData.length > 0) {
      this.handsData.forEach(hand => {
        this.drawBlade(hand.trail, hand.label);
        
        if (hand.swipe) {
          this.checkCollisions(hand.swipe, now);
        }
        
        if (CONFIG.DEBUG_MODE) {
          this.drawDebug(hand.landmarks, hand.swipe, hand.label);
        }
      });
      
      // Global debug text for hands detected
      if (CONFIG.DEBUG_MODE) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Hands detected: ${this.handsData.length}`, 20, 50);
        this.handsData.forEach((h, i) => {
          this.ctx.fillText(`${h.label} hand: detected`, 20, 80 + (i * 30));
        });
      }
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  checkCollisions(swipe, now) {
    let slicedThisFrame = false;

    this.spawnables.forEach(obj => {
      if (!obj.isActive || obj.isSliced) return;
      
      const hit = lineIntersectsCircle(
        swipe.startX, swipe.startY, 
        swipe.endX, swipe.endY, 
        obj.x, obj.y, 
        obj.radius
      );
      
      if (hit) {
        obj.isSliced = true;
        obj.isActive = false;
        
        if (obj.isBomb) {
          this.audioManager.playBomb();
          this.particleSystem.createExplosion(obj.x, obj.y, '#ff3333');
          this.particleSystem.createFloatingText(obj.x, obj.y, "BOMB!", '#ff3333');
          
          this.lives--;
          this.combo = 0;
          this.updateHUD();
          
          if (this.lives <= 0) {
            this.endGame();
          }
        } else {
          slicedThisFrame = true;
          this.audioManager.playSlice();
          
          const dx = swipe.endX - swipe.startX;
          const dy = swipe.endY - swipe.startY;
          this.particleSystem.createSlicedFruit(obj, dx, dy);
          this.particleSystem.createExplosion(obj.x, obj.y, obj.type.color1);
          
          if (now - this.lastSliceTime < 500) {
            this.combo++;
          } else {
            this.combo = 1;
          }
          this.lastSliceTime = now;
          
          let points = obj.type.points;
          let text = `+${points}`;
          if (this.combo > 1) {
            points *= this.combo;
            text = `COMBO x${this.combo} (+${points})`;
          }
          
          this.particleSystem.createFloatingText(obj.x, obj.y, text, obj.type.color1);
          
          this.score += points;
          this.updateHUD();
        }
      }
    });
    
    if (!slicedThisFrame && swipe.speed > 1.5 && Math.random() < 0.1) {
      this.audioManager.playSwipe();
    }
  }

  drawBlade(trail, label) {
    if (!trail || trail.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      this.ctx.lineTo(trail[i].x, trail[i].y);
    }

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 15;
    
    // Slight color variance based on hand label for visual flair (optional, but requested in debug so why not here)
    if (label === 'Left') {
      this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.2)';
      this.ctx.shadowColor = '#ff3333';
    } else if (label === 'Right') {
      this.ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)';
      this.ctx.shadowColor = '#3333ff';
    } else {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.shadowColor = '#00ffff';
    }
    
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();

    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  drawDebug(landmarks, swipe, label) {
    const markerColor = label === 'Left' ? 'magenta' : 'cyan';

    if (landmarks) {
      this.ctx.fillStyle = markerColor;
      landmarks.forEach((lm, index) => {
        const x = (1 - lm.x) * this.canvas.width;
        const y = lm.y * this.canvas.height;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        if (index === 8) {
          this.ctx.fillStyle = 'white';
          this.ctx.fillText(`${label} (Tip)`, x + 10, y);
        }
      });
    }

    if (swipe) {
      this.ctx.beginPath();
      this.ctx.moveTo(swipe.startX, swipe.startY);
      this.ctx.lineTo(swipe.endX, swipe.endY);
      this.ctx.strokeStyle = 'green';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      this.ctx.fillStyle = 'lime';
      this.ctx.font = '16px Arial';
      this.ctx.fillText(`Speed: ${swipe.speed.toFixed(2)}`, swipe.endX, swipe.endY - 20);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
