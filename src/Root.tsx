import { Composition } from "remotion";
import { DURATION, Teaser } from "./Teaser";
export const Root = () => (
  <Composition
    id="Teaser"
    component={Teaser}
    durationInFrames={DURATION}
    fps={30}
    width={1920}
    height={1080}
  />
);
