"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { getAudioMuted, playClickSound, setAudioMuted } from "@/lib/sound";

export function SoundToggle() {
  const [muted, setMute] = useState(false);

  useEffect(() => {
    setMute(getAudioMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setAudioMuted(next);
    setMute(next);
    if (!next) playClickSound();
  };

  return (
    <button
      onClick={toggle}
      className="header-chip-btn p-2 transition hover:scale-105 active:scale-95"
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label="Sound toggle"
    >
      {muted ? (
        <VolumeX className="h-[18px] w-[18px] text-zinc-500" strokeWidth={1.75} />
      ) : (
        <Volume2 className="h-[18px] w-[18px] text-brand" strokeWidth={1.75} />
      )}
    </button>
  );
}
