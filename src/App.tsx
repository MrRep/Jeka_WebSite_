import React from "react";
import { motion } from "motion/react";
import { Mail, UserPlus, MessageSquare, Send, Share2, Eye, Ban, Star, Link as LinkIcon, Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Constants ---
const USER_NAME = "Tino @ Pimp-My-Profile.com";
const PROFILE_PIC = "https://picsum.photos/id/177/150/150"; 
const MURAL_IMAGE = "https://picsum.photos/seed/gothgirl/800/600";

const INITIAL_TRACKS = [
  { title: "Evanescence - Bring Me To Life", duration: "3:56", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "My Chemical Romance - Black Parade", duration: "5:11", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "HIM - Join Me In Death", duration: "3:39", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Sisters of Mercy - Temple of Love", duration: "4:40", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Nightwish - Nemo", duration: "4:36", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "Within Temptation - Ice Queen", duration: "5:20", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { title: "Lacuna Coil - Heaven's A Lie", duration: "4:46", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { title: "Bauhaus - Bela Lugosi's Dead", duration: "9:36", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { title: "Type O Negative - Black No. 1", duration: "4:39", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  { title: "Epica - Cry for the Moon", duration: "5:04", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
];

const FORTUNES = [
  "Shadows dance where light fears to tread.",
  "The moon knows secrets you have yet to dream.",
  "Your reflection isn't watching you today.",
  "A dark corridor leads to a familiar whisper.",
  "Midnight brings clarity to the restless soul.",
  "Silver keys unlock leaden hearts.",
  "The ravens carry letters you'll never read.",
  "Echoes of the past are louder than the future.",
  "Dust to dust, but the spirit remains restless.",
  "A black rose blooms in the cold winter air."
];

// --- Components ---

const GothBox = ({ children, title, className = "" }: { children: React.ReactNode, title?: string, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-black border-[3px] border-dashed border-white p-3 mb-4 shadow-[5px_5px_0px_#1a1a1a] ${className}`}
  >
    {title && <h3 className="text-[#a1a1a1] text-xs font-bold mb-2 uppercase tracking-widest">{title}</h3>}
    {children}
  </motion.div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[#a1a1a1] text-sm font-bold uppercase mb-2 border-b border-dashed border-[#333] pb-1">
    {children}
  </h2>
);

const LabelValue = ({ label, value }: { label: string, value: string }) => (
  <div className="flex gap-4 text-xs mb-1">
    <span className="font-bold text-[#888] min-w-[70px]">{label}</span>
    <span className="text-white">{value}</span>
  </div>
);

export default function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [tracks, setTracks] = React.useState(INITIAL_TRACKS);
  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(0.7);
  const [currentTime, setCurrentTime] = React.useState("0:00");
  const [fortune, setFortune] = React.useState(() => FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, tracks]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  const castSpell = () => {
    let newFortune = fortune;
    while (newFortune === fortune) {
      newFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    }
    setFortune(newFortune);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newTrack = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        duration: "??:??",
        url: url
      };
      setTracks([newTrack, ...tracks]);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-purple-800 pb-24 goth-gradient">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      {/* Background patterns */}
      <div className="fixed inset-0 ankh-bg pointer-events-none opacity-20" />
      <div className="fixed inset-0 goth-pattern pointer-events-none opacity-10" />

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col md:grid md:grid-cols-[300px_1fr] gap-6">
        
        {/* SIDEBAR LEFT */}
        <aside className="w-full">
          {/* Profile Header */}
          <GothBox>
            <h1 className="text-white font-bold text-lg mb-2 truncate" title={USER_NAME}>{USER_NAME}</h1>
            <div className="flex gap-4 items-start mb-3">
              <div className="border-[3px] border-white p-1 bg-[#1a1a1a]">
                <img 
                  src={PROFILE_PIC} 
                  alt="Profile" 
                  className="w-[100px] h-[100px] object-cover grayscale brightness-75 contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="italic text-[#aaa]">"The night is young."</p>
                <p>Male</p>
                <p>100 years old</p>
                <p>Las Cruces, NM</p>
                <p className="mt-2 text-[#888]">Online since 2006</p>
              </div>
            </div>
          </GothBox>

          {/* Daily Spell / Fortune Block (Replaces grid) */}
          <GothBox title="Daily Shadow Spell">
            <div className="flex flex-col items-center text-center p-2 space-y-4">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div 
                    key={fortune}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2 }}
                    className="absolute inset-0 border border-purple-500 rounded-full animate-ping" 
                  />
                  <Star size={32} className="text-purple-400 opacity-50" />
               </div>
               <motion.p 
                key={fortune}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] italic text-[#ccc] leading-relaxed min-h-[3em]"
               >
                  "{fortune}"
               </motion.p>
               <button 
                onClick={castSpell}
                className="text-[9px] uppercase tracking-widest text-[#555] hover:text-white transition-colors cursor-pointer border border-[#222] px-2 py-1 bg-[#111]"
               >
                  Cast another spell
               </button>
            </div>
          </GothBox>

          {/* Links and Stats */}
          <GothBox title="Relics">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-purple-400 cursor-pointer hover:underline">
                 <LinkIcon size={10} /> <span>Personal Grimoire</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-purple-400 cursor-pointer hover:underline">
                 <Eye size={10} /> <span>Soul Count: 4,588,481</span>
              </div>
            </div>
          </GothBox>
        </aside>

        {/* MAIN CONTENT RIGHT */}
        <main className="flex-1">
          
          {/* Welcome Mural */}
          <GothBox className="p-0 border-0 bg-transparent shadow-none overflow-hidden group">
            <div className="relative aspect-[4/3] bg-black border-[3px] border-dashed border-white flex flex-col items-center justify-center overflow-hidden">
              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
              
              <div className="absolute top-8 w-full text-center px-4 z-40">
                <motion.h2 
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ 
                    opacity: [1, 0.8, 1, 0.9, 1],
                    filter: ["blur(0px)", "blur(1px)", "blur(0px)", "blur(2px)", "blur(0px)"]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="font-serif text-4xl sm:text-6xl text-white font-light tracking-tight drop-shadow-[0_0_20px_#9333ea]"
                >
                  Welcome, I've been
                </motion.h2>
              </div>

              <div className="relative w-full h-full">
                 <img 
                  src={MURAL_IMAGE} 
                  alt="Atmospheric Goth" 
                  className="w-full h-full object-cover opacity-60 grayscale hue-rotate-[260deg] transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                 />
                 {/* Vignette Overlay */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_95%)]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              </div>

              <div className="absolute bottom-8 w-full text-center px-4 z-40">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [1, 0.9, 1, 0.8, 1],
                  }}
                  transition={{ 
                    delay: 0.5, 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                  className="font-serif text-4xl sm:text-6xl text-white font-light tracking-tight drop-shadow-[0_0_20px_#9333ea]"
                >
                  Expecting you...
                </motion.h2>
              </div>
            </div>
          </GothBox>

          {/* Music Section */}
          <GothBox title="Vinyl Collection & Uploads">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold">Now Spinning: <span className="text-purple-500 font-mono italic">"{currentTrack.title}"</span></span>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="audio/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[9px] border border-purple-500/50 px-2 py-1 bg-purple-900/10 text-purple-300 uppercase hover:bg-purple-900/30 transition-all cursor-pointer"
              >
                Upload Your Music
              </button>
            </div>
            
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 thin-scrollbar">
              {tracks.map((track, i) => (
                <div 
                  key={i} 
                  onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                  className={`flex items-center justify-between p-2 text-xs border border-[#222] cursor-pointer hover:bg-[#111] transition-colors group ${currentTrackIndex === i ? 'bg-[#1a0b2e] border-purple-500/50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#555] group-hover:text-purple-500">{String(i+1).padStart(2, '0')}</span>
                    {currentTrackIndex === i && isPlaying ? (
                       <div className="flex gap-0.5 items-end h-3">
                          <div className="w-0.5 bg-purple-500 animate-pulse h-full" />
                          <div className="w-0.5 bg-purple-500 animate-pulse h-2" style={{ animationDelay: '0.2s' }} />
                          <div className="w-0.5 bg-purple-500 animate-pulse h-full" style={{ animationDelay: '0.4s' }} />
                       </div>
                    ) : (
                       <Play size={10} className="text-[#444] group-hover:text-white" />
                    )}
                    <span className={`${currentTrackIndex === i ? 'text-purple-300 font-bold' : 'text-[#888]'}`}>{track.title}</span>
                  </div>
                  <span className="text-[10px] text-[#444]">{track.duration}</span>
                </div>
              ))}
            </div>
          </GothBox>

          {/* Blurbs */}
          <GothBox title={`${USER_NAME}'s Blurbs`}>
            <div className="mb-4">
              <SectionTitle>About me:</SectionTitle>
              <p className="text-xs text-[#ccc] leading-relaxed">
                I live for the shadows. This profile is a time capsule of dark music and vintage web aesthetics. If you can hear the music, you are already one of us.
              </p>
            </div>
          </GothBox>
        </main>
      </div>

      {/* Floating Bottom Player */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t-[3px] border-white shadow-[0_-10px_20px_rgba(0,0,0,0.8)]"
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 w-1/3">
             <div className="w-12 h-12 bg-purple-900/20 border border-purple-500/50 flex items-center justify-center overflow-hidden relative">
                {isPlaying && <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />}
                <Music size={24} className={`text-purple-500 ${isPlaying ? 'animate-bounce' : 'opacity-50'}`} />
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-purple-400 uppercase tracking-tighter">Now Playing</span>
                <span className="text-sm font-bold text-white truncate">{currentTrack.title}</span>
             </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button 
                onClick={prevTrack}
                className="text-white hover:text-purple-400 transition-colors cursor-pointer"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="text-white hover:text-purple-400 transition-colors cursor-pointer"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
            {/* Progress Bar Container */}
            <div 
              className="w-full h-2 bg-[#222] border border-[#333] cursor-pointer relative group"
              onClick={handleSeek}
            >
                <motion.div 
                  className="h-full bg-purple-600 shadow-[0_0_10px_purple]" 
                  initial={false}
                  animate={{ width: `${progress}%` }}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 w-1/3 justify-end">
             <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-[#666]" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-[#222] appearance-none rounded-full cursor-pointer accent-purple-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#555]">{currentTime} / {currentTrack.duration}</span>
             </div>
          </div>
        </div>
      </motion.div>

      <footer className="relative z-10 text-center py-12 pb-32 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-[#444] uppercase tracking-[0.5em]">
          Designed in 2006 &bull; Modified for the Modern Night
        </p>
      </footer>
    </div>
  );
}
