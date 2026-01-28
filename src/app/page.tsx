"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import ParticleLayer from "./components/ParticleLayer";

const tracks = [
  {
    id: "safety-guide",
    title: "#1...Safety Guide",
    lyrics: [
      "Keep your breath close to the light",
      "Count the steps between the doors",
      "If the hallway turns to water",
      "Swim it back to where you were"
    ]
  },
  {
    id: "lock-pick",
    title: "#2...Lock Pick",
    lyrics: [
      "Tin sound, soft sparks, silent key",
      "Every latch is listening",
      "The night leans in, the metal sings",
      "We leave no trace, no name, no ring"
    ]
  },
  {
    id: "have-fun",
    title: "#3...Have Fun",
    lyrics: [
      "Laugh in the dark, off the grid",
      "Run in the rain, barefooted",
      "If we get caught, just say we won",
      "No map tonight, just have fun"
    ]
  },
  {
    id: "off-bones",
    title: "#4...Off Bones",
    lyrics: [
      "We are lighter than the names we wear",
      "We are wind caught in the stairs",
      "Lose the weight of every word",
      "Let the marrow learn to turn"
    ]
  },
  {
    id: "eraser",
    title: "#5...Eraser",
    lyrics: [
      "Soft dust on your sleeve again",
      "Erase the line, redraw the end",
      "If I disappear in chalk",
      "Trace me back with your own walk"
    ]
  },
  {
    id: "forbidden-fruit",
    title: "#6...Forbidden Fruit",
    lyrics: [
      "Bitten light and sugar dark",
      "Garden gates without a guard",
      "Hold the fire, taste the proof",
      "I’m the bruise, you’re the truth"
    ]
  },
  {
    id: "helium",
    title: "#7...Helium",
    lyrics: [
      "Voice goes thin, balloon heart",
      "Float the room, pull apart",
      "If the ceiling lets us go",
      "We will never come down slow"
    ]
  },
  {
    id: "afraid",
    title: "#8...What are you afraid of?",
    lyrics: [
      "Shadows singing in the sink",
      "Creaks that sound like second thoughts",
      "Every mirror tells on us",
      "Every window keeps our dots"
    ]
  },
  {
    id: "seoul",
    title: "#9...Seoul",
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
          <h1 className="title">Xave - Runaway Project (2025)</h1>

          <div className="spacer" />

          <div className="tracks">
            {tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                className="track"
                data-active={track.id === activeId}
                onClick={() => setActiveId(track.id)}
              >
                {track.title}
              </button>
            ))}
          </div>

          <div className="spacerLg" />

          <div className="miniRow">
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
          </div>

          <div className="spacer" />

          <nav className="links">
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
          </a>
        </div>

        <aside className="lyricsPanel" aria-live="polite">
          <div className="lyricsTitle">{activeTrack.title}</div>
          <div className="lyricsLines">
            {activeTrack.lyrics.map((line, index) => {
              const seed = clientSeeds[index] ?? driftSeeds[index];
              return (
                <div
                  key={`${activeTrack.id}-${line}`}
                  className="lyricsLine"
                  style={
                    {
                      "--dx": `${seed.dx}px`,
                      "--dy": `${seed.dy}px`,
                      "--dur": `${seed.dur}s`,
                      "--delay": `${seed.delay}s`
                    } as CSSProperties
                  }
                >
                  {line}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
