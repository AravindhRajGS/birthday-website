import { useEffect, useMemo, useRef, useState } from "react";
import themeMusicUrl from "./assets/songs/theme_music.mp3";
import "./App.css";

type MatrixColumn = {
  id: number;
  left: string;
  duration: string;
  delay: string;
  content: string;
  size: string;
  opacity: number;
};

const MATRIX_CHARS =
  "H A P P Y B I R T H D A Y N A N D H I N I A M M U M Y P O N D A T I M Y L O V E";
const FINAL_WORDS = ["Happy", "Birthday", "To", "You", "Nandhini"];
const FINAL_PREFIX = "Happy Birthday";
const FINAL_NAME_SEQUENCE = ["Nandhini", "Ammu", "My Pondati", "My Love"];
const CELEBRATION_PAGES = ["photos", "songs", "messages", "finale"] as const;
const FINALE_CONTENT = {
  titleLines: ["I Hope This Made Your", "Day As Special As You Are"],
  subtitle:
    "Every pixel, every animation, and every word was crafted with love.",
  closing: "Happy Birthday once again, Ammu.",
  sparkle: "✨",
};
const PHOTO_ITEMS: PhotoItem[] = [
  {
    title: "Carousel 1",
    caption: "A placeholder frame for your favorite sunset memory together.",
    palette: "linear-gradient(135deg, #f7a85a 0%, #ff6f91 48%, #522258 100%)",
  },
  {
    title: "Carousel 2",
    caption: "Swap this card with a candid photo from one of your best days.",
    palette: "linear-gradient(135deg, #5b86e5 0%, #7f7fd5 45%, #1d2b64 100%)",
  },
  {
    title: "Carousel 3",
    caption: "Perfect spot for a cozy memory that always makes her smile.",
    palette: "linear-gradient(135deg, #fbc2eb 0%, #a18cd1 55%, #3f2b96 100%)",
  },
  {
    title: "Carousel 4",
    caption: "A placeholder frame for your favorite sunset memory together.",
    palette: "linear-gradient(135deg, #f7a85a 0%, #ff6f91 48%, #522258 100%)",
  },
  {
    title: "Carousel 5",
    caption: "Swap this card with a candid photo from one of your best days.",
    palette: "linear-gradient(135deg, #5b86e5 0%, #7f7fd5 45%, #1d2b64 100%)",
  },
  {
    title: "Carousel 6",
    caption: "Perfect spot for a cozy memory that always makes her smile.",
    palette: "linear-gradient(135deg, #fbc2eb 0%, #a18cd1 55%, #3f2b96 100%)",
  },
];
const SONG_ITEMS: SongItem[] = [
  {
    title: "Poovinai Thiranthu Kondu",
    artist: "G.V. Prakash Kumar, Srinivas & Shreya Ghoshal",
    album: "Aanandha Thaandavam",
    accent: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 55%, #7b2cbf 100%)",
    audioUrl: "src\\assets\\songs\\poovinai_thiranthu_kondu.mp3",
    coverImageUrl: "src\\assets\\songs\\soundwave.webp",
  },
  {
    title: "Minnu Vattaam Poochi",
    artist: "Yuvan Shankar Raja, Padmaja Sreenivasan",
    album: "Sirai",
    accent: "linear-gradient(135deg, #00c6ff 0%, #0072ff 55%, #2d1e5f 100%)",
    audioUrl: "src\\assets\\songs\\minnu_vattaam_poochi.mp3",
    coverImageUrl: "src\\assets\\songs\\soundwave.webp",
  },
  {
    title: "Paathi Nee Paathi Naa",
    artist: "Gopi Sundar, Madrashe",
    album: "Nitham Oru Vaanam",
    accent: "linear-gradient(135deg, #f6d365 0%, #fda085 55%, #7b4397 100%)",
    audioUrl: "src\\assets\\songs\\paathi_nee_paathi_naa.mp3",
    coverImageUrl: "src\\assets\\songs\\soundwave.webp",
  }
];
const MESSAGE_ITEMS: MessageItem[] = [
  {
    title: "For Your Smile",
    text: "You make ordinary days feel like they were written just for us.",
    accent:
      "linear-gradient(135deg, rgba(255, 147, 219, 0.35), rgba(101, 28, 96, 0.6))",
  },
  {
    title: "For Your Heart",
    text: "Being with you feels calm, bright, and exactly like home.",
    accent:
      "linear-gradient(135deg, rgba(115, 204, 255, 0.28), rgba(58, 29, 114, 0.62))",
  },
  {
    title: "For Every Tomorrow",
    text: "I want more laughter, more memories, and many more birthdays with you.",
    accent:
      "linear-gradient(135deg, rgba(255, 205, 111, 0.32), rgba(123, 43, 151, 0.58))",
  },
];
const MESSAGE_BOOK_PAGES: BookPage[] = [
  {
    kind: "cover",
    title: "For Nandhini",
    subtitle: "Open this little book of memories",
  },
  ...MESSAGE_ITEMS.map((item) => ({
    kind: "message" as const,
    title: item.title,
    text: item.text,
    accent: item.accent,
  })),
  {
    kind: "back",
    title: "To Be Continued",
    subtitle: "Many more chapters with you",
  },
];

