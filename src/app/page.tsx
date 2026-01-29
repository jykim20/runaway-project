"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject
} from "react";
import ParticleLayer from "./components/ParticleLayer";

const tracks = [
  {
    id: "safety-guide",
    title: "Safety Guide",
    lyrics: [
      "Keep your breath close to the light",
      "Count the steps between the doors",
      "If the hallway turns to water",
      "Swim it back to where you were"
    ]
  },
  {
    id: "lock-pick",
    title: "Lock Pick",
    lyrics: [
      "Tin sound, soft sparks, silent key",
      "Every latch is listening",
      "The night leans in, the metal sings",
      "We leave no trace, no name, no ring"
    ]
  },
  {
    id: "have-fun",
    title: "Have Fun",
    lyrics: [
      "Laugh in the dark, off the grid",
      "Run in the rain, barefooted",
      "If we get caught, just say we won",
      "No map tonight, just have fun"
    ]
  },
  {
    id: "off-bones",
    title: "Off Bones",
    lyrics: [
      "We are lighter than the names we wear",
      "We are wind caught in the stairs",
      "Lose the weight of every word",
      "Let the marrow learn to turn"
    ]
  },
  {
    id: "eraser",
    title: "Eraser",
    lyrics: [
      "Soft dust on your sleeve again",
      "Erase the line, redraw the end",
      "If I disappear in chalk",
      "Trace me back with your own walk"
    ]
  },
  {
    id: "forbidden-fruit",
    title: "Forbidden Fruit (Interlude)",
    lyrics: [
      "Bitten light and sugar dark",
      "Garden gates without a guard",
      "Hold the fire, taste the proof",
      "I’m the bruise, you’re the truth"
    ]
  },
  {
    id: "helium",
    title: "Helium",
    lyrics: [
      "Voice goes thin, balloon heart",
      "Float the room, pull apart",
      "If the ceiling lets us go",
      "We will never come down slow"
    ]
  },
  {
    id: "afraid",
    title: "What are you afraid of?",
    lyrics: [
      "Shadows singing in the sink",
      "Creaks that sound like second thoughts",
      "Every mirror tells on us",
      "Every window keeps our dots"
    ]
  },
  {
    id: "seoul",
    title: "Seoul (Bonus)",
    lyrics: [
      "Neon rain on Han River",
      "Taxi lights like falling stars",
      "We fold time on narrow streets",
      "Home is where the echoes are"
    ]
  }
];

export default function Page() {
  const [offsetsOuter, setOffsetsOuter] = useState<number[]>([]);
  const [offsetsInnerA, setOffsetsInnerA] = useState<number[]>([]);
  const [offsetsInnerB, setOffsetsInnerB] = useState<number[]>([]);
  const outerRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerARefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerBRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const outerRadius = 240;
  const padding = 24;
  const innerGap = 36;
  const innerRadiusA = outerRadius - innerGap;
  const innerRadiusB = outerRadius - innerGap * 2;
  const segmentPercent = 100 / tracks.length;

  useLayoutEffect(() => {
    const computeOffsetsForRadius = (
      refs: MutableRefObject<Array<SVGTextPathElement | null>>,
      radius: number
    ) => {
      const lengths = refs.current.map((node) =>
        node ? node.getComputedTextLength() : 0
      );
      if (lengths.some((length) => length === 0)) return null;

      const circumference = 2 * Math.PI * radius;
      const totalLength = lengths.reduce((sum, length) => sum + length, 0);
      const gap = Math.max((circumference - totalLength) / tracks.length, 0);
      let cursor = 0;
      return lengths.map((length) => {
        const start = cursor + gap / 2;
        cursor += length + gap;
        return start;
      });
    };

    const computeOffsets = () => {
      const nextOuter = computeOffsetsForRadius(outerRefs, outerRadius);
      const nextInnerA = computeOffsetsForRadius(innerARefs, innerRadiusA);
      const nextInnerB = computeOffsetsForRadius(innerBRefs, innerRadiusB);
      if (!nextOuter || !nextInnerA || !nextInnerB) return;
      setOffsetsOuter(nextOuter);
      setOffsetsInnerA(nextInnerA);
      setOffsetsInnerB(nextInnerB);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(computeOffsets);
    });
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(computeOffsets));
      });
    }
    return () => cancelAnimationFrame(raf);
  }, [innerRadiusA, innerRadiusB, outerRadius]);

  const size = outerRadius * 2 + padding * 2;

  return (
    <main className="page">
      <ParticleLayer className="particleLayer" />

      <div className="layout">
        <div className="circleWrap" style={{ "--circle-size": `${size}px` } as CSSProperties}>
          <svg className="circleSvg" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
            <defs>
              <path
                id="trackCirclePathOuter"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${outerRadius},0 a ${outerRadius},${outerRadius} 0 1,1 ${outerRadius * 2},0 a ${outerRadius},${outerRadius} 0 1,1 -${outerRadius * 2},0`}
              />
              <path
                id="trackCirclePathInnerA"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusA},0 a ${innerRadiusA},${innerRadiusA} 0 1,1 ${innerRadiusA * 2},0 a ${innerRadiusA},${innerRadiusA} 0 1,1 -${innerRadiusA * 2},0`}
              />
              <path
                id="trackCirclePathInnerB"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusB},0 a ${innerRadiusB},${innerRadiusB} 0 1,1 ${innerRadiusB * 2},0 a ${innerRadiusB},${innerRadiusB} 0 1,1 -${innerRadiusB * 2},0`}
              />
            </defs>
            {tracks.map((track, index) => {
              const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
              const offset = offsetsOuter[index] ?? fallbackOffset;
              return (
                <text key={track.id} className="circleLabel">
                  <textPath
                    href="#trackCirclePathOuter"
                    startOffset={offset}
                    ref={(node) => {
                      outerRefs.current[index] = node;
                    }}
                  >
                    {track.title}
                  </textPath>
                </text>
              );
            })}
            {tracks.map((track, index) => {
              const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
              const offset = offsetsInnerA[index] ?? fallbackOffset;
              return (
                <text key={`${track.id}-inner-a`} className="circleLabel circleLabelInner">
                  <textPath
                    href="#trackCirclePathInnerA"
                    startOffset={offset}
                    ref={(node) => {
                      innerARefs.current[index] = node;
                    }}
                  >
                    {track.title}
                  </textPath>
                </text>
              );
            })}
            {tracks.map((track, index) => {
              const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
              const offset = offsetsInnerB[index] ?? fallbackOffset;
              return (
                <text key={`${track.id}-inner-b`} className="circleLabel circleLabelInner">
                  <textPath
                    href="#trackCirclePathInnerB"
                    startOffset={offset}
                    ref={(node) => {
                      innerBRefs.current[index] = node;
                    }}
                  >
                    {track.title}
                  </textPath>
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </main>
  );
}
