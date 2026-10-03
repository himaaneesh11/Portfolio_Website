/* =========================================================
   ABOUT PAGE JS — CINEMATIC MOTION & INTERACTION ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =====================================================
       1. ENTRANCE MOTION SEQUENCER (~1s smooth reveal)
    ===================================================== */
    const initEntrance = () => {
        if (isReducedMotion) return;

        // Step 1: Reveal headline line 1 & line 2
        const line1 = document.getElementById("headline1");
        const line2 = document.getElementById("headline2");

        setTimeout(() => {
            if (line1) line1.classList.add("revealed");
        }, 120);

        setTimeout(() => {
            if (line2) line2.classList.add("revealed");
        }, 280);

        // Step 2: Reveal identity block & hero items
        const revealItems = document.querySelectorAll("#hero .reveal-item");
        revealItems.forEach((item, idx) => {
            setTimeout(() => {
                item.classList.add("revealed");
            }, 380 + idx * 100);
        });

        // Step 3: Trigger Shutter light line & Portrait clip-path reveal
        const shutterLight = document.getElementById("shutterLight");
        const portraitWrap = document.getElementById("portraitWrap");

        setTimeout(() => {
            if (shutterLight) shutterLight.classList.add("shutter-active");
        }, 500);

        setTimeout(() => {
            if (portraitWrap) portraitWrap.classList.add("revealed");
        }, 650);
    };

    initEntrance();

    /* =====================================================
       2. MULTI-DEPTH MOUSE PARALLAX (Desktop only)
    ===================================================== */
    const hero = document.getElementById("hero");
    const portraitImg = document.getElementById("heroPortrait");
    const redAtmosphere = document.getElementById("heroRedAtmosphere");
    const heroLeft = document.getElementById("heroLeft");

    if (hero && portraitImg && redAtmosphere && window.innerWidth > 900 && !isReducedMotion) {
        let mouseReqId = null;

        hero.addEventListener("mousemove", (e) => {
            if (mouseReqId) cancelAnimationFrame(mouseReqId);

            mouseReqId = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                // Multi-layer depth translations
                // Layer 1 (Foreground Image): Max 10px
                portraitImg.style.transform = `scale(1) translate(${x * 10}px, ${y * 10}px)`;

                // Layer 2 (Background Glow): Max 26px (moves faster for spatial depth)
                redAtmosphere.style.transform = `translate(${x * 26}px, ${y * 22}px)`;

                // Layer 3 (Left Typography): Subtle counter movement
                if (heroLeft) {
                    heroLeft.style.transform = `translate(${x * -4}px, ${y * -3}px)`;
                }
            });
        });

        hero.addEventListener("mouseleave", () => {
            if (mouseReqId) cancelAnimationFrame(mouseReqId);

            portraitImg.style.transform = "scale(1) translate(0px, 0px)";
            redAtmosphere.style.transform = "translate(0px, 0px)";
            if (heroLeft) heroLeft.style.transform = "translate(0px, 0px)";
        });
    }

    /* =====================================================
       3. SCROLL-LINKED PARALLAX & EXIT LINE
    ===================================================== */
    const heroRight = document.getElementById("heroRight");
    const heroExitLine = document.getElementById("heroExitLine");

    let scrollReqId = null;

    const handleScroll = () => {
        if (isReducedMotion) return;

        const scrollY = window.scrollY || window.pageYOffset;
        const heroHeight = hero ? hero.offsetHeight : 800;

        if (scrollY <= heroHeight * 1.5) {
            // Scroll parallax speed differentials
            if (heroLeft) {
                heroLeft.style.transform = `translateY(${scrollY * 0.12}px)`;
            }
            if (heroRight) {
                heroRight.style.transform = `translateY(${scrollY * 0.22}px)`;
            }

            // Expanding exit line
            if (heroExitLine) {
                const lineProgress = Math.min(100, (scrollY / (heroHeight * 0.6)) * 100);
                heroExitLine.style.width = `${lineProgress}%`;
            }
        }
    };

    window.addEventListener("scroll", () => {
        if (scrollReqId) cancelAnimationFrame(scrollReqId);
        scrollReqId = requestAnimationFrame(handleScroll);
    }, { passive: true });

    /* =====================================================
       4. INTERSECTION OBSERVER FOR SECTION REVEALS
    ===================================================== */
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
    };

    const sectionElements = document.querySelectorAll(".approach-item, .exploring-row, .cta-container");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionElements.forEach((el) => revealObserver.observe(el));

    /* =====================================================
       5. SMOOTH SCROLL TRIGGER
    ===================================================== */
    const scrollTrigger = document.getElementById("scrollTrigger");
    if (scrollTrigger) {
        scrollTrigger.addEventListener("click", () => {
            const targetId = scrollTrigger.getAttribute("data-scroll-target");
            if (targetId) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    /* =====================================================
       6. DYNAMIC FOOTER YEAR
    ===================================================== */
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});