type CelebrationPage = (typeof CELEBRATION_PAGES)[number];

type PhotoItem = {
  title: string;
  caption: string;
  palette: string;
};

type SongItem = {
  title: string;
  artist: string;
  album: string;
  accent: string;
  audioUrl: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
};

type MessageItem = {
  title: string;
  text: string;
  accent: string;
};

type BookPage =
  | {
      kind: "cover" | "back";
      title: string;
      subtitle: string;
    }
  | {
      kind: "message";
      title: string;
      text: string;
      accent: string;
    };

type IntroPhase = "waiting" | "countdown" | "words" | "final";

type CelebrationDecor = {
  id: number;
  kind: "confetti" | "balloon" | "heart";
  direction: "up" | "down";
  left: string;
  delay: string;
  duration: string;
  size: string;
  drift: string;
};

function getWrappedOffset(index: number, currentIndex: number, total: number) {
  let offset = index - currentIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

function IconButton({
  label,
  onClick,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className={`control-button icon-button ${className}`.trim()}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState<"intro" | CelebrationPage>(
    "intro",
  );
  const [phase, setPhase] = useState<IntroPhase>("waiting");
  const [countdown, setCountdown] = useState(3);
  const [wordIndex, setWordIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [messagePageIndex, setMessagePageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [finalNameText, setFinalNameText] = useState(FINAL_NAME_SEQUENCE[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isThemeMuted, setIsThemeMuted] = useState(false);

  const decorations = useMemo<CelebrationDecor[]>(() => {
    const kinds: CelebrationDecor["kind"][] = ["confetti", "balloon", "heart"];

    return Array.from({ length: 36 }, (_, index) => {
      const direction = index % 4 === 0 ? "down" : "up";
      return {
        id: index,
        kind: kinds[index % kinds.length],
        direction,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 9}s`,
        duration: `${8 + Math.random() * 10}s`,
        size: `${12 + Math.random() * 18}px`,
        drift: `${Math.random() * 80 - 40}px`,
      };
    });
  }, []);

  const drops = useMemo<MatrixColumn[]>(() => {
    const chars = MATRIX_CHARS.split("");
    const totalColumns = 94;
    const rowsPerColumn = 60;

    const buildColumn = (startIndex: number) =>
      Array.from({ length: rowsPerColumn }, (_, row) => {
        const baseIndex = (startIndex + row) % chars.length;
        const randomOffset = Math.floor(Math.random() * chars.length);
        return chars[(baseIndex + randomOffset) % chars.length];
      }).join("\n");

    return Array.from({ length: totalColumns }, (_, index) => {
      return {
        id: index,
        left: `${(index / (totalColumns - 1)) * 100}%`,
        duration: `${6.2 + Math.random() * 3.8}s`,
        delay: `-${Math.random() * 10}s`,
        content: buildColumn(index),
        size: `${14 + Math.random() * 5}px`,
        opacity: Number((0.45 + Math.random() * 0.5).toFixed(2)),
      };
    });
  }, []);

  const currentSong = SONG_ITEMS[songIndex];

  useEffect(() => {
    if (phase !== "waiting") {
      return;
    }

    const startTimer = window.setTimeout(() => {
      setPhase("countdown");
      setCountdown(3);
    }, 2000);

    return () => window.clearTimeout(startTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    const countdownTimer = window.setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(countdownTimer);
          setPhase("words");
          return 1;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "words") {
      return;
    }

    setWordIndex(0);
    const wordTimer = window.setInterval(() => {
      setWordIndex((current) => {
        if (current >= FINAL_WORDS.length - 1) {
          window.clearInterval(wordTimer);
          setPhase("final");
          return current;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(wordTimer);
  }, [phase]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const themeAudio = themeAudioRef.current;

    if (!themeAudio) {
      return;
    }

    themeAudio.muted = isThemeMuted;

    if (currentPage === "songs") {
      themeAudio.pause();
    } else {
      themeAudio.play().catch(() => {
        // Autoplay may be blocked until the user interacts with the page.
      });
    }
  }, [currentPage, isThemeMuted]);

  useEffect(() => {
    const themeAudio = themeAudioRef.current;

    if (!themeAudio) {
      return;
    }

    const resumeThemeAudio = () => {
      if (currentPage === "songs" || isThemeMuted) {
        return;
      }

      if (themeAudio.paused) {
        themeAudio.play().catch(() => {
          // Ignore blocked attempts; next interaction will try again.
        });
      }
    };

    window.addEventListener("pointerdown", resumeThemeAudio);
    window.addEventListener("keydown", resumeThemeAudio);
    window.addEventListener("touchstart", resumeThemeAudio);

    return () => {
      window.removeEventListener("pointerdown", resumeThemeAudio);
      window.removeEventListener("keydown", resumeThemeAudio);
      window.removeEventListener("touchstart", resumeThemeAudio);
    };
  }, [currentPage, isThemeMuted]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.load();

    if (isPlaying && currentPage === "songs") {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentSong, currentPage]);

  useEffect(() => {
    if (currentPage === "songs") {
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== "photos") {
      return;
    }

    const autoAdvance = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % PHOTO_ITEMS.length);
    }, 5000);

    return () => window.clearInterval(autoAdvance);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== "messages") {
      return;
    }

    const activePage = MESSAGE_BOOK_PAGES[messagePageIndex];
    if (activePage.kind !== "message") {
      setTypedText("");
      return;
    }

    setTypedText("");
    let charIndex = 0;
    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(activePage.text.slice(0, charIndex));

      if (charIndex >= activePage.text.length) {
        window.clearInterval(typingTimer);
      }
    }, 35);

    return () => window.clearInterval(typingTimer);
  }, [currentPage, messagePageIndex]);

  useEffect(() => {
    if (phase !== "final" || currentPage !== "intro") {
      setFinalNameText(FINAL_NAME_SEQUENCE[0]);
      return;
    }

    let wordIndex = 0;
    let charIndex = FINAL_NAME_SEQUENCE[0].length;
    let mode: "hold" | "deleting" | "typing" = "hold";
    let effectTimer = 0;

    const runCycle = () => {
      const currentWord = FINAL_NAME_SEQUENCE[wordIndex];

      if (mode === "hold") {
        setFinalNameText(currentWord);
        mode = "deleting";
        effectTimer = window.setTimeout(runCycle, 950);
        return;
      }

      if (mode === "deleting") {
        charIndex = Math.max(0, charIndex - 1);
        setFinalNameText(currentWord.slice(0, charIndex));

        if (charIndex === 0) {
          wordIndex = (wordIndex + 1) % FINAL_NAME_SEQUENCE.length;
          mode = "typing";
        }

        effectTimer = window.setTimeout(runCycle, 48);
        return;
      }

      const targetWord = FINAL_NAME_SEQUENCE[wordIndex];
      charIndex = Math.min(targetWord.length, charIndex + 1);
      setFinalNameText(targetWord.slice(0, charIndex));

      if (charIndex === targetWord.length) {
        mode = "hold";
      }

      effectTimer = window.setTimeout(runCycle, 95);
    };

    setFinalNameText(FINAL_NAME_SEQUENCE[0]);
    effectTimer = window.setTimeout(runCycle, 900);

    return () => window.clearTimeout(effectTimer);
  }, [phase, currentPage]);

  const resetToIntro = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentPage("intro");
    setPhase("waiting");
    setCountdown(3);
    setWordIndex(0);
    setMessagePageIndex(0);
  };

  const goToAdjacentCelebrationPage = (direction: -1 | 1) => {
    if (currentPage === "intro") {
      return;
    }

    const currentIndex = CELEBRATION_PAGES.indexOf(currentPage);
    const nextIndex = Math.max(
      0,
      Math.min(CELEBRATION_PAGES.length - 1, currentIndex + direction),
    );
    setCurrentPage(CELEBRATION_PAGES[nextIndex]);
  };

  const goToNextSong = () => {
    setSongIndex((current) => (current + 1) % SONG_ITEMS.length);
  };

  const goToPreviousSong = () => {
    setSongIndex(
      (current) => (current - 1 + SONG_ITEMS.length) % SONG_ITEMS.length,
    );
  };

  const goToPreviousBookPage = () => {
    setMessagePageIndex((current) => Math.max(0, current - 1));
  };

  const goToNextBookPage = () => {
    setMessagePageIndex((current) =>
      Math.min(MESSAGE_BOOK_PAGES.length - 1, current + 1),
    );
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const toggleThemeMusic = () => {
    const themeAudio = themeAudioRef.current;
    const nextMuted = !isThemeMuted;

    setIsThemeMuted(nextMuted);

    if (!themeAudio || currentPage === "songs") {
      return;
    }

    themeAudio.muted = nextMuted;

    if (!nextMuted && themeAudio.paused) {
      themeAudio.play().catch(() => {
        // Ignore autoplay restrictions; the next interaction can resume it.
      });
    }
  };

  const renderThemeMusicLayer = () => (
    <>
      <audio autoPlay loop preload="auto" ref={themeAudioRef}>
        <source src={themeMusicUrl} type="audio/mpeg" />
      </audio>

      <IconButton
        className="theme-audio-toggle"
        label={isThemeMuted ? "Unmute theme music" : "Mute theme music"}
        onClick={toggleThemeMusic}
      >
        {isThemeMuted ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10h4l5-4v12l-5-4H4z" />
            <path d="M16 8l4 8M20 8l-4 8" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10h4l5-4v12l-5-4H4z" />
            <path d="M16 9a4 4 0 0 1 0 6" fill="none" />
            <path d="M18.5 6.5a7 7 0 0 1 0 11" fill="none" />
          </svg>
        )}
      </IconButton>
    </>
  );

  const renderPageNavigation = () => (
    <div className="celebration-nav-row">
      <button
        aria-label="Previous section"
        className="nav-button nav-icon-button"
        disabled={currentPage === CELEBRATION_PAGES[0]}
        onClick={() => goToAdjacentCelebrationPage(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        aria-label="Go to intro"
        className="nav-button nav-icon-button"
        onClick={resetToIntro}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5L12 5l8 6.5" />
          <path d="M7.5 10.5V19h9v-8.5" />
        </svg>
      </button>
      <button
        aria-label="Next section"
        className="nav-button nav-icon-button"
        disabled={
          currentPage === CELEBRATION_PAGES[CELEBRATION_PAGES.length - 1]
        }
        onClick={() => goToAdjacentCelebrationPage(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  if (currentPage !== "intro") {
    return (
      <main className="celebration-page">
        {renderThemeMusicLayer()}
        <div className="celebration-decor" aria-hidden="true">
          {decorations.map((item) => (
            <span
              className={`decor-item ${item.kind} ${item.direction}`}
              key={item.id}
              style={{
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
                width: item.size,
                height: item.size,
                ["--drift" as string]: item.drift,
              }}
            />
          ))}
        </div>
        <section className="celebration-content">
          {currentPage === "photos" ? (
            <section className="celebration-section">
              <div className="carousel-shell">
                <button
                  aria-label="Previous photo"
                  className="carousel-arrow left"
                  onClick={() =>
                    setPhotoIndex(
                      (current) =>
                        (current - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length,
                    )
                  }
                  type="button"
                >
                  <span />
                </button>
                <div className="carousel-track">
                  {PHOTO_ITEMS.map((item, index) => {
                    const offset = getWrappedOffset(
                      index,
                      photoIndex,
                      PHOTO_ITEMS.length,
                    );
                    return (
                      <article
                        className={`carousel-card ${
                          offset === 0
                            ? "center"
                            : Math.abs(offset) === 1
                              ? "side"
                              : "hidden"
                        }`}
                        key={item.title}
                        style={{
                          transform: `translate(-50%, -50%) translateX(${offset * 34}%) scale(${offset === 0 ? 1 : 0.82})`,
                          background: item.palette,
                          zIndex: offset === 0 ? 3 : 2,
                        }}
                      >
                        <div className="carousel-photo-frame">
                          <span>{item.title}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.caption}</p>
                      </article>
                    );
                  })}
                </div>
                <button
                  aria-label="Next photo"
                  className="carousel-arrow right"
                  onClick={() =>
                    setPhotoIndex(
                      (current) => (current + 1) % PHOTO_ITEMS.length,
                    )
                  }
                  type="button"
                >
                  <span />
                </button>
              </div>
            </section>
          ) : null}

          {currentPage === "songs" ? (
            <section className="celebration-section songs-section">
              <div className="carousel-shell songs-shell">
                <div className="carousel-track">
                  {SONG_ITEMS.map((item, index) => {
                    const offset = getWrappedOffset(
                      index,
                      songIndex,
                      SONG_ITEMS.length,
                    );
                    return (
                      <article
                        className={`carousel-card music-card ${
                          offset === 0
                            ? "center"
                            : Math.abs(offset) === 1
                              ? "side"
                              : "hidden"
                        }`}
                        key={item.title}
                        style={{
                          transform: `translate(-50%, -50%) translateX(${offset * 34}%) scale(${offset === 0 ? 1 : 0.82})`,
                          background: item.accent,
                          zIndex: offset === 0 ? 3 : 2,
                        }}
                      >
                        <div className="album-art">
                          {item.coverImageUrl ? (
                            <img
                              alt={item.coverImageAlt ?? `${item.title} cover`}
                              src={item.coverImageUrl}
                            />
                          ) : (
                            <span>{item.title}</span>
                          )}
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.artist}</p>
                        <small>{item.album}</small>
                      </article>
                    );
                  })}
                </div>
              </div>
              <div className="player-panel">
                <div className="track-meta">
                  <strong>{currentSong.title}</strong>
                  <span>{currentSong.artist}</span>
                </div>
                <div className="player-controls">
                  <IconButton label="Previous" onClick={goToPreviousSong}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 6.5v11l-8-5.5 8-5.5Z" />
                      <path d="M11 6.5v11l-8-5.5 8-5.5Z" />
                    </svg>
                  </IconButton>
                  <IconButton
                    label={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect height="12" rx="1.4" width="3.5" x="6" y="6" />
                        <rect height="12" rx="1.4" width="3.5" x="14.5" y="6" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 6.5v11l9-5.5-9-5.5Z" />
                      </svg>
                    )}
                  </IconButton>
                  <IconButton
                    label="Stop"
                    onClick={() => {
                      const audio = audioRef.current;
                      if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                      }
                      setIsPlaying(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect height="10" rx="1.6" width="10" x="7" y="7" />
                    </svg>
                  </IconButton>
                  <IconButton label="Next" onClick={goToNextSong}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 6.5v11l8-5.5-8-5.5Z" />
                      <path d="M13 6.5v11l8-5.5-8-5.5Z" />
                    </svg>
                  </IconButton>
                  <IconButton
                    label={isMuted ? "Unmute" : "Mute"}
                    onClick={() => setIsMuted((current) => !current)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 10h4l5-4v12l-5-4H4z" />
                      {isMuted ? (
                        <path d="M16 8l4 8M20 8l-4 8" />
                      ) : (
                        <path
                          d="M16 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10"
                          fill="none"
                        />
                      )}
                    </svg>
                  </IconButton>
                </div>
                <audio
                  onEnded={() => {
                    setIsPlaying(false);
                    goToNextSong();
                  }}
                  ref={audioRef}
                >
                  <source src={currentSong.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            </section>
          ) : null}

          {currentPage === "messages" ? (
            <section className="celebration-section messages-section">
              <div className="flipbook-shell">
                {MESSAGE_BOOK_PAGES[messagePageIndex].kind === "message" ? (
                  <article className="flipbook-spread">
                    <div
                      className="flipbook-left-page"
                      style={{
                        background: MESSAGE_BOOK_PAGES[messagePageIndex].accent,
                      }}
                    >
                      <div className="flipbook-image-placeholder">
                        <span>
                          {MESSAGE_BOOK_PAGES[messagePageIndex].title}
                        </span>
                      </div>
                    </div>

                    <div className="flipbook-right-page">
                      <h3>{MESSAGE_BOOK_PAGES[messagePageIndex].title}</h3>
                      <p className="typewriter-text">
                        {typedText}
                        <span className="typewriter-caret" aria-hidden="true">
                          |
                        </span>
                      </p>
                    </div>
                  </article>
                ) : (
                  <article
                    className={`flipbook-single-page ${MESSAGE_BOOK_PAGES[messagePageIndex].kind} ${
                      MESSAGE_BOOK_PAGES[messagePageIndex].kind === "cover"
                        ? "right-only"
                        : "left-only"
                    }`}
                  >
                    <h3>{MESSAGE_BOOK_PAGES[messagePageIndex].title}</h3>
                    <p>{MESSAGE_BOOK_PAGES[messagePageIndex].subtitle}</p>
                  </article>
                )}

                <div className="flipbook-controls">
                  <button
                    aria-label="Previous page"
                    className="nav-button nav-icon-button"
                    disabled={messagePageIndex === 0}
                    onClick={goToPreviousBookPage}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>

                  <button
                    aria-label="Next page"
                    className="nav-button nav-icon-button"
                    disabled={
                      messagePageIndex === MESSAGE_BOOK_PAGES.length - 1
                    }
                    onClick={goToNextBookPage}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {currentPage === "finale" ? (
            <section className="celebration-section finale-section">
              <article className="finale-card">
                <div className="finale-heart">💖</div>
                <div className="finale-content">
                  <h2 className="finale-title">
                    {FINALE_CONTENT.titleLines[0]}
                    <br />
                    {FINALE_CONTENT.titleLines[1]}
                  </h2>
                  <p className="finale-subtitle">{FINALE_CONTENT.subtitle}</p>
                  <p className="finale-closing">
                    {FINALE_CONTENT.closing} {FINALE_CONTENT.sparkle}
                  </p>
                </div>
              </article>
            </section>
          ) : null}

          {renderPageNavigation()}
        </section>
      </main>
    );
  }

  return (
    <main className="birthday-page">
      {renderThemeMusicLayer()}
      <div className="matrix-layer" aria-hidden="true">
        {drops.map((drop) => (
          <span
            className="matrix-column"
            key={drop.id}
            style={{
              left: drop.left,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
              fontSize: drop.size,
              opacity: drop.opacity,
            }}
          >
            {drop.content}
          </span>
        ))}
      </div>

      <section className="content">
        {phase === "countdown" ? (
          <div className="countdown" role="status" aria-live="polite">
            <span className="countdown-number" key={countdown}>
              {countdown}
            </span>
          </div>
        ) : null}

        {phase === "words" ? (
          <h1
            className="final-message single-word"
            key={FINAL_WORDS[wordIndex]}
          >
            <span className="final-word">{FINAL_WORDS[wordIndex]}</span>
          </h1>
        ) : null}

        {phase === "final" ? (
          <div className="final-stage">
            <h1 className="final-message smooth-final-message">
              <span className="final-word">{FINAL_PREFIX} </span>
              <span className="final-word dynamic-name">{finalNameText}</span>
            </h1>

            <div className="celebrate-wrap">
              <button
                className="celebrate-button"
                onClick={() => setCurrentPage("photos")}
              >
                Let's Celebrate
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default App;
