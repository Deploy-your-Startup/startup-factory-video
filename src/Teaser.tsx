import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandMark, Rocket} from './Rocket';
import './style.css';

export const DURATION = 900;
const bg = '#141517';
const panel = '#1f2124';
const line = '#41454a';
const text = '#e7e7e4';
const muted = '#9a9b9e';
const accent = '#9cbedc';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (f: number, start: number, end: number) => interpolate(f, [start, end], [0, 1], clamp);
const visible = (f: number, start: number, end: number) => (start === 0 ? 1 : ramp(f, start, start + 10)) * (1 - ramp(f, end - 10, end));

const useEntry = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number) => spring({frame: frame - at, fps, config: {damping: 18, stiffness: 120, mass: .8}});
};

const Headline = ({at, top = 330, size = 120, width = 1000, eyebrow, children}: {at: number; top?: number; size?: number; width?: number; eyebrow?: string; children: React.ReactNode}) => {
  const e = useEntry()(at);
  return <div style={{position: 'absolute', left: 130, top, width, opacity: e, transform: `translateY(${(1 - e) * 50}px)`}}>
    {eyebrow && <div className="eyebrow">{eyebrow}</div>}
    <div className="headline" style={{fontSize: size}}>{children}</div>
  </div>;
};

const Sub = ({at, top, children}: {at: number; top: number; children: React.ReactNode}) => {
  const e = useEntry()(at);
  return <div className="mono" style={{position: 'absolute', left: 130, top, width: 860, fontSize: 25, lineHeight: 1.6, color: muted, opacity: e}}>{children}</div>;
};

const notes = [
  {label: 'IDEA 01', idea: 'A booking app for the bakery', x: 1100, y: 290, r: -3},
  {label: 'IDEA 02', idea: 'A club app for board gamers', x: 1170, y: 500, r: 2},
  {label: 'IDEA 03', idea: 'That game from the train ride', x: 1080, y: 710, r: -1.5},
];

const Ideas = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  const first = 1 - ramp(frame, 110, 120);
  return <AbsoluteFill style={{opacity: visible(frame, 0, 240)}}>
    <div style={{opacity: first}}>
      <Headline at={4} eyebrow="01 / THE IDEA">You have<br/>an idea.</Headline>
      <Sub at={22} top={690}>Maybe a few.</Sub>
    </div>
    {frame >= 118 && <>
      <Headline at={122} eyebrow="02 / THE PROBLEM">But no<br/><span style={{color: accent}}>time.</span></Headline>
      <Sub at={140} top={690}>Ideas wait for a weekend<br/>that never comes.</Sub>
    </>}
    {notes.map((note, i) => {
      const e = entry(16 + i * 14);
      const stamp = entry(140 + i * 12);
      const drift = ramp(frame, 182 + i * 8, 232);
      return <div key={note.label} className="note" style={{left: note.x, top: note.y - drift * 160, opacity: e * (1 - drift) * (1 - .45 * ramp(frame, 150 + i * 12, 170 + i * 12)), transform: `translateX(${(1 - e) * 120}px) rotate(${note.r + drift * 8}deg)`}}>
        <span>{note.label}</span>{note.idea}
        <div className="stamp" style={{opacity: stamp, transform: `rotate(-8deg) scale(${2 - stamp})`}}>SOMEDAY</div>
      </div>;
    })}
  </AbsoluteFill>;
};

const questions: [string, number, number][] = [
  ['Which stack?', 1000, 280], ['Which server?', 1330, 250], ['Domain?', 1610, 330], ['TLS certificates?', 1110, 380],
  ['CI/CD?', 1500, 420], ['Backups?', 1000, 490], ['Secrets?', 1270, 510], ['Kubernetes?', 1520, 540],
  ['Monitoring?', 1060, 610], ['Costs?', 1380, 630], ['Database?', 1570, 690], ['Security?', 1000, 730],
  ['Email?', 1290, 750], ['Logging?', 1490, 800],
];

const Setup = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  return <AbsoluteFill style={{opacity: visible(frame, 240, 375)}}>
    <Headline at={244} eyebrow="03 / THE DETOUR">And when there<br/>is time?</Headline>
    <Sub at={262} top={690}>The first evenings go into setup,<br/>before anyone has seen the product.</Sub>
    {questions.map(([q, x, y], i) => {
      const e = entry(262 + i * 5);
      return <div key={q} className="chip" style={{left: x, top: y, opacity: e, transform: `scale(${.6 + .4 * e}) rotate(${Math.sin(frame / 9 + i) * 1.5}deg)`}}>{q}</div>;
    })}
  </AbsoluteFill>;
};

const chores = ['updates', 'security fixes', 'marketing', 'KPIs', 'support', 'backups'];

