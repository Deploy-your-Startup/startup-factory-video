# Startup Factory Video

A 30-second teaser for Deploy Your Startup, made with React, TypeScript and Remotion: the problem (no time, setup detours, endless upkeep), the idea (AI does the work, people decide where it matters), open source without lock-in, and a call to start a startup or help build the factory. 1920 × 1080, 30 fps, original synthesized music and sound and locally bundled fonts.

In the lifecycle scene, solid stages are available in early access; dashed stages are the direction we are building together, not current features.

## Run

Install [mise](https://mise.jdx.dev/), then:

```sh
mise trust
mise exec -- ./make.sh install
mise run dev
```

Preview at http://localhost:3100. Export the video with `mise run render`; the MP4 is written to `out/startup-factory-teaser.mp4`. Use `mise run poster` for a still and `mise run lint` for the formatting and TypeScript check (`mise run format` fixes formatting).

## Edit

`src/Teaser.tsx` owns the animation, one component per scene; `src/Root.tsx` registers the composition. All motion is frame-based and deterministic. `scripts/sound.mjs` generates `public/teaser.wav`, music and effects, from the same frame numbers; run `mise exec -- node scripts/sound.mjs` after moving a cue.

| Frames | Scene |
|---|---|
| 0–240 | Ideas that never get time |
| 240–375 | Setup questions before the first user |
| 375–480 | Upkeep after launch |
| 480–660 | Lifecycle: AI does the work, you decide |
| 660–780 | Open source, no lock-in, the shared harness |
| 780–900 | Ideas in. Startups out. |

The rocket and brand mark in `src/Rocket.tsx` copy the website components; keep them in sync.

## License

The code in this repository is MIT licensed. Remotion is not: it is free for individuals and small companies, larger companies need a company license. Read the [Remotion license](https://www.remotion.dev/license) before you build on this repository. Fonts use the SIL Open Font License; licenses are next to the fonts.
