export class Renderer {
  constructor(canvas, videoElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.videoElement = videoElement;
    this.particles = [];
    this.sprites = [];
    
    // State
    this.wasPalmOpen = false;
    this.isPopping = false;
    this.isShooting = false;
    this.isStarsGlowing = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  async loadSprites() {
    const urls = [
      '/blue_flower.jpg', '/yellow_flower.jpg', '/red_rose.jpg', 
      '/white_daisy.jpg', '/wildflowers.jpg', '/cherry_blossom.jpg', 
      '/purple_lotus.jpg', '/orange_marigold.jpg', '/green_leaf.jpg', 
      '/green_leaf.jpg' // extra leaves for probability
    ];
    for (const url of urls) {
      const img = new Image();
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const offscreen = document.createElement('canvas');
      offscreen.width = img.width;
      offscreen.height = img.height;
      const ctx = offscreen.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imageData.data;

      // Extract flower shape by removing black background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = Math.max(r, g, b);

        if (alpha > 0) {
          data[i] = Math.min(255, (r / alpha) * 255);
          data[i + 1] = Math.min(255, (g / alpha) * 255);
          data[i + 2] = Math.min(255, (b / alpha) * 255);
        }
        data[i + 3] = alpha; // Set alpha based on brightness
      }
      ctx.putImageData(imageData, 0, 0);

      const transparentImg = new Image();
      transparentImg.src = offscreen.toDataURL('image/png');
      await new Promise((resolve) => { transparentImg.onload = resolve; });

      this.sprites.push(transparentImg);
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addParticle(x, y, mode, strokeId) {
    if (this.isPopping || this.isShooting) return;

    if (mode === 'flower') {
      const size = Math.random() * 10 + 25; 
      const spriteIndex = Math.floor(Math.random() * this.sprites.length);
      const rotation = Math.random() * Math.PI * 2;

      this.particles.push({
        mode: 'flower',
        x: x * this.canvas.width,
        y: y * this.canvas.height,
        size,
        rotation,
        sprite: this.sprites[spriteIndex],
        popping: false,
        velocity: { x: 0, y: 0 },
        opacity: 1
      });
    } else if (mode === 'star') {
      const size = Math.random() * 8 + 12; // 12 to 20 (small stars)
      this.particles.push({
        mode: 'star',
        strokeId,
        x: x * this.canvas.width,
        y: y * this.canvas.height,
        size,
        rotation: Math.random() * Math.PI * 2,
        opacity: 0.9,
        shooting: false,
        velocity: { x: 0, y: 0 }
      });
    }
  }

  triggerPop() {
    if (this.isPopping) return;
    this.isPopping = true;

    this.particles.forEach(p => {
      if (p.mode === 'flower') {
        p.popping = true;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5;
        p.velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        };
      }
    });

    setTimeout(() => {
      this.particles = this.particles.filter(p => p.mode !== 'flower');
      this.isPopping = false;
    }, 1000); // 1s animation
  }

  setStarsGlowing(glowing) {
    this.isStarsGlowing = glowing;
  }

  triggerShootingStars() {
    this.isStarsGlowing = false;

    let startedShooting = false;
    this.particles.forEach(p => {
      if (p.mode === 'star' && !p.shooting) {
        p.shooting = true;
        startedShooting = true;
        
        // Meteor shower angle: Up-Right diagonal
        const angle = -Math.PI / 4 + (Math.random() * 0.15 - 0.075); 
        const speed = Math.random() * 15 + 10;
        p.velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        };
      }
    });
  }

