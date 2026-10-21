# Startup Factory Video

A twelve-second motion intro for Deploy Your Startup, made with React, TypeScript and Remotion. Includes original synthesized sound and locally bundled fonts. 1920 × 1080, 30 fps.

## Run

Install [mise](https://mise.jdx.dev/), then:

```sh
mise trust
mise exec -- ./make.sh install
mise run dev
```

Preview at http://localhost:3100. Export the video with `mise run render`; the MP4 is written to `out/startup-factory-intro.mp4`. Use `mise run poster` for a still and `mise run lint` for the formatting and TypeScript check (`mise run format` fixes formatting).

## Edit

`src/Intro.tsx` owns the animation. `src/Root.tsx` sets duration, dimensions and fps. All motion is frame-based and deterministic. Run `mise exec -- node scripts/sound.mjs` to regenerate the original sound.

The four scenes are idea (0–3 s), terminal (3–6 s), build/ship/repeat (6–8.5 s), and brand (8.5–12 s). The terminal is a designed illustration, not a recording of a production deployment. The cream and orange art direction is a proposed video treatment derived from website source; the deployed website currently has a different visual treatment.

Google Fonts assets use the SIL Open Font License; licenses are next to the fonts. Remotion has its own [license terms](https://www.remotion.dev/license).
