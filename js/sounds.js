/* ========================================
   SOUNDS.JS — Web Audio API Synthesizer (Serious Boot Tone)
   ======================================== */

const SoundEngine = (() => {
    let ctx = null;
    let initialized = false;

    function init() {
        if (initialized) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        initialized = true;
    }

    function ensureContext() {
        if (!ctx) init();
        if (ctx.state === 'suspended') ctx.resume();
    }

    // Create a simple oscillator note
    function playTone(freq, duration, type = 'square', volume = 0.08) {
        if (!ctx) return;
        ensureContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Typewriter key click (Mechanical/Deep)
    function typeKey() {
        ensureContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        // Lower frequency for a deeper "clack"
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 50, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    // Power on boot sound (Serious, deep server power up)
    function boot() {
        ensureContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        // Sub-bass sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(40, now); // start very low
        osc.frequency.exponentialRampToValueAtTime(80, now + 1.2); // rumble up

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2); // fade in
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // fade out

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        // A single short confirmation beep at the end
        setTimeout(() => {
            playTone(800, 0.1, 'sine', 0.03);
            setTimeout(() => playTone(1200, 0.15, 'sine', 0.03), 100);
        }, 1100);
    }

    return {
        init,
        typeKey,
        boot
    };
})();
