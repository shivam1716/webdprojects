import { CONFIG } from '../utils/config.js';

export const FRUIT_TYPES = {
  WATERMELON: { color1: '#2ecc71', color2: '#e74c3c', radius: 40, points: 10 },
  ORANGE: { color1: '#f39c12', color2: '#e67e22', radius: 35, points: 10 },
  APPLE: { color1: '#e74c3c', color2: '#c0392b', radius: 30, points: 15 },
  BANANA: { color1: '#f1c40f', color2: '#f39c12', radius: 30, points: 15, isLong: true },
};

export class Fruit {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Pick random fruit type
    const types = Object.values(FRUIT_TYPES);
    this.type = types[Math.floor(Math.random() * types.length)];
    
    this.radius = this.type.radius;
    
    // Spawn at bottom
    this.x = Math.random() * (canvasWidth - 100) + 50;
    this.y = canvasHeight + this.radius;
    
    // Trajectory towards center-ish
    const targetX = canvasWidth / 2 + (Math.random() - 0.5) * 200;
    const dx = targetX - this.x;
    
    this.velocityX = dx * 0.015; 
    // Random upwards velocity
    this.velocityY = -(Math.random() * 4 + 10);
    
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    
    this.isSliced = false;
    this.isActive = true; // Set to false when it falls off screen or is sliced
  }

  update() {
    if (!this.isActive) return;

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += CONFIG.GRAVITY;
    this.rotation += this.rotationSpeed;

    // Check if fallen off screen
    if (this.y > this.canvasHeight + this.radius * 2) {
      this.isActive = false;
    }
  }

  draw(ctx) {
    if (!this.isActive || this.isSliced) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Glowing shadow
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.type.color1;

    // Draw fruit (simplified as colorful circles/ovals for now, will polish later)
    ctx.beginPath();
    if (this.type.isLong) {
      // Banana shape approximation
      ctx.ellipse(0, 0, this.radius, this.radius / 2, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    }
    
    // Gradient fill
    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, this.radius);
    grad.addColorStop(0, this.type.color2);
    grad.addColorStop(1, this.type.color1);
    
    ctx.fillStyle = grad;
    ctx.fill();

    // Inner detail (e.g. skin vs flesh)
    ctx.beginPath();
    ctx.shadowBlur = 0;
    if (this.type.isLong) {
      ctx.ellipse(0, 0, this.radius * 0.8, this.radius * 0.4, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
    }
    ctx.fillStyle = this.type.color2;
    ctx.fill();

    ctx.restore();
  }
}
