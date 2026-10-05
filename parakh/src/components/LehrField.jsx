import { useEffect, useRef } from 'react';

export default function LehrField({ particleCount = 300, speed = 0.16, ringMode = false, dimmed = false, cursorSatellite = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: innerWidth * 0.52, y: innerHeight * 0.52, active: false };

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerleave', onLeave);
    resize();

    const count = Math.min(particleCount, 420);
    const particles = Array.from({ length: count }, (_, i) => ({
      u: Math.random(),
      lane: i % 4,
      phase: Math.random() * Math.PI * 2,
      drift: 0.55 + Math.random() * 0.8,
      red: ringMode && i < 16,
      size: i % 11 === 0 ? 1.65 : 1.05,
    }));

    const wave = (x, lane, time) =>
      innerHeight * (0.235 + lane * 0.145) +
      Math.sin(x * 0.0058 + time * (0.00048 + lane * 0.00008) + lane) * 34 +
      Math.sin(x * 0.0019 - time * 0.00027 + lane * 1.7) * 20;

    const drawCursor = () => {
      if (!cursorSatellite || !mouse.active || reduced) return;
      const { x, y } = mouse;
      const phase = t * 0.0034;
      const orbitX = x + Math.cos(phase) * 46;
      const orbitY = y + Math.sin(phase) * 18;

      const halo = ctx.createRadialGradient(x, y, 0, x, y, 95);
      halo.addColorStop(0, 'rgba(217,164,65,0.08)');
      halo.addColorStop(0.35, 'rgba(217,164,65,0.025)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.22);
      ctx.beginPath();
      ctx.ellipse(0, 0, 58, 22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217,164,65,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      for (let i = 4; i >= 1; i--) {
        const p = phase - i * 0.12;
        const tx = x + Math.cos(p) * 46;
        const ty = y + Math.sin(p) * 18;
        ctx.fillStyle = `rgba(217,164,65,${0.035 + (5 - i) * 0.02})`;
        ctx.beginPath();
        ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(217,164,65,0.95)';
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217,164,65,0.45)';
      ctx.beginPath();
      ctx.arc(orbitX, orbitY, 7, 0, Math.PI * 2);
      ctx.stroke();

      // A small, warm shadow beneath the pointer makes movement feel physical without replacing the native cursor.
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath();
      ctx.ellipse(x + 7, y + 10, 12, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const alpha = dimmed ? 0.07 : 0.17;

      for (let lane = 0; lane < 4; lane++) {
        ctx.beginPath();
        for (let x = 0; x <= innerWidth; x += 10) {
          const y = wave(x, lane, t);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lane % 2 ? `rgba(124,147,166,${alpha})` : `rgba(217,164,65,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach((p, i) => {
        p.u += (reduced ? 0 : speed * 0.000075 * p.drift);
        if (p.u > 1) p.u = 0;
        let x = p.u * innerWidth;
        let y = wave(x, p.lane, t + p.phase * 30);
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 145 && d > 0) {
          const push = (1 - d / 145) * 17;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
        ctx.beginPath();
        ctx.arc(x, y, p.red ? 2.2 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.red ? 'rgba(228,87,46,.88)' : i % 5 === 0 ? 'rgba(124,147,166,.62)' : 'rgba(217,164,65,.62)';
        ctx.fill();
      });

      drawCursor();
      t += reduced ? 0 : 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerleave', onLeave);
    };
  }, [particleCount, speed, ringMode, dimmed, cursorSatellite]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
}
