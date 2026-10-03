/* =====================================================
   HERO NAME MARQUEE
   Smooth RIGHT → LEFT continuous movement
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const track = document.getElementById("heroNameTrack");
    if (!track) return;

    const firstItem = track.querySelector(".hero-name-item");
    if (!firstItem) return;

    const SPEED = 108; // px/sec
    let position = window.innerWidth;
    let lastTime = performance.now();
    let itemWidth = firstItem.getBoundingClientRect().width;

    function updateMeasurements() {
        if (firstItem) {
            itemWidth = firstItem.getBoundingClientRect().width;
        }
    }

    window.addEventListener("resize", updateMeasurements);

    function animate(currentTime) {
        const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        position -= SPEED * deltaTime;

        while (itemWidth > 0 && position <= -itemWidth) {
            position += itemWidth;
        }

        track.style.transform = `translate3d(${position}px, 0, 0)`;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});


/* =====================================================
   INDEX → ABOUT CINEMATIC PAGE TRANSITION
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    function navigateToAbout() {
        if (document.querySelector(".page-exit-transition")) {
            return;
        }

        const transition = document.createElement("div");
        transition.className = "page-exit-transition";
        transition.innerHTML = `
            <div class="page-exit-line"></div>
            <span>ABOUT</span>
        `;
        document.body.appendChild(transition);

        requestAnimationFrame(() => {
            transition.classList.add("active");
        });

        setTimeout(() => {
            window.location.href = "about.html";
        }, 850);
    }

    /* Click anywhere on hero to navigate to about page */
    const heroSection = document.querySelector(".hero");

    if (heroSection) {
        heroSection.addEventListener("click", event => {
            const closestInteractive = event.target.closest("a, button");

            if (closestInteractive) {
                const href = closestInteractive.getAttribute("href");
                const isExternal = closestInteractive.target === "_blank";
                const isMenuBtn = closestInteractive.id === "menuButton" || closestInteractive.id === "mobileClose";

                if (isExternal || isMenuBtn) {
                    return; // Allow mobile menu and external social links to function naturally
                }

                if (href && (href.includes("projects.html") || href.includes("skills.html") || href.includes("contact.html"))) {
                    return; // Allow direct navigation for projects, skills, contact
                }
            }

            event.preventDefault();
            navigateToAbout();
        });
    }

});


/* =========================================================
   CINEMATIC PORTFOLIO INTRO
   SEQUENCE:
   1. LEFT → RIGHT (Small localized light window over typography)
   2. RIGHT → LEFT
   3. LEFT → RIGHT
   4. RIGHT → CENTER
   5. STOP AT CENTER & HOLD
   6. CENTER-OUTWARD FULL NAME REVEAL
   7. LIGHT SOFTLY FADES OUT
   8. EDITORIAL INVITATION ("EXPLORE THE WORK") ENTERS
   9. CLICK → EXIT & REVEAL HOMEPAGE HERO
   ========================================================= */

(function () {

    const intro = document.getElementById("portfolioIntro");
    const light = document.getElementById("introLight");
    const nameWrap = document.querySelector(".intro-name-wrap");
    const nameMask = document.querySelector(".intro-name-mask");
    const enterButton = document.getElementById("introEnter");

    if (!intro || !light || !nameMask || !enterButton || !nameWrap) {
        return;
    }

    /* Bypass intro if user has already seen it in this session */
    if (sessionStorage.getItem("hasSeenIntro") === "true") {
        intro.remove();
        return;
    }

    const SWEEP_TIME = 1350;
    const CENTER_PAUSE = 600;

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function setBeam(screenX) {
        const wrapRect = nameWrap.getBoundingClientRect();
        const relativeX = screenX - wrapRect.left;

        light.style.opacity = "1";
        light.style.transform = `translateX(${relativeX}px)`;

        nameMask.style.setProperty("--reveal-x", `${relativeX}px`);
        nameMask.style.setProperty("--reveal-w", "85px");
    }

    function sweep(fromX, toX) {
        return new Promise(resolve => {
            const start = performance.now();

            function frame(now) {
                const elapsed = now - start;
                const rawProgress = Math.min(elapsed / SWEEP_TIME, 1);
                const progress = easeInOutCubic(rawProgress);
                const currentX = fromX + (toX - fromX) * progress;

                setBeam(currentX);

                if (rawProgress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(frame);
        });
    }

    function expandCenterReveal() {
        return new Promise(resolve => {
            const start = performance.now();
            const DURATION = 1300;
            const maskRect = nameMask.getBoundingClientRect();
            const centerX = maskRect.width / 2;
            const targetWidth = Math.max(maskRect.width * 1.5, 1800);

            nameMask.style.setProperty("--reveal-x", `${centerX}px`);

            /* Softly fade out localized light window as reveal reaches completion */
            setTimeout(() => {
                if (light) light.style.opacity = "0";
            }, 500);

            function frame(now) {
                const elapsed = now - start;
                const rawProgress = Math.min(elapsed / DURATION, 1);
                const progress = easeInOutCubic(rawProgress);
                const currentW = 85 + (targetWidth - 85) * progress;

                nameMask.style.setProperty("--reveal-w", `${currentW}px`);

                if (rawProgress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    /* Unmask completely so text stays 100% visible */
                    nameMask.style.maskImage = "none";
                    nameMask.style.webkitMaskImage = "none";
                    resolve();
                }
            }

            requestAnimationFrame(frame);
        });
    }

    async function startIntro() {
        const winW = window.innerWidth;
        const wrapRect = nameWrap.getBoundingClientRect();
        
        const leftOffscreen = (wrapRect.width > 0 && wrapRect.left > 0) ? wrapRect.left - 180 : -180;
        const rightOffscreen = (wrapRect.width > 0 && wrapRect.right > 0) ? wrapRect.right + 180 : winW + 180;
        const centerPos = (wrapRect.width > 0 && wrapRect.left > 0) ? wrapRect.left + wrapRect.width / 2 : winW / 2;

        /* Initial state: Beam offscreen, name 100% hidden */
        nameMask.style.setProperty("--reveal-x", "-500px");
        nameMask.style.setProperty("--reveal-w", "85px");

        /* Initial pause for black/red atmosphere */
        await new Promise(resolve => setTimeout(resolve, 400));

        /* PHASE 1: LEFT → RIGHT */
        await sweep(leftOffscreen, rightOffscreen);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* PHASE 2: RIGHT → LEFT */
        await sweep(rightOffscreen, leftOffscreen);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* PHASE 3: LEFT → RIGHT */
        await sweep(leftOffscreen, rightOffscreen);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* PHASE 4: RIGHT → CENTER */
        await sweep(rightOffscreen, centerPos);

        /* PHASE 5 & 6: STOP AT CENTER & HOLD */
        intro.classList.add("center-stopped");
        await new Promise(resolve => setTimeout(resolve, CENTER_PAUSE));

        /* PHASE 7: CENTER → OUTWARD FULL NAME REVEAL */
        await expandCenterReveal();

        /* PHASE 8: EDITORIAL INVITATION APPEARS */
        await new Promise(resolve => setTimeout(resolve, 250));
        enterButton.classList.add("visible");
    }

    /* Handle Enter / Explore Invitation Click */
    let exiting = false;

    function handleExit(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (exiting) return;
        exiting = true;

        sessionStorage.setItem("hasSeenIntro", "true");
        intro.classList.add("exit");

        setTimeout(() => {
            intro.remove();
        }, 1250);
    }

    enterButton.addEventListener("click", handleExit);
    enterButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            handleExit(event);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startIntro, { once: true });
    } else {
        startIntro();
    }

})();