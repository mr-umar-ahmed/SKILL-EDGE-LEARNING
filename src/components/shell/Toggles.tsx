"use client";

import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { getAudioMuted, playClickSound, setAudioMuted } from "@/lib/sound";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("skilledge-theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
      document.documentElement.className = saved;
      document.body.className = `${saved} font-sans antialiased selection:bg-amber-400 selection:text-black`;
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("skilledge-theme", next);
    document.documentElement.className = next;
    document.body.className = `${next} font-sans antialiased selection:bg-amber-400 selection:text-black`;
    playClickSound();
  };

  return (
    <button
      onClick={toggle}
      className="header-chip-btn p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
      title={theme === "dark" ? "Switch to Oatmilk Latte Light Theme" : "Switch to Rich Black Dark Theme"}
      aria-label="Theme toggle"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] text-amber-300" strokeWidth={1.75} />
      ) : (
        <Moon className="h-[18px] w-[18px] text-amber-600" strokeWidth={1.75} />
      )}
    </button>
  );
}

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
      className="header-chip-btn p-2 text-zinc-300 transition hover:scale-105 active:scale-95"
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-label="Sound toggle"
    >
      {muted ? <VolumeX className="h-[18px] w-[18px] text-zinc-500" strokeWidth={1.75} /> : <Volume2 className="h-[18px] w-[18px] text-amber-400" strokeWidth={1.75} />}
    </button>
  );
}
