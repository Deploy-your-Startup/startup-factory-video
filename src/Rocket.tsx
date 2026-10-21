import React from 'react';

// Same geometry as the website's Rocket.astro and BrandMark.astro.
const RocketPaths = () => <>
  <path d="M16 3C10 9 9 16 11 24H21C23 16 22 9 16 3Z" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  <path d="M10.2 16.5L5.4 23.1Q5 23.6 5 24.2V28.3Q5 28.9 5.5 28.5L11 24M21.8 16.5L26.6 23.1Q27 23.6 27 24.2V28.3Q27 28.9 26.5 28.5L21 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  <circle cx="16" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  <path d="M13 28L15.6 35Q16 36 16.4 35L19 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</>;

// flame: 0..1 exhaust strength below the nozzle.
export const Rocket = ({size, flame = 0, style}: {size: number; flame?: number; style?: React.CSSProperties}) =>
  <svg width={size} height={size * 1.25} viewBox="0 0 32 40" fill="none" style={{overflow: 'visible', ...style}}>
    {flame > 0 && <path d={`M13.5 29 L16 ${36 + flame * 18} L18.5 29 Z`} fill="currentColor" opacity={.35 * flame} />}
    <RocketPaths />
  </svg>;

export const BrandMark = ({size}: {size: number}) =>
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <path d="M7 34L14 40L7 46M20 46H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(18 -1) rotate(35 16 20)"><RocketPaths /></g>
  </svg>;
