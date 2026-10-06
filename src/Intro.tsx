import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import './style.css';

const ink = '#20211d';
const paper = '#eeeee5';
const orange = '#d84219';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, start: number, end: number) => interpolate(f, [start, end], [0, 1], clamp);

const Rotor = ({frame, size = 500}: {frame: number; size?: number}) => {
  const rotation = frame * 1.3 + interpolate(frame, [0, 90, 170], [0, 50, 310], clamp);
  return <svg width={size} height={size} viewBox="0 0 500 500" style={{overflow: 'visible'}}>
    <circle cx="250" cy="250" r="244" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="250" cy="250" r="202" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
    {Array.from({length: 60}, (_, i) => <line key={i} x1="250" y1="13" x2="250" y2={i % 5 === 0 ? 35 : 24} stroke="currentColor" strokeWidth={i % 5 === 0 ? 2 : 1} transform={`rotate(${i * 6} 250 250)`} />)}
    <g transform={`rotate(${rotation} 250 250)`}>
      <path d="M250 6 A244 244 0 0 1 461.3 372" fill="none" stroke={orange} strokeWidth="9" />
      {Array.from({length: 8}, (_, i) => <rect key={i} x="227" y="102" width="46" height="148" rx="4" fill={orange} transform={`rotate(${i * 45} 250 250)`} />)}
      <circle cx="250" cy="250" r="48" fill={paper}/>
      <circle cx="250" cy="250" r="11" fill={ink}/>
    </g>
    <path d="M240 250h20M250 240v20" stroke={ink} strokeWidth="1" />
  </svg>;
};

