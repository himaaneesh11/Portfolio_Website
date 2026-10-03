

/* =====================================================
   MARQUEE SPEED
   108px/sec
   Smooth RIGHT → LEFT movement
===================================================== */

const SPEED = 108;

let position = window.innerWidth;

let lastTime =
    performance.now();

let itemWidth =
    firstItem.getBoundingClientRect().width;


function updateMeasurements() {

    itemWidth =
        firstItem.getBoundingClientRect().width;

}


window.addEventListener(
    "resize",
    updateMeasurements
);


function animate(currentTime) {

    const deltaTime =
        Math.min((currentTime - lastTime) / 1000, 0.1);

    lastTime =
        currentTime;


    /* RIGHT → LEFT */

    position -=
        SPEED * deltaTime;


    /*
      When the first name has completely
      moved out of the screen, continue
      from the next repeated name.
    */

    while (
        itemWidth > 0 &&
        position <= -itemWidth
    ) {

        position += itemWidth;

    }


    track.style.transform =
        `translate3d(${position}px, 0, 0)`;


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
   L → R → L → R → CENTER
   ========================================================= */

(function () {

    const intro = document.getElementById("portfolioIntro");
    const light = document.getElementById("introLight");
    const nameMask = document.querySelector(".intro-name-mask");
    const enterButton = document.getElementById("introEnter");

    if (!intro || !light || !nameMask || !enterButton) {
        return;
    }


    /* -----------------------------------------------------
       SETTINGS
       ----------------------------------------------------- */

    const SWEEP_TIME = 1450;
    const CENTER_PAUSE = 700;

    const sequence = [
        {
            from: -15,
            to: 115
        },
        {
            from: 115,
            to: -15
        },
        {
            from: -15,
            to: 115
        }
    ];


    /* -----------------------------------------------------
       EASING
       ----------------------------------------------------- */

    function easeInOutCubic(t) {

        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

    }


    /* -----------------------------------------------------
       SET BEAM POSITION
       ----------------------------------------------------- */

    function setBeam(position) {

        light.style.opacity = "1";

        light.style.transform =
            `translateX(${position}vw) rotate(8deg)`;

        nameMask.style.setProperty(
            "--reveal-position",
            `${position}%`
        );

    }


    /* -----------------------------------------------------
       SWEEP
       ----------------------------------------------------- */

    function sweep(from, to) {

        return new Promise(resolve => {

            const start = performance.now();

            function frame(now) {

                const elapsed = now - start;

                const rawProgress =
                    Math.min(elapsed / SWEEP_TIME, 1);

                const progress =
                    easeInOutCubic(rawProgress);

                const position =
                    from + (to - from) * progress;

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


    /* -----------------------------------------------------
       START INTRO
       ----------------------------------------------------- */

    async function startIntro() {

        /*
           Small initial pause lets the black/red atmosphere
           establish before the first beam appears.
        */

        await new Promise(resolve =>
            setTimeout(resolve, 450)
        );


        /* -----------------------------------------------
           SWEEP 1
           LEFT → RIGHT
           ----------------------------------------------- */

        await sweep(-15, 115);


        await new Promise(resolve =>
            setTimeout(resolve, 180)
        );


        /* -----------------------------------------------
           SWEEP 2
           RIGHT → LEFT
           ----------------------------------------------- */

        await sweep(115, -15);


        await new Promise(resolve =>
            setTimeout(resolve, 180)
        );


        /* -----------------------------------------------
           SWEEP 3
           LEFT → RIGHT
           ----------------------------------------------- */

        await sweep(-15, 115);


        await new Promise(resolve =>
            setTimeout(resolve, 180)
        );


        /* -----------------------------------------------
           FINAL MOVE TO CENTER
           ----------------------------------------------- */

        await sweep(115, 50);


        /* -----------------------------------------------
           CENTER STOP
           ----------------------------------------------- */

        intro.classList.add("center-stopped");


        /*
           At the final center position, reveal the entire
           name smoothly instead of leaving it fragmented.
        */
        nameMask.style.setProperty(
            "--reveal-position",
            "50%"
        );


        await new Promise(resolve =>
            setTimeout(resolve, CENTER_PAUSE)
        );


        /* -----------------------------------------------
           SHOW ENTER BUTTON
           ----------------------------------------------- */

        enterButton.classList.add("visible");

    }


    /* -----------------------------------------------------
       CLICK → ENTER WEBSITE
       ----------------------------------------------------- */

    enterButton.addEventListener("click", function () {

        intro.classList.add("exit");

        /*
           Slight delay allows the cinematic fade to finish.
           The actual index page is already underneath.
        */

        setTimeout(() => {

            intro.remove();

        }, 1300);

    });


    /* -----------------------------------------------------
       START
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startIntro,
            { once: true }
        );

    } else {

        startIntro();

    }

})();