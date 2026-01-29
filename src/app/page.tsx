"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
    title: "Forbidden Fruit",
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
    title: "Seoul",
    lyrics: [
      "Neon rain on Han River",
      "Taxi lights like falling stars",
      "We fold time on narrow streets",
      "Home is where the echoes are"
    ]
  }
];

export default function Page() {
  const [activeId, setActiveId] = useState(tracks[0].id);
  const activeTrack = tracks.find((track) => track.id === activeId) ?? tracks[0];
  const driftSeeds = useMemo(
    () =>
      activeTrack.lyrics.map((_, index) => ({
        dx: (index % 3) * 4 - 4,
        dy: (index % 4) * 3 - 3,
        dur: 10 + (index % 5),
        delay: -(index % 4)
      })),
    [activeTrack.id]
  );
  const [clientSeeds, setClientSeeds] = useState(driftSeeds);
  const outerRadius = 170;
  const innerRadius = 110;
  const innerRadiusSmall = 50;
  const tinyRingCount = 4;
  const tinyStartRadius = 40;
  const tinyGapStart = 10;
  const tinyGapStep = 2;
  // const tinyRadii = [40, 30, 20, 10]
  const tinyRadii = [];
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerSmallCircumference = 2 * Math.PI * innerRadiusSmall;
  const tinyCircumferences = tinyRadii.map((radius) => 2 * Math.PI * radius);
  const outerSegmentLength = outerCircumference / tracks.length;
  const innerSegmentLength = innerCircumference / tracks.length;
  const innerSmallSegmentLength = innerSmallCircumference / tracks.length;
  const tinySegmentLengths = tinyCircumferences.map(
    (circumference) => circumference / tracks.length
  );
  const labelLength = outerSegmentLength * 0.82;
  const innerLabelLength = innerSegmentLength * 0.82;
  const innerSmallLabelLength = innerSmallSegmentLength * 0.82;
  const tinyLabelLengths = tinySegmentLengths.map((length) => length * 0.82);

  useEffect(() => {
    setClientSeeds(
      activeTrack.lyrics.map(() => ({
        dx: Math.round((Math.random() * 2 - 1) * 14),
        dy: Math.round((Math.random() * 2 - 1) * 10),
        dur: Math.round(8 + Math.random() * 8),
        delay: Math.round(Math.random() * -8)
      }))
    );
  }, [activeTrack.id]);

  return (
    <main className="page">
      <ParticleLayer className="particleLayer" />

      <div className="layoutRow">
        <div className="content">
          {/* <h1 className="title">Xave - Runaway Project (2025)</h1>

          <div className="spacer" /> */}

          <div className="circleWrap">
            {/* <div className="circleCenter">
              <div className="circleCenterTitle">{activeTrack.title}</div>
              <div className="circleCenterHint">Lyrics appear here</div>
            </div> */}
            <svg className="circleSvg circleSvgOuter" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <path
                  id="trackCirclePathOuter"
                  d={`M 200,200 m -${outerRadius},0 a ${outerRadius},${outerRadius} 0 1,1 ${outerRadius * 2},0 a ${outerRadius},${outerRadius} 0 1,1 -${outerRadius * 2},0`}
                />
              </defs>
              {tracks.map((track, index) => {
                const offset = outerSegmentLength * (index + 0.5);
                return (
                  <text
                    key={track.id}
                    className="circleLabel"
                    data-active={track.id === activeId}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveId(track.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveId(track.id);
                      }
                    }}
                  >
                    <textPath
                      href="#trackCirclePathOuter"
                      startOffset={offset}
                      textLength={labelLength}
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {track.title}
                    </textPath>
                  </text>
                );
              })}
            </svg>
            <svg className="circleSvg circleSvgInner" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <path
                  id="trackCirclePathInner"
                  d={`M 200,200 m -${innerRadius},0 a ${innerRadius},${innerRadius} 0 1,1 ${innerRadius * 2},0 a ${innerRadius},${innerRadius} 0 1,1 -${innerRadius * 2},0`}
                />
              </defs>
              {tracks.map((track, index) => {
                const offset = innerSegmentLength * (index + 0.5);
                return (
                  <text
                    key={`${track.id}-inner`}
                    className="circleLabel circleLabelInner"
                    data-active={track.id === activeId}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveId(track.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveId(track.id);
                      }
                    }}
                  >
                    <textPath
                      href="#trackCirclePathInner"
                      startOffset={offset}
                      textLength={innerLabelLength}
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {track.title}
                    </textPath>
                  </text>
                );
              })}
            </svg>
            <svg className="circleSvg circleSvgInnerSmall" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <path
                  id="trackCirclePathInnerSmall"
                  d={`M 200,200 m -${innerRadiusSmall},0 a ${innerRadiusSmall},${innerRadiusSmall} 0 1,1 ${innerRadiusSmall * 2},0 a ${innerRadiusSmall},${innerRadiusSmall} 0 1,1 -${innerRadiusSmall * 2},0`}
                />
              </defs>
              {tracks.map((track, index) => {
                const offset = innerSmallSegmentLength * (index + 0.5);
                return (
                  <text
                    key={`${track.id}-inner-small`}
                    className="circleLabel circleLabelInnerSmall"
                    data-active={track.id === activeId}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveId(track.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveId(track.id);
                      }
                    }}
                  >
                    <textPath
                      href="#trackCirclePathInnerSmall"
                      startOffset={offset}
                      textLength={innerSmallLabelLength}
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {track.title}
                    </textPath>
                  </text>
                );
              })}
            </svg>
            {tinyRadii.map((radius, ringIndex) => {
              const segmentLength = tinySegmentLengths[ringIndex] ?? 0;
              const ringLabelLength = tinyLabelLengths[ringIndex] ?? 0;
              return (
                <svg
                  key={`tiny-ring-${radius}`}
                  className="circleSvg circleSvgTiny"
                  viewBox="0 0 400 400"
                  aria-hidden="true"
                  style={
                    {
                      "--spin-duration": `${18 + ringIndex * 6}s`,
                      "--spin-direction": ringIndex % 2 === 0 ? "normal" : "reverse",
                    } as CSSProperties
                  }
                >
                  <defs>
                    <path
                      id={`trackCirclePathTiny-${radius}`}
                      d={`M 200,200 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
                    />
                  </defs>
                  {tracks.map((track, index) => {
                    const offset = segmentLength * (index + 0.5);
                    return (
                      <text
                        key={`${track.id}-tiny-${radius}`}
                        className="circleLabel circleLabelTiny"
                        data-active={track.id === activeId}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveId(track.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveId(track.id);
                          }
                        }}
                      >
                        <textPath
                          href={`#trackCirclePathTiny-${radius}`}
                          startOffset={offset}
                          textLength={ringLabelLength}
                          lengthAdjust="spacingAndGlyphs"
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </svg>
              );
            })}
          </div>

          {/* <div className="spacerLg" /> */}

          {/* <div className="miniRow">
            <div className="miniBox" title="mini pic box">
              <Image
                src="/dance.gif"
                alt="mini pic box"
                width={256}
                height={256}
                priority
                unoptimized
              />
            </div>
          </div> */}

          {/* <div className="spacer" /> */}

          {/* <nav className="links">
            <a href="https://open.spotify.com" target="_blank" rel="noreferrer">
              Spotify
            </a>
            <a href="https://music.apple.com" target="_blank" rel="noreferrer">
              Apple Music
            </a>
            <a href="https://bandcamp.com" target="_blank" rel="noreferrer">
              Bandcamp
            </a>
            <span className="amp">&amp;</span>
            <a href="/more">More</a>
          </nav>

          <p className="footer">
            credit
          </p>

          <a className="coverLink" href="/cover.png" target="_blank" rel="noreferrer">
            Cover
            Credit
          </a> */}
        </div>

      </div>
    </main>
  );
}
