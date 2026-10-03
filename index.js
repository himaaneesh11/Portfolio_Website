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
   L → R → L → R → CENTER → OUTWARD REVEAL → ENTER
   ========================================================= */

(function () {

    const intro = document.getElementById("portfolioIntro");
    const light = document.getElementById("introLight");
    const nameMask = document.querySelector(".intro-name-mask");
    const enterButton = document.getElementById("introEnter");

    if (!intro || !light || !nameMask || !enterButton) {
        return;
    }

    /* If user has already seen the intro during this browser session, bypass instantly */
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

    function setBeam(position) {
        light.style.opacity = "1";
        light.style.transform = `translateX(${position}vw) rotate(8deg)`;
        nameMask.style.setProperty("--reveal-position", `${position}%`);
    }

    function sweep(from, to) {
        return new Promise(resolve => {
            const start = performance.now();

            function frame(now) {
                const elapsed = now - start;
                const rawProgress = Math.min(elapsed / SWEEP_TIME, 1);
                const progress = easeInOutCubic(rawProgress);
                const position = from + (to - from) * progress;

                setBeam(position);

                if (rawProgress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(frame);
        });
    }

    async function startIntro() {

        /* Initial pause for black/red atmosphere */
        await new Promise(resolve => setTimeout(resolve, 400));

        /* 1. LEFT → RIGHT */
        await sweep(-15, 115);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* 2. RIGHT → LEFT */
        await sweep(115, -15);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* 3. LEFT → RIGHT */
        await sweep(-15, 115);
        await new Promise(resolve => setTimeout(resolve, 150));

        /* 4. RIGHT → CENTER */
        await sweep(115, 50);

        /* 5. CENTER HOLD & OUTWARD REVEAL */
        intro.classList.add("center-stopped");
        nameMask.style.setProperty("--reveal-position", "50%");

        await new Promise(resolve => setTimeout(resolve, CENTER_PAUSE));

        /* 6. SHOW ENTER BUTTON */
        enterButton.classList.add("visible");
    }

    /* Handle Enter Button Click */
    let exiting = false;

    enterButton.addEventListener("click", function (event) {
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
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startIntro, { once: true });
    } else {
        startIntro();
    }

})();