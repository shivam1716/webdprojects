import { CONFIG } from '../utils/config.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.fruitHalves = [];
    this.floatingTexts = [];
  }

  createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        radius: Math.random() * 4 + 2,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.02
      });
    }
  }

  createSlicedFruit(fruit, swipeDx, swipeDy) {
    // Determine slice angle from swipe direction
    const sliceAngle = Math.atan2(swipeDy, swipeDx);
    
    // Perpendicular vectors for the two halves to fly apart
    const perpX = -Math.sin(sliceAngle) * 5;
    const perpY = Math.cos(sliceAngle) * 5;

    // Create two halves
    this.fruitHalves.push({
      x: fruit.x, y: fruit.y,
      vx: fruit.velocityX + perpX, vy: fruit.velocityY + perpY,
      rotation: fruit.rotation,
      rotationSpeed: fruit.rotationSpeed + 0.1,
      type: fruit.type,
      radius: fruit.radius,
      life: 1.0
    });
    
    this.fruitHalves.push({
      x: fruit.x, y: fruit.y,
      vx: fruit.velocityX - perpX, vy: fruit.velocityY - perpY,
      rotation: fruit.rotation,
      rotationSpeed: fruit.rotationSpeed - 0.1,
      type: fruit.type,
      radius: fruit.radius,
      life: 1.0
    });
  }

  createFloatingText(x, y, text, color = '#fff') {
    this.floatingTexts.push({
      x: x,
      y: y,
      text: text,
      color: color,
      life: 1.0,
      vy: -2
    });
  }

  update() {
    // Update Particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    });
    this.particles = this.particles.filter(p => p.life > 0);

    // Update Fruit Halves
    this.fruitHalves.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      h.vy += CONFIG.GRAVITY;
      h.rotation += h.rotationSpeed;
      h.life -= 0.01;
    });
    this.fruitHalves = this.fruitHalves.filter(h => h.life > 0);

    // Update Floating Text
    this.floatingTexts.forEach(t => {
      t.y += t.vy;
      t.life -= 0.02;
    });
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
  }

  draw(ctx) {
    // Draw Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw Fruit Halves
    this.fruitHalves.forEach(h => {
      ctx.globalAlpha = h.life;
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      
      ctx.beginPath();
      if (h.type.isLong) {
        ctx.ellipse(0, 0, h.radius, h.radius / 2, 0, 0, Math.PI); // Draw half ellipse
      } else {
        ctx.arc(0, 0, h.radius, 0, Math.PI); // Draw half circle
      }
      
      const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, h.radius);
      grad.addColorStop(0, h.type.color2);
      grad.addColorStop(1, h.type.color1);
      ctx.fillStyle = grad;
      ctx.fill();
      
      // Inner detail
      ctx.beginPath();
      if (h.type.isLong) {
        ctx.ellipse(0, 0, h.radius * 0.8, h.radius * 0.4, 0, 0, Math.PI);
      } else {
        ctx.arc(0, 0, h.radius * 0.8, 0, Math.PI);
      }
      ctx.fillStyle = h.type.color2;
      ctx.fill();

      ctx.restore();
    });
    ctx.globalAlpha = 1.0;

    // Draw Floating Text
    this.floatingTexts.forEach(t => {
      ctx.globalAlpha = t.life;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 24px Arial';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'black';
      ctx.fillText(t.text, t.x, t.y);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1.0;
  }
}
