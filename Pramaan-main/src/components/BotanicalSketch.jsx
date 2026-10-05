import React from 'react';

/**
 * Delicate single-line botanical branch illustration matching the bottom of the sidebar in the reference picture
 */
export default function BotanicalSketch({ className = "w-14 h-14", color = "#C8754A" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 42C12 30 20 20 38 10"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Leaves branching out */}
      <path
        d="M20 26C16 23 15 17 21 16C23 20 22 24 20 26Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M27 19C29 13 35 12 36 17C32 20 28 20 27 19Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M32 14C36 8 42 9 41 15C37 16 34 15 32 14Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M14 34C9 32 9 26 15 26C17 29 16 33 14 34Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
