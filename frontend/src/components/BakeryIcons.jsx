import React from 'react';

// SVG-Icons für die verschiedenen Backwaren
const BakeryIcons = {
  Brötchen: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#E6D2A5" />
      <path d="M30 50C30 40 40 30 50 30C60 30 70 40 70 50" stroke="#A67C52" strokeWidth="3" />
      <path d="M35 45C35 40 42 35 50 35C58 35 65 40 65 45" stroke="#A67C52" strokeWidth="2" />
      <path d="M40 40C40 38 45 36 50 36C55 36 60 38 60 40" stroke="#A67C52" strokeWidth="2" />
    </svg>
  ),
  Brezel: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 40C30 30 40 25 50 35C60 45 70 40 70 30" stroke="#A67C52" strokeWidth="4" fill="#E6D2A5" />
      <path d="M30 70C30 80 40 85 50 75C60 65 70 70 70 80" stroke="#A67C52" strokeWidth="4" fill="#E6D2A5" />
      <path d="M30 40C20 50 20 60 30 70" stroke="#A67C52" strokeWidth="4" fill="#E6D2A5" />
      <path d="M70 30C80 40 80 60 70 80" stroke="#A67C52" strokeWidth="4" fill="#E6D2A5" />
    </svg>
  ),
  Baguette: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 65C20 55 30 35 50 35C70 35 80 55 80 65" stroke="#A67C52" strokeWidth="3" fill="#E6D2A5" />
      <path d="M20 65L80 65" stroke="#A67C52" strokeWidth="3" />
      <path d="M30 50L70 50" stroke="#A67C52" strokeWidth="2" />
      <path d="M35 42L65 42" stroke="#A67C52" strokeWidth="2" />
    </svg>
  ),
  Laugenstange: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="40" width="50" height="20" rx="10" fill="#D2B48C" />
      <path d="M25 50L75 50" stroke="#A67C52" strokeWidth="2" />
      <path d="M30 45L70 45" stroke="#A67C52" strokeWidth="1" />
      <path d="M30 55L70 55" stroke="#A67C52" strokeWidth="1" />
    </svg>
  ),
  Croissant: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70C20 60 20 40 40 30C60 20 80 40 70 70" stroke="#A67C52" strokeWidth="3" fill="#E6D2A5" />
      <path d="M40 60C35 55 35 45 45 40" stroke="#A67C52" strokeWidth="2" />
      <path d="M50 55C45 50 45 45 55 40" stroke="#A67C52" strokeWidth="2" />
    </svg>
  ),
  Kürbiskernbrot: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="50" height="30" rx="10" fill="#D2B48C" />
      <circle cx="35" cy="45" r="3" fill="#5D4037" />
      <circle cx="45" cy="50" r="3" fill="#5D4037" />
      <circle cx="55" cy="45" r="3" fill="#5D4037" />
      <circle cx="65" cy="50" r="3" fill="#5D4037" />
    </svg>
  ),
  Apfeltasche: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 35L50 75L75 35Z" fill="#E6D2A5" stroke="#A67C52" strokeWidth="3" />
      <circle cx="50" cy="50" r="8" fill="#D4A76A" />
    </svg>
  ),
  Nussecken: (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 35L50 75L75 35Z" fill="#D4A76A" stroke="#A67C52" strokeWidth="3" />
      <circle cx="35" cy="45" r="3" fill="#5D4037" />
      <circle cx="45" cy="55" r="3" fill="#5D4037" />
      <circle cx="65" cy="45" r="3" fill="#5D4037" />
    </svg>
  ),
};

export default BakeryIcons;
