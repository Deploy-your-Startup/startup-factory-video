// Original deterministic sound design: no third-party audio or music samples.
import { writeFileSync } from "node:fs";
const rate = 48000;
const seconds = 12;
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
for (const at of [0.23, 0.58, 2.98, 5.93, 6.53, 7.13, 8.43]) {
  add(
    at,
    0.62,
    (t) =>
      0.3 *
      Math.sin(2 * Math.PI * (48 * t + (12 * (1 - Math.exp(-30 * t))) / 30)) *
      Math.exp(-8 * t),
  );
  add(at, 0.12, (t) => noise() * 0.12 * Math.exp(-45 * t));
}
for (const at of [2.7, 5.55, 8.1])
  add(at, 0.55, (_, p) => noise() * 0.06 * Math.pow(Math.sin(Math.PI * p), 3));
for (let n = 0; n < 16; n++)
  add(3.7 + n * 0.056, 0.025, (t) => noise() * 0.055 * Math.exp(-170 * t));
for (const hz of [130.81, 196, 261.63, 329.63]) {
  add(
    8.45,
    3.55,
    (t, p) =>
      0.055 *
      (Math.sin(2 * Math.PI * hz * t) +
        0.15 * Math.sin(2 * Math.PI * hz * 2 * t)) *
      Math.min(1, t * 9) *
      Math.pow(1 - p, 1.7),
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
  new URL("../public/intro.wav", import.meta.url),
  Buffer.concat([header, data]),
);
