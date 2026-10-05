import { CONFIG } from '../utils/config.js';

export class Bomb {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.radius = 35;
    this.isBomb = true; // Identifier for collision check
    
    this.x = Math.random() * (canvasWidth - 100) + 50;
    this.y = canvasHeight + this.radius;
    
    const targetX = canvasWidth / 2 + (Math.random() - 0.5) * 200;
    const dx = targetX - this.x;
    
    this.velocityX = dx * 0.015; 
    this.velocityY = -(Math.random() * 4 + 10);
    
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    
    this.isSliced = false;
    this.isActive = true;
  }

  update() {
    if (!this.isActive) return;

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += CONFIG.GRAVITY;
    this.rotation += this.rotationSpeed;

    if (this.y > this.canvasHeight + this.radius * 2) {
      this.isActive = false;
    }
  }

  draw(ctx) {
    if (!this.isActive || this.isSliced) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#000000';

    // Bomb body
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Red glowing core or highlight
    ctx.beginPath();
    ctx.arc(-10, -10, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3333';
    ctx.fill();
    
    // Fuse
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.quadraticCurveTo(20, -this.radius - 20, 10, -this.radius - 30);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#888';
    ctx.stroke();

    // Spark on fuse
    ctx.beginPath();
    ctx.arc(10, -this.radius - 30, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f39c12';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f1c40f';
    ctx.fill();

    ctx.restore();
  }
}
