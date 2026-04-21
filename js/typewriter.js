/* ========================================
   TYPEWRITER.JS — Pixel Typewriter Effect
   ======================================== */

const Typewriter = (() => {
    const phrases = [
        'Étudiant des Mines',
        "Passionné d'IA & Finance >_>",
        'C / Python Developer',
        'Machine Learning ///',
        'Algorithmes & Mathématiques',
        'Problem solver',
        'Code. Train. Predict. Repeat.'
    ];

    let element = null;
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    let timeout = null;
    let isPaused = false;

    function init(elementId) {
        element = document.getElementById(elementId);
        if (!element) return;
        type();
    }

    function type() {
        if (isPaused) return;

        const phrase = phrases[currentPhrase];

        if (isDeleting) {
            // Remove characters
            currentChar--;
            element.textContent = phrase.substring(0, currentChar);

            if (currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                timeout = setTimeout(type, 400);
                return;
            }
            timeout = setTimeout(type, 30 + Math.random() * 30);
        } else {
            // Add characters
            currentChar++;
            element.textContent = phrase.substring(0, currentChar);

            if (currentChar === phrase.length) {
                // Pause at end of phrase
                isDeleting = true;
                timeout = setTimeout(type, 2500);
                return;
            }
            timeout = setTimeout(type, 60 + Math.random() * 80);
        }
    }

    function pause() {
        isPaused = true;
        if (timeout) clearTimeout(timeout);
    }

    function resume() {
        isPaused = false;
        type();
    }

    return { init, pause, resume };
})();
