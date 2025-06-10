import React from 'react';

/**
 * SVG Logo component for Mehl & Modell
 * Represents a bread loaf with connected nodes in a graph-like structure
 */
const Logo = ({ height = 32, width = 80, className = '' }) => {
  const primaryColor = '#5D4037'; // Brown color for outlines and nodes
  const secondaryColor = '#E6CCA0'; // Tan color for bread fill
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 50" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bread loaf */}
      <path 
        d="M15 30 C15 15, 40 10, 45 25 C50 15, 60 20, 58 30 C58 40, 15 40, 15 30 Z" 
        fill={secondaryColor} 
        stroke={primaryColor} 
        strokeWidth="3"
      />
      
      {/* Bread details/lines */}
      <path 
        d="M25 22 C28 28, 29 28, 32 22" 
        fill="none" 
        stroke={primaryColor} 
        strokeWidth="1.5"
      />
      
      {/* First node (top) */}
      <circle cx="65" cy="15" r="5" fill="white" stroke={primaryColor} strokeWidth="3" />
      
      {/* Second node (middle-right) */}
      <circle cx="78" cy="30" r="4" fill="white" stroke={primaryColor} strokeWidth="3" />
      
      {/* Third node (bottom-right) */}
      <circle cx="70" cy="43" r="3.5" fill="white" stroke={primaryColor} strokeWidth="3" />
      
      {/* Connecting lines between nodes and bread */}
      <line x1="58" y1="28" x2="65" y2="15" stroke={primaryColor} strokeWidth="3" />
      <line x1="58" y1="30" x2="74" y2="30" stroke={primaryColor} strokeWidth="3" />
      <line x1="58" y1="32" x2="70" y2="43" stroke={primaryColor} strokeWidth="3" />
    </svg>
  );
};

export default Logo;
