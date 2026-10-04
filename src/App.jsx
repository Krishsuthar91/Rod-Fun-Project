import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Globe, Linkedin, Instagram, Twitter, Youtube, X, Sparkles, Gamepad2, Flame, ShieldCheck, Hammer, Volume2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal.jsx';
import Reveal from './Reveal.jsx';
import NavItem from './NavItem.jsx';
import Logo from './Logo.jsx';

// Swap for your own cinematic football clip (served from /public or a CDN).
const VIDEO_URL = '/hero.mp4';
const EASE = [0.16, 1, 0.3, 1];

const NAV = ['Academy', 'Analytics', 'Facilities', 'Fixtures', 'Contact'];
const FOOTER = {
  Company: ['About Us', 'Our Factory', 'Our Legacy', 'Future CEO'],
  Services: ['Chotu Steel Rods', 'Construction Solutions', 'Bulk Orders', 'Quality Testing'],
};

export default function App() {
  const [arrowCycle, setArrowCycle] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFunPage, setShowFunPage] = useState(false);
  const [sorryPopup, setSorryPopup] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const screen3Ref = useRef(null);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);

  // Metallic "Beating Steel Rod" Web Audio Synthesizer
  const playBeatingRodSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // 5 rapid rhythmic hammer strikes on a heavy steel rod: CLANK! CLANK! CLANK!
      const strikes = [0, 0.15, 0.30, 0.45, 0.62];

      strikes.forEach((delay) => {
        const t = ctx.currentTime + delay;

        // Metallic harmonic resonances of 12-foot steel rod
        [580, 1160, 2320, 3480, 4800].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.15);

          gain.gain.setValueAtTime(0.35 / (idx + 1), t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.26);
        });

        // Noise burst for heavy hammer impact
        const bufferSize = Math.floor(ctx.sampleRate * 0.06);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1200;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(t);
        noise.stop(t + 0.09);
      });
    } catch (err) {
      console.error('AudioContext error:', err);
    }
  };

  // Text-To-Speech function saying "I am sorry"
  const speakSorry = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("I am so sorry! Please forgive me!");
      msg.rate = 1.0;
      msg.pitch = 1.25;
      window.speechSynthesis.speak(msg);
    }
  };

  // Main Handler for Apology Button
  const triggerApology = () => {
    setSorryPopup(true);
    setShakeScreen(true);
    playBeatingRodSound();
    speakSorry();

    setTimeout(() => {
      setShakeScreen(false);
    }, 700);
  };

  // Scroll-driven video scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      if (video.seeking || !video.duration) return;
      const footer = screen3Ref.current;
      const end = (footer ? footer.offsetTop : document.body.scrollHeight) - window.innerHeight * 0.2;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end)));
      video.currentTime = p * video.duration;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onSeeked = () => onScroll();

    video.pause();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    video.addEventListener('seeked', onSeeked);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('seeked', onSeeked);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isLoaded]);

  return (
    <div className={`relative min-h-screen bg-black text-white font-sans antialiased ${shakeScreen ? 'animate-bounce' : ''}`}>
      {/* 1. Fixed video background */}
      <div ref={videoContainerRef} className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef} src={VIDEO_URL} muted playsInline preload="auto"
          onLoadedMetadata={() => setIsLoaded(true)}
          className="h-full w-full object-cover"
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 2. Fixed header */}
      <motion.header style={{ y: headerY }} className="fixed inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-[90%] items-center justify-between py-[clamp(1rem,2vw,1.75rem)]">
          <a href="#" aria-label="WISA home"><Logo /></a>
          <nav className="flex items-center gap-[clamp(1rem,2.5vw,2.5rem)]">
            <div className="hidden items-center gap-[clamp(1rem,2.5vw,2.5rem)] md:flex">
              {NAV.map((n) => <NavItem key={n} href={`#${n.toLowerCase()}`}>{n}</NavItem>)}
            </div>

            <button
              onClick={() => setShowFunPage(true)}
              className="pointer-events-auto rounded-full bg-white px-5 py-2.5 font-mono text-xs font-semibold tracking-wide text-black transition-all hover:scale-105 hover:opacity-90 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </nav>
        </div>
      </motion.header>

      {/* 3. Scrollable content */}
      <main className="pointer-events-none relative z-10">
        {/* HERO */}
        <section className="flex min-h-screen items-end pb-[clamp(2rem,6vw,5rem)]">
          <div className="mx-auto grid w-[90%] grid-cols-12 items-end gap-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="col-span-12 font-light leading-[1.02] tracking-tight lg:col-span-7"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              New Area New Goals New Vibe!
            </motion.h1>
            <div className="pointer-events-auto col-span-12 lg:col-span-5 lg:pl-[clamp(1rem,4vw,4rem)]">
              <Reveal delay={0.3}>
                <p className="max-w-[460px] text-base leading-relaxed text-white/64">
                  <strong className="font-semibold text-white">"Chandu Rod Limited — the rods are 12 feet, the owner is 5 feet." 😂💀</strong>{' '}
                  Meet the future owner of **Chandu Rod Limited**—a guy who's always dreaming big, even if he isn't the shortest in the room. One day he'll be running a huge steel empire, making rods that are longer than his gaming sessions. When he's not talking about the company, he's busy dominating **Free Fire** and convincing everyone that height doesn't matter when you've got skills. Whether it's building stronger foundations or chasing Booyahs, he does everything with confidence and a smile. The future CEO of **Chandu Rod Limited** is proof that you don't need to be tall to have big dreams—you just need a strong aim in Free Fire and an even stronger business waiting for you! 😄🏗️🎮
                </p>
                <button
                  onClick={() => setShowFunPage(true)}
                  onMouseEnter={() => setArrowCycle((c) => c + 1)}
                  className="group mt-8 inline-flex items-stretch overflow-hidden rounded-full cursor-pointer"
                >
                  <span className="bg-white/8 px-6 py-3.5 text-sm font-medium backdrop-blur-[80px] transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    Explore the club
                  </span>
                  <span className="relative ml-0.5 flex w-12 items-center justify-center overflow-hidden bg-white/8 backdrop-blur-[80px] transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <ArrowRight key={`o${arrowCycle}`} size={18} className={arrowCycle ? 'fly-out-right' : ''} />
                    <ArrowRight key={`i${arrowCycle}`} size={18} className={`absolute -translate-x-[250%] ${arrowCycle ? 'fly-in-left' : ''}`} />
                  </span>
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="analytics" className="flex min-h-screen items-center py-[clamp(4rem,10vw,9rem)]">
          <div className="mx-auto w-[90%]">
            <ScrollReveal
              containerClassName="max-w-[1100px]"
              textClassName="block font-light leading-[1.1] tracking-tight text-white"
            >
              CEO loading... Please wait. Current status: Playing Free Fire, giving hotspot in class, and reminding everyone that the height of confidence is measured in tons, not centimeters.
            </ScrollReveal>

            <div className="pointer-events-auto mt-[clamp(3rem,8vw,7rem)] grid grid-cols-1 gap-[clamp(1.5rem,3vw,3rem)] md:grid-cols-3">
              <Reveal>
                <div className="flex h-full min-h-[220px] flex-col items-start justify-between rounded-3xl border border-white/10 bg-[#1A1A1A]/40 p-8 backdrop-blur-[80px]">
                  <Globe size={36} strokeWidth={1.25} className="text-white/64" />
                  <Logo size={30} />
                </div>
              </Reveal>
              {[
                [
                  '🎮 CEO Loading...',
                  'Future Owner',
                  'Current Status: Playing Free Fire, giving hotspot in class, and preparing to inherit Chandu Rod Limited.'
                ],
                [
                  '🏗️ Rod Quality Check',
                  '100% Approved',
                  'The rods are tested for strength. The CEO is tested by his friends every single day.'
                ],
              ].map(([a, b, d], i) => (
                <Reveal key={a} delay={0.12 * (i + 1)}>
                  <div className="h-full rounded-3xl border border-white/10 bg-[#1A1A1A]/40 p-8 backdrop-blur-[80px]">
                    <h3 className="text-2xl font-medium leading-tight">{a}<br /><span className="text-white/60">{b}</span></h3>
                    <p className="mt-6 max-w-[320px] text-sm leading-relaxed text-white/40">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FOOTER */}
        <section ref={screen3Ref} id="contact" className="flex min-h-screen items-end pb-[clamp(1rem,2vw,2rem)] pt-[clamp(4rem,10vw,9rem)]">
          <div className="pointer-events-auto mx-auto w-[90%] rounded-[2rem] border p-[clamp(1.5rem,4vw,4rem)] backdrop-blur-[80px]"
            style={{ background: 'rgba(26,26,26,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <Reveal className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-[clamp(2rem,5vw,4rem)] md:flex-row md:items-end">
              <h2 className="font-light leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
                Built With Steel.<br /><span className="text-white/60">Powered By Free Fire.</span>
              </h2>
              <button
                onClick={() => setShowFunPage(true)}
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:opacity-90 active:scale-95 cursor-pointer"
              >
                Get started
              </button>
            </Reveal>

            <div className="grid grid-cols-2 gap-10 py-[clamp(2rem,5vw,4rem)] md:grid-cols-4">
              <div className="col-span-2 md:col-span-1">
                <Logo size={26} />
                <p className="mt-5 max-w-[240px] text-sm leading-relaxed text-white/40">
                  Premium steel rods built for stronger homes, bigger dreams and lifelong trust.
                </p>
              </div>
              {Object.entries(FOOTER).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-mono text-xs text-white/25">{title}</h4>
                  <ul className="mt-5 space-y-3">
                    {links.map((l) => (
                      <li key={l}>
                        <button onClick={() => setShowFunPage(true)} className="text-sm text-white/60 transition-colors hover:text-white text-left cursor-pointer">
                          {l}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h4 className="font-mono text-xs text-white/25">Connect</h4>
                <div className="mt-5 flex gap-4 text-white/60">
                  {[Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" aria-label="Social link" className="transition-colors hover:text-white"><Icon size={18} /></a>
                  ))}
                </div>
                <a href="mailto:futureceo@chandurod.com" className="mt-5 block text-sm text-white/60 hover:text-white">futureceo@chandurod.com 😂</a>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-2 border-t border-white/10 pt-6 font-mono text-xs text-white/25 sm:flex-row">
              <span>© 2026 Chandu Rod Limited. Forged with Strength. All rights reserved.</span>
              <span>Privacy · Terms</span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Fullscreen Fun Page Overlay (Second Webpage) */}
      <AnimatePresence>
        {showFunPage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-orange-600/20 to-red-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#121212]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl my-auto text-center">
              {/* Close Button */}
              <button
                onClick={() => setShowFunPage(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-mono font-medium text-amber-400 mb-6">
                <Sparkles size={14} className="animate-spin-slow" />
                OFFICIAL FUN DISCLAIMER 😂
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent mb-4">
                This Website Is Made Purely For Fun! 💀🔥
              </h2>

              <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
                Welcome to the official fan page of the future CEO of <strong className="text-amber-400 font-semibold">Chandu Rod Limited</strong>! No actual steel orders are being taken here (yet)... just good vibes, Free Fire Booyahs, and endless class hotspot sharing! 🎮🏗️
              </p>

              {/* Interactive Rod Strength & Discipline Button (Exclusive to 2nd Webpage) */}
              <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-950/30 p-5 text-center backdrop-blur-md">
                <p className="text-xs font-mono text-red-300 mb-3">🔨 STEEL ROD IMPACT & CEO TEST</p>
                <button
                  onClick={triggerApology}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm hover:from-red-500 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/40 cursor-pointer inline-flex items-center gap-2"
                >
                  <Hammer size={18} /> Test Steel Rod Strength 🔨🔊
                </button>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-2 text-amber-400 font-semibold text-sm">
                    <Gamepad2 size={18} /> CEO Status
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Currently in class giving 5G hotspot, clutching Free Fire matches, and planning to rule the steel industry.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-2 text-amber-400 font-semibold text-sm">
                    <Flame size={18} /> Height vs Rod Ratio
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    "The rods are 12 feet, the owner is 5 feet." But confidence is measured in TONS, not centimeters! 😂
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:col-span-2 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-2 text-amber-400 font-semibold text-sm">
                    <ShieldCheck size={18} /> 100% Quality Guaranteed
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Tested for extreme strength. No matter how much roasting happens in class, our future CEO stays undefeated! 🏆
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowFunPage(false)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Got It! Take Me Back To The Page 😂
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Sorry Animated Popup Modal (Only appears when the Rod Test button inside 2nd webpage is pressed) */}
      <AnimatePresence>
        {sorryPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 top-24 z-50 mx-auto max-w-lg rounded-3xl border-2 border-red-500/60 bg-red-950/95 p-6 shadow-2xl backdrop-blur-2xl text-center"
          >
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600/30 text-red-400 border border-red-500/50 animate-bounce">
                <Hammer size={32} className="rotate-45" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              I'M SO SORRY! 🥺🙏😭
            </h3>

            <p className="text-sm text-red-200 leading-relaxed mb-4">
              <strong className="text-white font-semibold">"CLANK! CLANK! CLANK! 🔨⚡"</strong><br />
              The steel rods of Chandu Rod Limited are being beaten for extra strength! The CEO humbly begs for your forgiveness! 🏗️💥
            </p>

            <button
              onClick={() => setSorryPopup(false)}
              className="px-6 py-2.5 rounded-full bg-white text-red-950 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all cursor-pointer"
            >
              Forgiveness Granted! 😂
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

