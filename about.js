/* =========================================================
   ABOUT PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE ENTRY
    ===================================================== */

    const transition =
        document.querySelector(".page-transition");


    requestAnimationFrame(() => {

        setTimeout(() => {

            transition?.classList.add("is-loaded");

        }, 100);

    });


    /* =====================================================
       PAGE EXIT
    ===================================================== */

    const transitionLinks =
        document.querySelectorAll(".transition-link");


    transitionLinks.forEach(link => {

        link.addEventListener("click", event => {

            const target =
                link.getAttribute("href");

            if (
                !target ||
                target.startsWith("#") ||
                link.target === "_blank"
            ) {
                return;
            }


            event.preventDefault();


            if (transition) {
                transition.classList.remove("is-loaded");
                transition.classList.add("is-entering");
            }


            setTimeout(() => {

                window.location.href = target;

            }, 850);

        });

    });


    /* =====================================================
       REVEAL ANIMATIONS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =====================================================
       SECTION NAVIGATION & SCROLL SPY
    ===================================================== */

    const sections = Array.from(document.querySelectorAll(".about-section"));
    const sectionLinks = document.querySelectorAll(".section-link");
    let isClickScrolling = false;

    const sectionNames = {
        "intro": "01 / INTRO",
        "who-i-am": "02 / WHO I AM",
        "what-i-build": "03 / WHAT I BUILD",
        "how-i-think": "04 / HOW I THINK",
        "current-focus": "05 / CURRENT FOCUS",
        "journey": "06 / MY JOURNEY",
        "whats-next": "07 / WHAT'S NEXT"
    };

    const headerIndex = document.querySelector(".header-index");

    /* Section enter accent line observer */
    const sectionEnterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("section-entered");
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach(section => {
        sectionEnterObserver.observe(section);
    });

    function updateActiveSection() {
        if (isClickScrolling) return;

        const scrollPosition = window.scrollY + 140;
        let currentSectionId = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        if (!currentSectionId && sections.length > 0) {
            if (window.scrollY < 100) {
                currentSectionId = sections[0].id;
            } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                currentSectionId = sections[sections.length - 1].id;
            }
        }

        if (currentSectionId) {
            sectionLinks.forEach(link => {
                const targetHash = link.getAttribute("href");
                if (targetHash === `#${currentSectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            if (headerIndex && sectionNames[currentSectionId] && headerIndex.textContent !== sectionNames[currentSectionId]) {
                headerIndex.textContent = sectionNames[currentSectionId];
                headerIndex.style.animation = 'none';
                void headerIndex.offsetWidth;
                headerIndex.style.animation = 'headerIndexPulse 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        }
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();

    /* =====================================================
       SMOOTH SECTION NAVIGATION WITH HEADER OFFSET
    ===================================================== */

    sectionLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (!target) return;

            sectionLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            isClickScrolling = true;
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            setTimeout(() => {
                isClickScrolling = false;
                updateActiveSection();
            }, 800);
        });
    });


    /* =====================================================
       IMAGE PARALLAX & MOUSE TILT
    ===================================================== */

    const heroImage =
        document.querySelector(".hero-image");

    const hero =
        document.querySelector(".hero-section");

    let mouseX = 0;
    let mouseY = 0;

    function updateHeroTransform() {
        if (!heroImage) return;
        const scroll = window.scrollY;
        const scrollOffset = scroll < window.innerHeight ? scroll * 0.08 : 0;
        heroImage.style.transform = `translate(${mouseX * 10}px, ${scrollOffset + mouseY * 8}px)`;
    }

    if (heroImage) {
        window.addEventListener(
            "scroll",
            updateHeroTransform,
            { passive: true }
        );
    }

    if (
        hero &&
        window.matchMedia("(pointer:fine)").matches
    ) {
        hero.addEventListener("mousemove", event => {
            mouseX = (event.clientX / window.innerWidth - 0.5);
            mouseY = (event.clientY / window.innerHeight - 0.5);
            updateHeroTransform();
        });
    }

});