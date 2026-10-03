/* =========================================================
   ABOUT PAGE JS — INTERACTION & REVEAL SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Page Loader Fade
    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                pageLoader.style.opacity = "0";
                pageLoader.style.pointerEvents = "none";
            }, 600);
        });
    }

    // 2. Smooth Scroll to Approach Section
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

    // 3. Subtle Hero Portrait Micro-Parallax (3px to 6px max)
    const heroSection = document.getElementById("hero");
    const heroPortrait = document.getElementById("heroPortrait");
    const portraitStage = document.getElementById("portraitStage");

    if (heroSection && heroPortrait && window.innerWidth > 900) {
        let reqId = null;

        heroSection.addEventListener("mousemove", (e) => {
            if (reqId) cancelAnimationFrame(reqId);

            reqId = requestAnimationFrame(() => {
                const rect = heroSection.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
                const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

                // Max 4px movement on portrait image
                const moveX = mouseX * 8;
                const moveY = mouseY * 8;

                heroPortrait.style.transform = `scale(1.02) translate(${moveX}px, ${moveY}px)`;
            });
        });

        heroSection.addEventListener("mouseleave", () => {
            if (reqId) cancelAnimationFrame(reqId);
            heroPortrait.style.transform = "scale(1) translate(0px, 0px)";
        });
    }

    // 4. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const revealElements = document.querySelectorAll(".approach-card, .exploring-item, .cta-container");

    revealElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    // 5. Dynamic Footer Year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});