const AfterLaunch = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  const quiet = ramp(frame, 420, 470);
  return <AbsoluteFill style={{opacity: visible(frame, 375, 480)}}>
    <Headline at={379} eyebrow="04 / AND THEN">After launch,<br/>it never stops.</Headline>
    <Sub at={398} top={690}>Most side projects don't fail.<br/>They go quiet.</Sub>
    <div style={{position: 'absolute', left: 1420 - 270, top: 590 - 270, width: 540, height: 540, borderRadius: '50%', border: `1px dashed ${line}`, opacity: entry(382)}} />
    <div className="mono" style={{position: 'absolute', left: 1420 - 90, top: 590 - 90, width: 180, height: 180, borderRadius: '50%', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 20, lineHeight: 1.4, opacity: entry(384) * (1 - .7 * quiet), color: text}}>your<br/>startup</div>
    {chores.map((chore, i) => {
      const angle = (i * 60 + (frame - 375) * 1.1) * Math.PI / 180;
      const e = entry(388 + i * 4);
      return <div key={chore} className="chip" style={{left: 1420 + Math.cos(angle) * 270, top: 590 + Math.sin(angle) * 270, opacity: e, transform: `translate(-50%, -50%) scale(${.7 + .3 * e})`}}>{chore}</div>;
    })}
  </AbsoluteFill>;
};

const stages = [
  {name: 'Idea', who: 'YOU', what: 'decide what is worth building'},
  {name: 'Build', who: 'AI', what: 'writes features and tests'},
  {name: 'Ship', who: 'YOU', what: 'approve what goes live'},
  {name: 'Run', who: 'AI', what: 'operates and updates'},
  {name: 'Grow', who: 'AI', what: 'drafts campaigns'},
  {name: 'Learn', who: 'YOU', what: 'choose what to try next'},
];
const available = 3;
const nodeX = (i: number) => 230 + i * 292;
const nodeY = 690;

