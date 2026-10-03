document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formStatus = document.getElementById("formStatus");
    const toTopButton = document.querySelector(".to-top");

    /* =====================================================
       EMAIL ADDRESS
    ====================================================== */

    const recipientEmail = "himaaneeshreddy1106@gmail.com";

    /* =====================================================
       HELPER — SHOW FORM STATUS
    ====================================================== */

    function showStatus(message, type = "normal") {
        if (!formStatus) return;
        formStatus.textContent = message;
        if (type === "error") {
            formStatus.style.color = "#ff6b76";
        } else if (type === "success") {
            formStatus.style.color = "#d9d5cf";
        } else {
            formStatus.style.color = "#8e8984";
        }
    }

    /* =====================================================
       HELPER — CLEAR FORM STATUS
    ====================================================== */

    function clearStatus() {
        if (!formStatus) return;
        formStatus.textContent = "";
    }

    /* =====================================================
       TO TOP BUTTON
    ====================================================== */

    if (toTopButton) {
        toTopButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* =====================================================
       EMPTY SOCIAL LINKS
    ====================================================== */

    const instagramLink = document.querySelector('[data-placeholder-link="instagram"]');
    const twitterLink = document.querySelector('[data-placeholder-link="twitter"]');
    const linkedinLink = document.querySelector('[data-placeholder-link="linkedin"]');

    if (instagramLink) {
        instagramLink.addEventListener("click", (event) => {
            if (!instagramLink.getAttribute("href")) {
                event.preventDefault();
                showStatus("Instagram link will be added soon.", "normal");
            }
        });
    }

    if (twitterLink) {
        twitterLink.addEventListener("click", (event) => {
            if (!twitterLink.getAttribute("href")) {
                event.preventDefault();
                showStatus("Twitter / X link will be added soon.", "normal");
            }
        });
    }

    if (linkedinLink) {
        linkedinLink.addEventListener("click", (event) => {
            if (linkedinLink.getAttribute("href") === "#") {
                event.preventDefault();
                showStatus("Add your LinkedIn profile URL in contact.html.", "normal");
            }
        });
    }

    /* =====================================================
       FORM VALIDATION
    ====================================================== */

    function validateForm() {
        clearStatus();

        const name = nameInput.value.trim();
        if (!name) {
            showStatus("Please enter your name.", "error");
            nameInput.focus();
            return false;
        }

        const email = emailInput.value.trim();
        if (!email) {
            showStatus("Please enter your email address.", "error");
            emailInput.focus();
            return false;
        }

        if (!emailInput.checkValidity()) {
            showStatus("Please enter a valid email address.", "error");
            emailInput.focus();
            return false;
        }

        const message = messageInput.value.trim();
        if (!message) {
            showStatus("Please enter your message.", "error");
            messageInput.focus();
            return false;
        }

        return true;
    }

    /* =====================================================
       FORM SUBMISSION
    ====================================================== */

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validateForm()) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            const subject = `Portfolio enquiry from ${name}`;
            const body = `Name: ${name}\n\nEmail: ${email}\n\nMessage:\n${message}`;

            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            showStatus("Opening your email client…", "success");

            window.location.href = mailtoLink;
        });
    }

    /* =====================================================
       INPUT — CLEAR ERROR WHEN TYPING
    ====================================================== */

    const formInputs = [nameInput, emailInput, messageInput];
    formInputs.forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => {
            clearStatus();
        });
    });

    /* =====================================================
       ESCAPE KEY — CLEAR STATUS
    ====================================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            clearStatus();
        }
    });

});
