import React from "react";

const MingoLogo = ({ size = 36, className = "" }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Rear Bubble Gradient: Rich Emerald-Teal */}
          <linearGradient id="mingoGradRear" x1="6" y1="6" x2="30" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          {/* Front Bubble Gradient: Glowing Mint to Cyan */}
          <linearGradient id="mingoGradFront" x1="16" y1="14" x2="44" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Glass Gloss Overlay */}
          <linearGradient id="mingoGloss" x1="28" y1="16" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Drop shadow for 3D depth between bubbles */}
          <filter id="bubbleShadow" x="12" y="10" width="36" height="36" filterUnits="userSpaceOnUse">
            <feDropShadow dx="-1" dy="2" stdDeviation="2.5" floodColor="#042f2e" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Rear Bubble (Left Partner Bubble) */}
        <path
          d="M18 8C11.37 8 6 13.15 6 19.5C6 22.65 7.27 25.48 9.35 27.53L7.5 34L13.8 32.12C15.1 32.69 16.51 33 18 33C24.63 33 30 27.85 30 21.5C30 15.15 24.63 8 18 8Z"
          fill="url(#mingoGradRear)"
          opacity="0.9"
        />

        {/* 2. Front Bubble (Right Vibrant Connected Bubble with Depth) */}
        <g filter="url(#bubbleShadow)">
          <path
            d="M30 14C22.27 14 16 19.82 16 27C16 30.56 17.43 33.75 19.78 36.05L18 43L25.1 40.91C26.65 41.61 28.29 42 30 42C37.73 42 44 36.18 44 27C44 19.82 37.73 14 30 14Z"
            fill="url(#mingoGradFront)"
          />
        </g>

        {/* 3. Gloss Reflection on Front Bubble */}
        <path
          d="M30 15C22.8 15 17 20.37 17 27C17 28.5 17.34 29.93 17.96 31.22C19.25 22.86 24.58 16.57 31.2 15.18C30.81 15.06 30.41 15 30 15Z"
          fill="url(#mingoGloss)"
        />

        {/* 4. Three Human Chat Dots (Connected Conversation) */}
        <circle cx="25.5" cy="27" r="2" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="30" cy="27" r="2" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="34.5" cy="27" r="2" fill="#ffffff" fillOpacity="0.95" />
      </svg>
    </div>
  );
};

export default MingoLogo;