const Turn = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  const rail = ramp(frame, 520, 560);
  const spark = ramp(frame, 560, 636);
  const loop = ramp(frame, 632, 652);
  const railEnd = nodeX(0) + (nodeX(5) - nodeX(0)) * rail;
  const split = nodeX(available - 1);
  return <AbsoluteFill style={{opacity: visible(frame, 480, 660)}}>
    <Headline at={484} top={200} size={92} width={1660} eyebrow="05 / WHAT IF">AI does the work.<br/><span style={{color: accent, opacity: entry(506)}}>You decide where it matters.</span></Headline>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <line x1={nodeX(0)} y1={nodeY} x2={Math.min(railEnd, split)} y2={nodeY} stroke={accent} strokeWidth={3} />
      {railEnd > split && <line x1={split} y1={nodeY} x2={railEnd} y2={nodeY} stroke={muted} strokeWidth={3} strokeDasharray="10 10" />}
      <path d={`M ${nodeX(5)} ${nodeY - 50} C ${nodeX(5)} 520, ${nodeX(0)} 520, ${nodeX(0)} ${nodeY - 50}`} fill="none" stroke={muted} strokeWidth={2} strokeDasharray="8 10" pathLength={1} strokeDashoffset={0} opacity={loop} />
    </svg>
    {spark > 0 && spark < 1 && <div style={{position: 'absolute', left: nodeX(0) + (nodeX(5) - nodeX(0)) * spark - 22, top: nodeY - 28, color: accent, zIndex: 2, filter: 'drop-shadow(0 0 10px #9cbedc88)', transform: 'rotate(90deg)'}}><Rocket size={44} flame={.6 + .4 * Math.sin(frame * 1.7)} /></div>}
    <div className="mono" style={{position: 'absolute', left: (nodeX(0) + nodeX(5)) / 2 - 150, top: 535, width: 300, textAlign: 'center', fontSize: 17, letterSpacing: 3, color: muted, opacity: loop}}>AND AGAIN</div>
    {stages.map((stage, i) => {
      const e = entry(526 + i * 6);
      const reached = spark >= i / 5 - .001 && frame >= 560;
      const solid = i < available;
      return <div key={stage.name} style={{position: 'absolute', left: nodeX(i) - 140, top: nodeY - 42, width: 280, textAlign: 'center', opacity: e, transform: `translateY(${(1 - e) * 30}px)`}}>
        <div style={{margin: '0 auto', width: 84, height: 84, borderRadius: '50%', background: reached ? accent : panel, border: `3px ${solid ? 'solid' : 'dashed'} ${solid || reached ? accent : muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: reached ? bg : muted, fontFamily: 'JetBrains Mono', fontSize: 22}}>{String(i + 1).padStart(2, '0')}</div>
        <div style={{marginTop: 22, fontSize: 34, fontWeight: 600, letterSpacing: '-.03em'}}>{stage.name}</div>
        <div className="mono" style={{display: 'inline-block', marginTop: 12, padding: '4px 12px', borderRadius: 6, fontSize: 16, letterSpacing: 3, background: stage.who === 'YOU' ? accent : 'transparent', color: stage.who === 'YOU' ? bg : muted, border: `1px solid ${stage.who === 'YOU' ? accent : line}`}}>{stage.who}</div>
        <div className="mono" style={{marginTop: 12, fontSize: 18, lineHeight: 1.45, color: muted}}>{stage.what}</div>
      </div>;
    })}
    <div className="mono" style={{position: 'absolute', left: 130, top: 960, fontSize: 16, letterSpacing: 2, color: muted, opacity: entry(570), display: 'flex', gap: 60}}>
      <span><span style={{color: accent}}>━━</span>  AVAILABLE IN EARLY ACCESS</span>
      <span>┅┅  WHAT WE ARE BUILDING, TOGETHER</span>
    </div>
  </AbsoluteFill>;
};

const drops = Array.from({length: 36}, (_, i) => ({x: 1040 + ((i * 197) % 720), at: 676 + ((i * 37) % 64), accent: i % 3 === 0}));

const OpenSource = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  const landed = drops.filter((d) => frame >= d.at + 26).length / drops.length;
  const launch = ramp(frame, 748, 776);
  return <AbsoluteFill style={{opacity: visible(frame, 660, 780)}}>
    <Headline at={664} eyebrow="06 / BUILT IN THE OPEN">Open source.<br/><span style={{color: accent}}>No lock-in.</span></Headline>
    <Sub at={684} top={690}>Your code. Your servers. Your keys.<br/>Leave anytime. Stay for the harness.</Sub>
    <div className="mono" style={{position: 'absolute', left: 1000, top: 220, width: 790, textAlign: 'center', fontSize: 17, letterSpacing: 3, color: muted, opacity: entry(670)}}>CONTRIBUTIONS FROM DEVELOPERS</div>
    {drops.map((d, i) => {
      const p = ramp(frame, d.at, d.at + 26);
      return p > 0 && p < 1 ? <div key={i} style={{position: 'absolute', left: d.x, top: 280 + p * p * 400, width: 14, height: 14, borderRadius: '50%', background: d.accent ? accent : text, opacity: .9}} /> : null;
    })}
    <div className="mono" style={{position: 'absolute', left: 1000, top: 690, width: 790, height: 100, borderRadius: 12, border: `2px solid ${accent}`, background: `rgba(156, 190, 220, ${.06 + landed * .22})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, letterSpacing: 6, opacity: entry(668), boxShadow: `0 0 ${landed * 80}px rgba(156, 190, 220, .35)`}}>THE HARNESS</div>
    <div className="mono" style={{position: 'absolute', left: 1000, top: 820, width: 790, textAlign: 'center', fontSize: 18, color: muted, opacity: entry(690)}}>templates · agent instructions · checks · deployment</div>
    <div style={{position: 'absolute', left: 1395 - 30, top: 690 - 82 - launch * launch * 520, color: accent, opacity: entry(734) * (1 - ramp(frame, 770, 778)), filter: 'drop-shadow(0 0 12px #9cbedc88)'}}><Rocket size={60} flame={launch > 0 ? .7 + .3 * Math.sin(frame * 2) : .15} /></div>
  </AbsoluteFill>;
};

const Finale = () => {
  const frame = useCurrentFrame();
  const entry = useEntry();
  return <AbsoluteFill style={{opacity: ramp(frame, 780, 790)}}>
    <Headline at={784} top={250} size={150} width={1300}>Ideas in.<br/><span style={{color: accent}}>Startups out.</span></Headline>
    {[['START YOURS', 'deploy-your-startup.com'], ['BUILD IT WITH US', 'github.com/Deploy-your-Startup']].map(([label, target], i) => {
      const e = entry(808 + i * 10);
      return <div key={label} className="cta" style={{position: 'absolute', left: 130, top: 680 + i * 120, width: 1000, opacity: e, transform: `translateY(${(1 - e) * 20}px)`}}><span>{label}</span>{target}<b style={{marginLeft: 'auto', color: accent}}>↗</b></div>;
    })}
    <div style={{position: 'absolute', left: 1560 - 150, top: 560 - 150, width: 300, height: 300, borderRadius: '50%', border: `3px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, opacity: entry(796), transform: `scale(${.8 + .2 * entry(796)})`}}><div style={{transform: `translateY(${(1 - entry(800)) * 220 + Math.sin(frame / 9) * 6}px) rotate(35deg)`}}><Rocket size={150} flame={.55 + .3 * Math.sin(frame * 1.3) + .5 * (1 - entry(800))} /></div></div>
    <div style={{position: 'absolute', left: 1560 - 190, top: 560 - 190, width: 380, height: 380, borderRadius: '50%', border: `1px dashed ${line}`, opacity: entry(800), transform: `rotate(${frame * .6}deg)`}} />
  </AbsoluteFill>;
};

export const Teaser = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: bg, color: text, fontFamily: 'Inter', overflow: 'hidden'}}>
    <Audio src={staticFile('teaser.wav')} />
    <div className="grid" />
    <div className="header"><div style={{display: 'flex', alignItems: 'center', gap: 16, color: accent}}><BrandMark size={50} /><div className="logo"><small>deploy your</small><b>startup</b></div></div><span>THE STARTUP FACTORY</span><span><span style={{color: accent}}>●</span> OPEN SOURCE · EARLY ACCESS</span></div>
    <Ideas />
    <Setup />
    <AfterLaunch />
    <Turn />
    <OpenSource />
    <Finale />
    <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${frame / (DURATION - 1) * 100}%`, background: accent}} />
  </AbsoluteFill>;
};
