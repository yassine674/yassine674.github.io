/* ========================================
   PIXELS.JS — Canvas Particle System
   ======================================== */

const PixelCanvas = (() => {
    const canvas = document.getElementById('pixel-canvas');
    const ctxCanvas = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const PARTICLE_COUNT = 120;
    const PIXEL_SIZE = 3;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle(x, y) {
        return {
            x: x ?? Math.random() * width,
            y: y ?? Math.random() * height,
            size: PIXEL_SIZE * (0.5 + Math.random() * 1),
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -0.3 - Math.random() * 0.7,
            opacity: Math.random() * 0.6 + 0.1,
            fadeSpeed: 0.001 + Math.random() * 0.003,
            life: 1,
            maxLife: 0.6 + Math.random() * 0.4,
            flickerRate: Math.random() * 0.1,
            flickerOffset: Math.random() * Math.PI * 2
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function update() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.fadeSpeed;

            // Flicker
            const flicker = Math.sin(Date.now() * p.flickerRate + p.flickerOffset);
            p.currentOpacity = p.opacity * p.life * (0.7 + flicker * 0.3);

            // Respawn if dead or off-screen
            if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > width + 10) {
                particles[i] = createParticle(
                    Math.random() * width,
                    height + 10
                );
            }
        }
    }

    function draw() {
        ctxCanvas.clearRect(0, 0, width, height);

        for (const p of particles) {
            if (p.currentOpacity <= 0) continue;
            ctxCanvas.fillStyle = `rgba(255, 255, 255, ${p.currentOpacity})`;
            // Draw pixel-perfect squares
            const s = Math.round(p.size);
            ctxCanvas.fillRect(
                Math.round(p.x),
                Math.round(p.y),
                s, s
            );
        }
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    function start() {
        init();
        animate();
    }

    // Burst effect at a point
    function burst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
            const speed = 2 + Math.random() * 3;
            const p = createParticle(x, y);
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed;
            p.life = 0.5 + Math.random() * 0.5;
            p.fadeSpeed = 0.015 + Math.random() * 0.01;
            p.size = PIXEL_SIZE * (1 + Math.random());
            p.opacity = 0.8 + Math.random() * 0.2;
            particles.push(p);
        }
    }

    window.addEventListener('resize', resize);

    return { start, burst, resize };
})();
