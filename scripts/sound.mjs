// Original deterministic sound design and music: no third-party audio, samples
// or generated-music services, so the soundtrack carries no outside license.
// Cue times follow the frame numbers in src/Teaser.tsx (30 fps).
import { writeFileSync } from "node:fs";
const rate = 48000;
const seconds = 30;
const fps = 30;
const samples = new Float64Array(rate * seconds);
const add = (at, duration, sound) => {
  for (let n = 0; n < Math.floor(duration * rate); n++) {
    const i = Math.round(at * rate) + n;
    if (i < samples.length)
      samples[i] += sound(n / rate, n / (duration * rate));
  }
};
let seed = 17;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};
const tone = (hz, gain, decay) => (t) =>
  gain * Math.sin(2 * Math.PI * hz * t) * Math.exp(-decay * t);
const thump = (at) => {
  add(
    at,
    0.6,
    (t) =>
      0.3 *
      Math.sin(2 * Math.PI * (46 * t + (12 * (1 - Math.exp(-30 * t))) / 30)) *
      Math.exp(-8 * t),
  );
  add(at, 0.1, (t) => noise() * 0.08 * Math.exp(-50 * t));
};
const whoosh = (at, duration, gain = 0.05) =>
  add(
    at,
    duration,
    (_, p) => noise() * gain * Math.pow(Math.sin(Math.PI * p), 3),
  );

// Scene cuts.
for (const frame of [4, 122, 244, 379, 484, 664, 784]) thump(frame / fps);
// Idea notes slide in, get stamped "someday" and drift away.
for (let i = 0; i < 3; i++) whoosh((16 + i * 14) / fps, 0.35, 0.035);
for (let i = 0; i < 3; i++) {
  add((140 + i * 12) / fps, 0.18, (t) => noise() * 0.14 * Math.exp(-35 * t));
  add((140 + i * 12) / fps, 0.3, tone(110, 0.18, 18));
}
whoosh(182 / fps, 1.7, 0.04);
// Setup questions pile up.
for (let i = 0; i < 14; i++)
  add((262 + i * 5) / fps, 0.09, tone(880 + (i % 4) * 110, 0.06, 40));
// The turn: one note per lifecycle stage as the spark passes it.
[392, 440, 493.88, 587.33, 659.25, 783.99].forEach((hz, i) =>
  add((560 + (i * 76) / 5) / fps, 0.7, tone(hz, 0.09, 6)),
);
// Contributions land in the harness.
for (let i = 0; i < 36; i++)
  add(
    (676 + ((i * 37) % 64) + 26) / fps,
    0.12,
    tone(1046.5 + (i % 3) * 261.6, 0.035, 30),
  );
// Rockets: one launches from the harness, one rises into the finale.
const launch = (at, duration, gain) => {
  whoosh(at, duration, gain);
  add(
    at,
    duration,
    (t, p) =>
      gain *
      1.6 *
      Math.sin(2 * Math.PI * (60 + 140 * p) * t) *
      Math.sin(Math.PI * p),
  );
};
launch(744 / fps, 1.1, 0.05);
launch(800 / fps, 0.8, 0.035);
// Finale chord.
for (const hz of [130.81, 196, 261.63, 329.63, 392]) {
  add(
    784 / fps,
    4,
    (t, p) =>
      0.05 *
      (Math.sin(2 * Math.PI * hz * t) + 0.15 * Math.sin(4 * Math.PI * hz * t)) *
      Math.min(1, t * 9) *
      Math.pow(1 - p, 1.6),
  );
}

