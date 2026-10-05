import React, { useEffect, useRef, useState } from 'react';

/**
 * Premium Custom Cursor matching the reference image:
 * - Center warm copper dot (#C8754A)
 * - Trailing smooth shadow follower circle
 * - Tiny orbiting satellite dot that rotates around the pointer
 * - Expands and accelerates orbit on hover over cards, markers, and buttons
 */
export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const shadowPos = useRef({ x: -100, y: -100 });
  const satelliteAngle = useRef(0);

  const dotRef = useRef(null);
  const shadowRef = useRef(null);
  const satelliteRef = useRef(null);
  const outerRingRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!cursorVisible) setCursorVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering an interactive target
      const target = e.target.closest(
        'button, a, .project-card, .media-card, .evidence-claim, .map-marker, [data-cursor="target"], input, select, .cursor-pointer'
      );
      setIsHovered(Boolean(target));
    };

    const onMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    let animationFrameId;
    const animate = () => {
      // Smooth trailing physics for shadow follower (lerp)
      const lerp = 0.18;
      shadowPos.current.x += (mousePos.current.x - shadowPos.current.x) * lerp;
      shadowPos.current.y += (mousePos.current.y - shadowPos.current.y) * lerp;

      if (shadowRef.current) {
        shadowRef.current.style.transform = `translate3d(${shadowPos.current.x}px, ${shadowPos.current.y}px, 0)`;
      }

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${shadowPos.current.x}px, ${shadowPos.current.y}px, 0)`;
      }

      // Orbiting satellite angle calculation
      const speed = isHovered ? 0.08 : 0.045;
      satelliteAngle.current += speed;
      const radius = isHovered ? 20 : 13;

      const satX = mousePos.current.x + Math.cos(satelliteAngle.current) * radius;
      const satY = mousePos.current.y + Math.sin(satelliteAngle.current) * radius;

      if (satelliteRef.current) {
        satelliteRef.current.style.transform = `translate3d(${satX}px, ${satY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorVisible, isHovered]);

  if (!cursorVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Trailing Outer Ring (as seen in the reference screenshot between cards) */}
      <div
        ref={outerRingRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-[#C8754A]/30 transition-all duration-300 pointer-events-none ${
          isHovered ? 'scale-125 border-[#C8754A]/60 bg-[#C8754A]/10' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* 2. Trailing Subtle Shadow Disc */}
      <div
        ref={shadowRef}
        className={`fixed top-0 left-0 -ml-2 -mt-2 w-4 h-4 rounded-full bg-[#C8754A]/20 transition-all duration-200 pointer-events-none ${
          isHovered ? 'scale-150 bg-[#C8754A]/35' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* 3. Orbiting Satellite Dot */}
      <div
        ref={satelliteRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none shadow-sm transition-colors duration-150 ${
          isHovered ? 'bg-[#D5A04B] shadow-[#D5A04B]/50' : 'bg-[#C8754A]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* 4. Center Main Copper Pointer Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full border border-[#11110F] shadow-md pointer-events-none transition-transform duration-100 ${
          isHovered ? 'bg-[#D5A04B] scale-110' : 'bg-[#C8754A] scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
