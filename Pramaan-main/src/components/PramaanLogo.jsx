import React from 'react';

/**
 * PRAMAAN Wheat Grain & Leaf Emblem matching reference picture exactly
 */
export default function PramaanLogo({ className = "w-7 h-7", color = "#C8754A" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Stem */}
      <line x1="16" y1="5" x2="16" y2="29" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Top Leaf */}
      <path
        d="M16 4C14.5 7 14.5 9 16 11C17.5 9 17.5 7 16 4Z"
        fill={color}
      />

      {/* Upper Pair */}
      <path
        d="M16 10C12 9 9.5 11 10.5 14.5C12.5 14 14.8 12.5 16 10Z"
        fill={color}
      />
      <path
        d="M16 10C20 9 22.5 11 21.5 14.5C19.5 14 17.2 12.5 16 10Z"
        fill={color}
      />

      {/* Middle Pair */}
      <path
        d="M16 15C11 14 8.5 16.5 9.5 20C12 19.5 14.5 18 16 15Z"
        fill={color}
      />
      <path
        d="M16 15C21 14 23.5 16.5 22.5 20C20 19.5 17.5 18 16 15Z"
        fill={color}
      />

      {/* Lower Pair */}
      <path
        d="M16 20.5C11.5 20 9.5 22.5 10.5 25.5C12.8 25 14.8 23.5 16 20.5Z"
        fill={color}
      />
      <path
        d="M16 20.5C20.5 20 22.5 22.5 21.5 25.5C19.2 25 17.2 23.5 16 20.5Z"
        fill={color}
      />
    </svg>
  );
}
