/* ==========================================================================
   ✨ A LITTLE UNIVERSE MADE JUST FOR YOU ✨
   Vanilla JavaScript Engine: Canvas Particles, Web Audio Synth, Envelope 3D,
   Typing Animation, Interactive 3D Cake, Fireworks & Confetti
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. DYNAMIC CANVAS BACKGROUND & PARTICLE ENGINE (60 FPS)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initBackgroundElements();
    });

    // Particle Arrays
    let stars = [];
    let hearts = [];
    let fireflies = [];
    let mouseTrail = [];
    let shootingStars = [];
    let fireworks = [];
    let confetti = [];
    let smokeParticles = [];

    // --- Star Field Class ---
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random();
            this.speed = Math.random() * 0.02 + 0.005;
            this.growing = Math.random() > 0.5;
        }

        update() {
            if (this.growing) {
                this.alpha += this.speed;
                if (this.alpha >= 1) this.growing = false;
            } else {
                this.alpha -= this.speed;
                if (this.alpha <= 0.2) this.growing = true;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = "#FFB6C1";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Floating Hearts Class ---
    class FloatingHeart {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 20 + Math.random() * 50;
            this.size = Math.random() * 14 + 10;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.alpha = Math.random() * 0.6 + 0.3;
            this.color = Math.random() > 0.5 ? '#FFB6C1' : '#F4C2C2';
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            this.y -= this.speedY;
            this.angle += 0.02;
            this.x += Math.sin(this.angle) * 0.8;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            
            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(this.x, this.y + topCurveHeight);
            ctx.bezierCurveTo(
                this.x, this.y, 
                this.x - this.size / 2, this.y, 
                this.x - this.size / 2, this.y + topCurveHeight
            );
            ctx.bezierCurveTo(
                this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                this.x, this.y + this.size, 
                this.x, this.y + this.size
            );
            ctx.bezierCurveTo(
                this.x, this.y + this.size, 
                this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                this.x + this.size / 2, this.y + topCurveHeight
            );
            ctx.bezierCurveTo(
                this.x + this.size / 2, this.y, 
                this.x, this.y, 
                this.x, this.y + topCurveHeight
            );
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Fireflies Class ---
    class Firefly {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1.5;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.8 + 0.2;
            this.alpha = Math.random() * 0.8 + 0.2;
        }

        update() {
            this.angle += (Math.random() - 0.5) * 0.2;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = "#FFDAB9";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#FFDAB9";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Mouse Trail Particle Class ---
    class SparkleParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.alpha = 1;
            this.color = Math.random() > 0.5 ? '#FFB6C1' : '#E6E6FA';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.025;
            this.size *= 0.96;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Shooting Star Class ---
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width * 1.5 - width * 0.2;
            this.y = Math.random() * (height * 0.4);
            this.length = Math.random() * 80 + 50;
            this.speed = Math.random() * 10 + 12;
            this.angle = Math.PI / 4; // 45 degrees
            this.alpha = 1;
            this.active = false;
        }

        trigger() {
            this.reset();
            this.active = true;
        }

        update() {
            if (!this.active) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= 0.015;

            if (this.alpha <= 0 || this.x > width || this.y > height) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            const endX = this.x - Math.cos(this.angle) * this.length;
            const endY = this.y - Math.sin(this.angle) * this.length;

            const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.5, '#FFB6C1');
            grad.addColorStop(1, 'transparent');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#FFB6C1';

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }
    }

    // --- Firework Particle ---
    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.08;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3 + 2;
        }

        update() {
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Confetti Particle ---
    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * width;
            this.y = -20;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            const colors = ['#FFB6C1', '#F4C2C2', '#E6E6FA', '#FFDAB9', '#FF6B6B', '#FFD700'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.02);
            this.rotation += this.rotSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            ctx.restore();
        }
    }

    // --- Cake Smoke Particle ---
    class SmokeParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = -Math.random() * 1.5 - 1;
            this.alpha = 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.size += 0.3;
            this.alpha -= 0.015;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = "rgba(220, 220, 230, 0.6)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize Canvas Objects
    function initBackgroundElements() {
        stars = Array.from({ length: 120 }, () => new Star());
        hearts = Array.from({ length: 15 }, () => new FloatingHeart());
        fireflies = Array.from({ length: 25 }, () => new Firefly());
        shootingStars = [new ShootingStar(), new ShootingStar()];
    }

    initBackgroundElements();

    // Trigger Shooting Star every 6 seconds
    setInterval(() => {
        const inactive = shootingStars.find(s => !s.active);
        if (inactive) inactive.trigger();
    }, 6000);

    // Mouse Movement Listener for Trail Glow & Custom Cursor
    const cursorGlow = document.getElementById('cursorGlow');
    window.addEventListener('mousemove', (e) => {
        cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        
        // Spawn mouse trail particles
        if (Math.random() > 0.3) {
            mouseTrail.push(new SparkleParticle(e.clientX, e.clientY));
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            cursorGlow.style.transform = `translate3d(${touch.clientX}px, ${touch.clientY}px, 0)`;
            mouseTrail.push(new SparkleParticle(touch.clientX, touch.clientY));
        }
    });

    // Main 60 FPS Canvas Render Loop
    function render() {
        // Clear & Draw Soft Night Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#0F0C1B');
        skyGrad.addColorStop(0.5, '#1F142E');
        skyGrad.addColorStop(1, '#2D1B36');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Update & Render Stars
        stars.forEach(star => { star.update(); star.draw(); });

        // Update & Render Shooting Stars
        shootingStars.forEach(sStar => { sStar.update(); sStar.draw(); });

        // Update & Render Hearts
        hearts.forEach(heart => { heart.update(); heart.draw(); });

        // Update & Render Fireflies
        fireflies.forEach(firefly => { firefly.update(); firefly.draw(); });

        // Update & Render Mouse Trail
        for (let i = mouseTrail.length - 1; i >= 0; i--) {
            mouseTrail[i].update();
            mouseTrail[i].draw();
            if (mouseTrail[i].alpha <= 0) mouseTrail.splice(i, 1);
        }

        // Update & Render Fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].alpha <= 0) fireworks.splice(i, 1);
        }

        // Update & Render Confetti
        for (let i = confetti.length - 1; i >= 0; i--) {
            confetti[i].update();
            confetti[i].draw();
            if (confetti[i].y > height + 20) confetti.splice(i, 1);
        }

        // Update & Render Cake Smoke
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            smokeParticles[i].update();
            smokeParticles[i].draw();
            if (smokeParticles[i].alpha <= 0) smokeParticles.splice(i, 1);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);


    // ----------------------------------------------------------------------
    // 2. WEB AUDIO API HARMONIC SYNTHESIZER (PLUG & PLAY AUDIO ENGINE)
    // ----------------------------------------------------------------------
    class WebAudioSynthEngine {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
            this.isPlaying = false;
            this.timer = null;

            /*
              CUSTOM AUDIO FILE NOTE:
              If you wish to use an external custom MP3 track (e.g. 'romantic_piano.mp3'),
              you can set: const CUSTOM_AUDIO_SRC = 'your_song.mp3';
            */
            this.customAudio = null;
        }

        init() {
            if (this.ctx) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }

        playMelody() {
            if (!this.ctx) this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.isPlaying = true;

            // Celestial pentatonic / romantic note sequence
            const notes = [
                261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
                440.00, 349.23, 329.63, 293.66, // A4, F4, E4, D4
                392.00, 493.88, 587.33, 659.25  // G4, B4, D5, E5
            ];

            let noteIdx = 0;
            const scheduleNote = () => {
                if (!this.isPlaying) return;

                const freq = notes[noteIdx % notes.length];
                this.playTone(freq, 1.2);

                noteIdx++;
                this.timer = setTimeout(scheduleNote, 700);
            };

            scheduleNote();
        }

        playTone(freq, duration) {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();

            osc.type = 'sine'; // Soft harmonic sine wave
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Envelope
            const now = this.ctx.currentTime;
            noteGain.gain.setValueAtTime(0, now);
            noteGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
            noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(noteGain);
            noteGain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + duration);
        }

        stopMelody() {
            this.isPlaying = false;
            if (this.timer) clearTimeout(this.timer);
        }

        setVolume(vol) {
            if (this.masterGain && this.ctx) {
                this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
            }
        }

        playChime() {
            if (!this.ctx) this.init();
            const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
            chimeNotes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 1.5), idx * 150);
            });
        }
    }

    const synth = new WebAudioSynthEngine();

    // Floating Music Player UI Logic
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const soundWave = document.getElementById('soundWave');
    const volumeSlider = document.getElementById('volumeSlider');

    function toggleMusic() {
        if (!synth.isPlaying) {
            synth.playMelody();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            soundWave.classList.add('active');
        } else {
            synth.stopMelody();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            soundWave.classList.remove('active');
        }
    }

    playPauseBtn.addEventListener('click', toggleMusic);

    volumeSlider.addEventListener('input', (e) => {
        synth.setVolume(parseFloat(e.target.value));
    });


    // ----------------------------------------------------------------------
    // 3. CINEMATIC INTRO TIMELINE LOGIC
    // ----------------------------------------------------------------------
    const introOverlay = document.getElementById('introOverlay');
    const introStep1 = document.getElementById('introStep1');
    const introStep2 = document.getElementById('introStep2');
    const introStep3 = document.getElementById('introStep3');
    const introStep4 = document.getElementById('introStep4');
    const enterUniverseBtn = document.getElementById('enterUniverseBtn');
    const mainApp = document.getElementById('mainApp');

    let introStarted = false;

    function startIntroSequence() {
        if (introStarted) return;
        introStarted = true;

        // Auto play soft synth music on first interaction
        synth.playMelody();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        soundWave.classList.add('active');

        // Step 1: "For Someone Truly Special..."
        introStep1.classList.add('active');

        // Step 2: "Today isn't just another day..."
        setTimeout(() => {
            introStep1.classList.remove('active');
            introStep2.classList.add('active');
        }, 3200);

        // Step 3: "It's the birthday..."
        setTimeout(() => {
            introStep2.classList.remove('active');
            introStep3.classList.add('active');
        }, 6400);

        // Step 4: Name Reveal
        setTimeout(() => {
            introStep3.classList.remove('active');
            introStep4.classList.add('active');
            enterUniverseBtn.classList.remove('hidden');
        }, 9600);
    }

    // Click anywhere during intro to trigger
    introOverlay.addEventListener('click', () => {
        if (!introStarted) {
            startIntroSequence();
        }
    });

    // Complete Intro & Enter Universe
    function enterUniverse() {
        introOverlay.classList.add('fade-out');
        mainApp.classList.remove('hidden-initially');
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 1500);
    }

    enterUniverseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterUniverse();
    });

    document.getElementById('beginSurpriseBtn').addEventListener('click', () => {
        document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
    });


    // ----------------------------------------------------------------------
    // 4. LOVE LETTER 3D ENVELOPE & TYPING ANIMATION
    // ----------------------------------------------------------------------
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const typedTextElem = document.getElementById('typedText');
    const envelopeHint = document.getElementById('envelopeHint');

    const letterMessage = `Happy Birthday!

Today is all about celebrating someone incredibly wonderful.

Your kindness,
your smile,
your heart,
and your beautiful soul make the world a happier place.

I hope this year brings endless happiness, exciting adventures, peaceful moments, and every dream you've ever wished for.

Never stop smiling because your smile is truly priceless.

Thank you for simply being you.

Have the happiest birthday ever.

❤️`;

    let letterOpened = false;

    envelopeWrapper.addEventListener('click', () => {
        if (letterOpened) return;
        letterOpened = true;

        envelopeWrapper.classList.add('open');
        envelopeHint.textContent = "✨ Reading message... ✨";
        synth.playChime();

        // Start typing after envelope flap opens
        setTimeout(() => {
            typeWriterEffect(letterMessage, typedTextElem, 40);
        }, 800);
    });

    function typeWriterEffect(text, element, speed) {
        let index = 0;
        element.textContent = "";

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                envelopeHint.textContent = "💖 Made with love 💖";
            }
        }
        type();
    }


    // ----------------------------------------------------------------------
    // 5. INTERACTIVE 3D BIRTHDAY CAKE & CANDLE BLOWING
    // ----------------------------------------------------------------------
    const blowCandlesBtn = document.getElementById('blowCandlesBtn');
    const blowBtnText = document.getElementById('blowBtnText');
    const cakeStatus = document.getElementById('cakeStatus');
    const candles = document.querySelectorAll('.candle');

    let candlesBlown = false;

    blowCandlesBtn.addEventListener('click', () => {
        if (candlesBlown) return;
        candlesBlown = true;

        // Extinguish Candle Flames
        candles.forEach(candle => {
            candle.classList.add('blown');

            // Emit Smoke Particles
            const rect = candle.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                smokeParticles.push(new SmokeParticle(rect.left + 6, rect.top - 10));
            }
        });

        // Sound & Effects
        synth.playChime();
        spawnConfettiBurst();

        blowBtnText.textContent = "✨ Wishes Sent to the Stars!";
        cakeStatus.textContent = "Your candles are blown out! May all your wishes come true! 🎉";
        blowCandlesBtn.style.background = "linear-gradient(135deg, #B39DDB, #E6E6FA)";
    });


    // ----------------------------------------------------------------------
    // 6. GRAND SURPRISE CELEBRATION
    // ----------------------------------------------------------------------
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseMessage = document.getElementById('surpriseMessage');

    surpriseBtn.addEventListener('click', () => {
        // Trigger Fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const rx = Math.random() * width * 0.8 + width * 0.1;
                const ry = Math.random() * height * 0.5 + height * 0.1;
                const colors = ['#FFB6C1', '#FFD700', '#F4C2C2', '#E6E6FA', '#FF6B6B'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                for (let p = 0; p < 45; p++) {
                    fireworks.push(new FireworkParticle(rx, ry, color));
                }
            }, i * 300);
        }

        // Trigger Confetti Burst
        spawnConfettiBurst();

        // Audio & Reveal Text
        synth.playChime();
        surpriseMessage.classList.remove('hidden');

        // Scroll smoothly to message
        surpriseMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function spawnConfettiBurst() {
        for (let i = 0; i < 90; i++) {
            confetti.push(new ConfettiPiece());
        }
    }


    // ----------------------------------------------------------------------
    // 7. WISHES CAROUSEL LOGIC
    // ----------------------------------------------------------------------
    const wishCards = document.querySelectorAll('.wish-card');
    const wishPrevBtn = document.getElementById('wishPrevBtn');
    const wishNextBtn = document.getElementById('wishNextBtn');
    const carouselDotsContainer = document.getElementById('carouselDots');

    let currentWishIdx = 0;

    // Create Carousel Dots
    wishCards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToWish(idx));
        carouselDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToWish(idx) {
        wishCards[currentWishIdx].classList.remove('active');
        dots[currentWishIdx].classList.remove('active');

        currentWishIdx = (idx + wishCards.length) % wishCards.length;

        wishCards[currentWishIdx].classList.add('active');
        dots[currentWishIdx].classList.add('active');
    }

    wishPrevBtn.addEventListener('click', () => goToWish(currentWishIdx - 1));
    wishNextBtn.addEventListener('click', () => goToWish(currentWishIdx + 1));

    // Auto rotate wishes every 5 seconds
    setInterval(() => {
        goToWish(currentWishIdx + 1);
    }, 5000);


    // ----------------------------------------------------------------------
    // 8. INTERSECTION OBSERVER FOR SCROLL FADE-IN ANIMATIONS
    // ----------------------------------------------------------------------
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .fade-in').forEach(elem => {
        observer.observe(elem);
    });

});