// Music: 120 bpm, one chord per 2-second bar, following the scenes.
// Bars 0-3 the idea (sparse, minor), 4-7 setup and upkeep (bass and hats
// build, then thin out as the startup "goes quiet"), 8-12 the turn and open
// source (kick and brighter arpeggio), 13-14 the finale resolving to C major.
const beat = 0.5;
const bar = 4 * beat;
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const chords = [
  [57, 60, 64],
  [53, 57, 60],
  [55, 60, 64],
  [55, 59, 62],
  [57, 62, 65],
  [57, 60, 64],
  [53, 57, 60],
  [56, 59, 64],
  [55, 60, 64],
  [55, 59, 62],
  [57, 60, 64],
  [53, 57, 60],
  [55, 59, 62],
  [55, 60, 64],
  [55, 60, 64],
];
const roots = [45, 41, 48, 43, 38, 45, 41, 40, 48, 43, 45, 41, 43, 36, 36];
const pad = (midi, gain) => (t, p) => {
  const f = hz(midi);
  const env = Math.min(1, t / 0.35) * Math.min(1, (1 - p) * 4);
  return (
    gain *
    env *
    (Math.sin(2 * Math.PI * f * t) +
      0.25 *
        Math.sin(4 * Math.PI * f * t + 0.3 * Math.sin(2 * Math.PI * 0.4 * t)) +
      0.08 * Math.sin(6 * Math.PI * f * t))
  );
};
const pluck =
  (midi, gain, decay = 6) =>
  (t) => {
    const f = hz(midi);
    return (
      gain *
      Math.min(1, t * 300) *
      Math.exp(-decay * t) *
      (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t))
    );
  };
const bass = (midi, gain) => (t) => {
  const f = hz(midi);
  return (
    gain *
    Math.min(1, t * 200) *
    Math.exp(-4 * t) *
    (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t))
  );
};
let previous = 0;
const hat = (gain) => (t) => {
  const n = noise();
  const high = n - previous;
  previous = n;
  return gain * high * Math.exp(-70 * t);
};
const kick = (gain) => (t) =>
  gain *
  Math.sin(2 * Math.PI * (50 * t + (90 * (1 - Math.exp(-35 * t))) / 35)) *
  Math.exp(-9 * t);

chords.forEach((chord, b) => {
  const at = b * bar;
  const last = b === chords.length - 1;
  const padGain = b < 4 ? 0.022 : b < 8 ? 0.026 : 0.03;
  for (const note of chord) add(at, last ? bar : bar + 0.4, pad(note, padGain));
  // Arpeggio: quarters while the idea waits, eighths as setup piles up,
  // a single note per beat while the startup goes quiet, sixteenths after the turn.
  const step =
    b < 4 ? beat : b < 6 ? beat / 2 : b < 8 ? beat : b < 13 ? beat / 4 : beat;
  const arp = [...chord.map((n) => n + 12), chord[1] + 24];
  for (let i = 0; i < bar / step; i++) {
    if (b === 7 && i > 1) break;
    const gain = b < 4 ? 0.035 : b < 8 ? 0.03 : 0.024;
    add(at + i * step, 0.8, pluck(arp[i % arp.length], gain, b < 8 ? 5 : 8));
  }
  if (b >= 4 && b < 13) {
    for (let i = 0; i < 8; i++) {
      if (b === 7 && i % 4 !== 0) continue;
      add(at + i * (beat / 2), 0.4, bass(roots[b], b < 8 ? 0.07 : 0.085));
      if (b !== 7)
        add(at + i * (beat / 2) + beat / 4, 0.06, hat(b < 8 ? 0.018 : 0.026));
    }
  }
  if (b >= 8 && b < 13)
    for (let i = 0; i < 4; i++) add(at + i * beat, 0.35, kick(0.16));
  if (last) for (const note of [36, 48]) add(at, bar, pad(note, 0.03));
});

// Master fade so the last frame lands in silence.
for (let i = Math.floor((seconds - 1.2) * rate); i < samples.length; i++)
  samples[i] *= (samples.length - i) / (1.2 * rate);

const data = Buffer.alloc(samples.length * 2);
for (let i = 0; i < samples.length; i++)
  data.writeInt16LE(Math.round(Math.tanh(samples[i] * 1.6) * 26000), i * 2);
const header = Buffer.alloc(44);
header.write("RIFF");
header.writeUInt32LE(data.length + 36, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(
  new URL("../public/teaser.wav", import.meta.url),
  Buffer.concat([header, data]),
);