  drawStar(ctx, x, y, size, rotation, opacity, glowing) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    
    if (glowing) {
      size *= 1.5; // Expand significantly when charged
      
      // Draw intense radial glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3.5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 245, 181, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 245, 181, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.fillStyle = '#ffffff'; // White hot center
    } else {
      // Draw soft baseline radial glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.5);
      gradient.addColorStop(0, 'rgba(255, 224, 102, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 224, 102, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.fillStyle = '#ffe066'; // Normal yellow
    }
    
    // Draw 5-pointed star
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * size,
                 -Math.sin((18 + i * 72) / 180 * Math.PI) * size);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (size / 2.5),
                 -Math.sin((54 + i * 72) / 180 * Math.PI) * (size / 2.5));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawHandTracking(landmarksList, mode) {
    if (!landmarksList || landmarksList.length === 0) return;
    if (mode === 'star') return; // Hide tracking in star mode
    
    // Define hand connections
    const connections = [
      [0,1], [1,2], [2,3], [3,4], // Thumb
      [0,5], [5,6], [6,7], [7,8], // Index
      [5,9], [9,10], [10,11], [11,12], // Middle
      [9,13], [13,14], [14,15], [15,16], // Ring
      [13,17], [0,17], [17,18], [18,19], [19,20] // Pinky & Palm
    ];

    this.ctx.globalAlpha = 0.5;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#ffffff';

    for (const hand of landmarksList) {
      // Draw lines
      this.ctx.beginPath();
      for (const [start, end] of connections) {
        const startPt = hand[start];
        const endPt = hand[end];
        this.ctx.moveTo((1 - startPt.x) * this.canvas.width, startPt.y * this.canvas.height);
        this.ctx.lineTo((1 - endPt.x) * this.canvas.width, endPt.y * this.canvas.height);
      }
      this.ctx.stroke();

      // Draw joints
      for (let i = 0; i < hand.length; i++) {
        const lm = hand[i];
        this.ctx.beginPath();
        if (i === 8) {
           this.ctx.fillStyle = '#f72585'; // Match UI accent color
           this.ctx.arc((1 - lm.x) * this.canvas.width, lm.y * this.canvas.height, 8, 0, 2 * Math.PI);
        } else {
           this.ctx.fillStyle = '#ffffff'; // White joints instead of green
           this.ctx.arc((1 - lm.x) * this.canvas.width, lm.y * this.canvas.height, 4, 0, 2 * Math.PI);
        }
        this.ctx.fill();
      }
    }
    
    this.ctx.globalAlpha = 1.0;
  }

  draw(landmarks = null, currentMode = 'flower', activeStrokes = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (landmarks) {
      this.drawHandTracking(landmarks, currentMode);
    }

    // --- DRAW CONSTELLATION LINES ---
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.isStarsGlowing ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.4)';
    
    // Add baseline glow for lines, intense glow when charged
    this.ctx.shadowBlur = this.isStarsGlowing ? 20 : 5;
    this.ctx.shadowColor = '#ffffff';
    
    let lastP = null;
    this.ctx.beginPath();
    for (const p of this.particles) {
      if (p.mode === 'star' && !p.shooting) {
        if (lastP && lastP.strokeId === p.strokeId) {
          this.ctx.moveTo(lastP.x, lastP.y);
          this.ctx.lineTo(p.x, p.y);
        }
        lastP = p;
      } else {
        lastP = null;
      }
    }
    
    // Draw lead lines to the active fingers
    for (const stroke of activeStrokes) {
      if (currentMode !== 'star') break;
      let lastParticle = null;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].strokeId === stroke.id && !this.particles[i].shooting) {
          lastParticle = this.particles[i];
          break;
        }
      }
      if (lastParticle) {
        this.ctx.moveTo(lastParticle.x, lastParticle.y);
        this.ctx.lineTo(stroke.smoothedFingertip.x * this.canvas.width, stroke.smoothedFingertip.y * this.canvas.height);
      }
    }
    
    this.ctx.stroke();
    this.ctx.shadowBlur = 0; // reset

    // --- DRAW PARTICLES ---
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      this.ctx.save();

      if (p.mode === 'flower') {
        if (p.popping) {
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.rotation += 0.1;
          p.size *= 1.02;
          p.opacity -= 0.02;
          if (p.opacity <= 0) p.opacity = 0;
        }

        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        if (p.sprite && p.opacity > 0) {
          this.ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        }
      } 
      else if (p.mode === 'star') {
        if (p.shooting) {
          // Acceleration for realistic meteor effect
          p.velocity.x *= 1.05;
          p.velocity.y *= 1.05;
          
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.rotation += 0.1;
          p.opacity -= 0.015; // Fade out
          p.size *= 0.96; // Burn up
          
          if (p.opacity <= 0) p.opacity = 0;
          
          if (p.opacity > 0) {
            // Draw realistic fading light trail
            const tailLength = Math.max(10, Math.hypot(p.velocity.x, p.velocity.y) * 2);
            const tailX = p.x - Math.cos(Math.atan2(p.velocity.y, p.velocity.x)) * tailLength;
            const tailY = p.y - Math.sin(Math.atan2(p.velocity.y, p.velocity.x)) * tailLength;
            
            const grad = this.ctx.createLinearGradient(p.x, p.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
            grad.addColorStop(0.3, `rgba(255, 245, 181, ${p.opacity * 0.8})`);
            grad.addColorStop(1, `rgba(255, 245, 181, 0)`);
            
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(tailX, tailY);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = Math.max(1, p.size / 2);
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
          }
        }

        if (p.opacity > 0) {
          this.drawStar(this.ctx, p.x, p.y, p.size, p.rotation, p.opacity, this.isStarsGlowing);
        }
      }

      this.ctx.restore();
    }
    
    // Automatically clean up invisible dead particles
    this.particles = this.particles.filter(p => p.opacity > 0.01 || (!p.shooting && !p.popping));
    
    // Prevent catastrophic lag by enforcing a maximum particle limit
    // If we exceed 300 particles, forcefully animate the oldest ones away
    if (this.particles.length > 300) {
      const excess = this.particles.length - 300;
      for (let i = 0; i < excess; i++) {
        const p = this.particles[i];
        if (p.mode === 'flower' && !p.popping) {
           p.popping = true;
           const angle = Math.random() * Math.PI * 2;
           const speed = Math.random() * 5 + 2;
           p.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        } else if (p.mode === 'star' && !p.shooting) {
           p.shooting = true;
           const angle = -Math.PI / 4 + (Math.random() * 0.15 - 0.075); 
           const speed = Math.random() * 15 + 10;
           p.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        }
      }
    }
  }
}
