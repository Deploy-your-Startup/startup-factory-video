// Original deterministic sound design: no third-party audio or music samples.
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
// After launch: a loop that slowly runs out of energy.
for (let beat = 0; beat < 7; beat++)
  add((379 + beat * 14) / fps, 0.35, tone(98, 0.16 * (1 - beat / 8), 10));
// The turn: a rising pad, then one note per lifecycle stage as the spark passes it.
for (const hz of [196, 246.94, 293.66])
  add(
    484 / fps,
    5.6,
    (t, p) =>
      0.03 * Math.sin(2 * Math.PI * hz * t) * Math.min(1, t * 1.5) * (1 - p),
  );
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

const data = Buffer.alloc(samples.length * 2);
for (let i = 0; i < samples.length; i++)
  data.writeInt16LE(Math.round(Math.tanh(samples[i]) * 24000), i * 2);
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
