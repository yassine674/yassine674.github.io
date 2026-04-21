/* ========================================
   MAIN.JS — Portfolio Logic Core
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // === Initialize Systems ===
    if (typeof PixelCanvas !== 'undefined') PixelCanvas.start();
    
    let isSoundInit = false;

    // === Boot Sequence ===
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const bootSequence = [
        "INITIALIZING CORE SYSTEM...",
        "LOADING KERNEL MODULES [OK]",
        "MOUNTING VIRTUAL FILESYSTEM [OK]",
        "ESTABLISHING SECURE CONNECTION...",
        "USER AUTHENTICATED: ISMIN_STUDENT",
        "ACCESS GRANTED.",
        "WAKING UP NEURAL LINK..."
    ];

    function runBootSequence() {
        let delay = 0;
        const prompt = document.getElementById('boot-prompt');
        if (prompt) prompt.style.display = 'none';
        
        bootSequence.forEach((text, index) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'boot-line';
                line.textContent = `> ${text}`;
                bootText.appendChild(line);
                if (typeof SoundEngine !== 'undefined' && isSoundInit) SoundEngine.typeKey();
            }, delay);
            delay += 200 + Math.random() * 300;
        });

        // Hide boot screen after sequence
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            
            // Start Hero Cipher Animation
            setTimeout(() => {
                animateCipherTitles();
                if (typeof Typewriter !== 'undefined') Typewriter.init('hero-typewriter');
            }, 500);
        }, delay + 800);
    }

    // Run boot sequence on initial click to allow audio
    document.body.addEventListener('click', () => {
        if (!isSoundInit) {
            if (typeof SoundEngine !== 'undefined') {
                SoundEngine.init();
            }
            isSoundInit = true;
            runBootSequence();
        }
    }, { once: true });

    // === Hacker Cipher Animation ===
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    
    function startCipherEffect(element) {
        let iterations = 0;
        const targetText = element.getAttribute('data-text');
        
        clearInterval(element.cipherInterval);
        
        element.cipherInterval = setInterval(() => {
            element.innerText = targetText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return targetText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            
            if (iterations >= targetText.length) {
                clearInterval(element.cipherInterval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }

    function animateCipherTitles() {
        const cipherTitles = document.querySelectorAll('.hero-cipher');
        cipherTitles.forEach((el, i) => {
            setTimeout(() => startCipherEffect(el), i * 400);
        });
    }

    // === DOM Elements ===
    const navBurger = document.getElementById('nav-burger');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const pixelBtns = document.querySelectorAll('.pixel-btn');

    // User interaction handled in boot sequence above

    // === Mobile Navigation ===
    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navBurger.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // === Smooth Scroll & Navigation Highlighting ===
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // Intersection Observer for Current Section Highlighting
    const sections = document.querySelectorAll('.section');
    const navObserverOptions = { threshold: 0.4 };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);
    
    sections.forEach(sec => navObserver.observe(sec));


    // === Dynamic Stats Calculation ===
    const projectCountEl = document.getElementById('dynamic-project-count');
    if (projectCountEl) {
        projectCountEl.setAttribute('data-target', document.querySelectorAll('.project-card').length);
    }
    const skillCountEl = document.getElementById('dynamic-skill-count');
    if (skillCountEl) {
        skillCountEl.setAttribute('data-target', document.querySelectorAll('.skill-tag').length);
    }

    // === Scroll Reveals ===
    const revealElements = document.querySelectorAll('.project-card, .about-text p, .skill-category, .contact-card');
    
    // Default add class structure
    revealElements.forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.stat-item').forEach(el => el.classList.add('reveal-pixel'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Trigger stats counter
                if (entry.target.classList.contains('reveal-pixel') && entry.target.querySelector('.stat-value')) {
                    const counter = entry.target.querySelector('.stat-value');
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -100px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.stat-item').forEach(el => revealObserver.observe(el));

    // Number counter animation
    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 30; // 30 frames
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + (target > 50 ? '+' : '');
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current);
            }
        }, 50);
    }


    // === Interactive Hover Sounds ===
    const interactables = document.querySelectorAll('a, button, .project-card, .contact-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Generate visual burst on canvas
            if (typeof PixelCanvas !== 'undefined' && el.classList.contains('pixel-btn')) {
                const rect = el.getBoundingClientRect();
                PixelCanvas.burst(
                    rect.left + rect.width / 2, 
                    rect.top + rect.height / 2,
                    8 // Particle count
                );
            }
        });
    });

    // Hover cipher decode on section titles
    document.querySelectorAll('.glitch-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            startCipherEffect(el);
        });
    });

});