export const Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = (at: number) => spring({frame: frame - at, fps, config: {damping: 19, stiffness: 115, mass: .8}});
  const initialOut = 1 - ramp(frame, 78, 94);
  const titleIn = entry(248);
  const darkIn = ramp(frame, 89, 102);
  const darkOut = 1 - ramp(frame, 167, 182);
  const kineticOut = 1 - ramp(frame, 244, 260);
  const finalIn = ramp(frame, 251, 267);
  const command = 'startup bootstrap';
  return <AbsoluteFill style={{background: paper, color: ink, fontFamily: 'Inter', overflow: 'hidden'}}>
    <Audio src={staticFile('intro.wav')} />
    <div className="texture" />
    <div className="header"><b>DYS<span style={{color: orange}}>↗</span></b><span>THE STARTUP FACTORY</span><span>VOL. 001 / INTRO</span></div>
    <div className="footer"><span>YOUR IDEA. YOUR CODE. YOUR SERVERS.</span><span>{String(Math.min(100, Math.floor(frame / 359 * 100))).padStart(3, '0')} / 100</span></div>
    <AbsoluteFill style={{opacity: initialOut}}>
      <div style={{position: 'absolute', left: 130, top: 298, opacity: entry(7), transform: `translateY(${(1-entry(7))*55}px)`}}>
        <div className="eyebrow">EVERY STARTUP STARTS HERE.</div>
        <div className="display" style={{fontSize: 230, lineHeight: .85}}>ONE<br/><span style={{color: orange}}>IDEA.</span></div>
        <div className="mono" style={{marginTop: 38, fontSize: 23}}>Make something that matters.</div>
      </div>
      <div style={{position: 'absolute', left: 1190, top: 265, opacity: entry(17), transform: `scale(${.7 + .3*entry(17)})`, color: ink}}><Rotor frame={frame}/></div>
      <div className="mono" style={{position: 'absolute', top: 826, left: 1260, opacity: entry(35), fontSize: 18}}>IDEA IN → STARTUP OUT</div>
      <div style={{position: 'absolute', left: 860, top: 526, width: 210 * ramp(frame, 35, 68), height: 2, background: orange}} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: ink, color: paper, opacity: darkIn*darkOut, transform: `translateY(${(1-darkIn)*90}px)`}}>
      <div className="mono" style={{position:'absolute', left: 130, top: 100, color: '#b5b5a9', fontSize: 20}}>02 / START THE ENGINE</div>
      <div style={{position: 'absolute', left: 130, top: 283, opacity: entry(104)}}>
        <div className="eyebrow" style={{color: '#b5b5a9'}}>FROM THE FIRST COMMIT.</div>
        <div className="display" style={{fontSize: 180, lineHeight: .95}}>READY TO<br/><span style={{color: '#ff6535'}}>BUILD.</span></div>
      </div>
      <div style={{position: 'absolute', left: 990, top: 312, width: 780, height: 320, border: '1px solid #66685d', background: '#292b25', transform:`translateY(${(1-entry(108))*45}px)`, opacity: entry(108), boxShadow:'16px 16px 0 #171813'}}>
        <div className="mono" style={{padding: '22px 30px', borderBottom: '1px solid #55574d', fontSize: 16, color:'#b5b5a9'}}>● ● ● <span style={{float:'right'}}>terminal</span></div>
        <div className="mono" style={{padding:'42px 32px', fontSize: 34}}><span style={{color: '#ff6535'}}>→ </span>{command.slice(0, Math.floor(ramp(frame, 111, 138)*command.length))}<span style={{opacity: frame%24 < 16 ? 1 : 0, color: '#ff6535'}}>▍</span></div>
        <div className="mono" style={{padding:'0 32px', color:'#b5b5a9', fontSize: 21, opacity:ramp(frame, 142, 151)}}>Your next startup starts here.</div>
      </div>
      <div className="mono" style={{position:'absolute', bottom: 92, right: 150, fontSize: 18, color:'#b5b5a9'}}>CODE → COMMIT → DEPLOY</div>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity: ramp(frame, 175, 181)*kineticOut}}>
      {['BUILD IT.', 'SHIP IT.', 'REPEAT.'].map((word, i) => {
        const e = entry(178+i*18);
        return <div key={word} className="display" style={{position:'absolute', left: 130, top: 222+i*209, fontSize: 236, lineHeight: .86, color: i===2 ? orange : ink, transform:`translateX(${(1-e)*-100}px) rotate(${i===2 ? -2*e : 0}deg)`, opacity: e}}>{word}</div>;
      })}
      <div style={{position:'absolute', left: 1255, top: 320, transform:`scale(${.8+.2*entry(187)})`, opacity:entry(187)}}><Rotor frame={frame} size={420}/></div>
      <div className="mono" style={{position:'absolute', left: 1320, top: 805, fontSize:18, opacity:entry(225)}}>AND THEN THE NEXT.</div>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity: finalIn}}>
      <div style={{position:'absolute', left: 1325, top: 275, opacity:titleIn, transform:`scale(${.8+.2*titleIn})`}}><Rotor frame={frame} size={430}/></div>
      <div style={{position:'absolute', left:130, top:280, transform:`translateY(${(1-titleIn)*60}px)`}}>
        <div className="eyebrow">BUILD ONE STARTUP. THEN THE NEXT.</div>
        <div className="display" style={{fontSize: 178, lineHeight: .9}}>DEPLOY<br/>YOUR <span style={{color:orange}}>STARTUP.</span></div>
        <div style={{fontSize: 33, marginTop: 45, opacity:entry(271)}}>Your code. Your servers. Yours to own.</div>
        <div className="mono" style={{fontSize: 26, display:'inline-block', marginTop: 50, background:ink, color:paper, padding:'18px 25px', opacity:entry(287), transform:`translateY(${(1-entry(287))*18}px)`}}>deploy-your-startup.com <span style={{color:'#ff6535', marginLeft:26}}>↗</span></div>
      </div>
    </AbsoluteFill>
    <div style={{position:'absolute', bottom:0, left:0, height:8, width:`${frame/359*100}%`, background:orange}} />
  </AbsoluteFill>;
};
