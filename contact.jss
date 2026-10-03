document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formStatus = document.getElementById("formStatus");
    const toTopButton = document.querySelector(".to-top");
    const recipientEmail = "himaaneeshreddy1106@gmail.com";

    function showStatus(message, type = "normal") {
        if (!formStatus) return;
        formStatus.textContent = message;
        if (type === "error") formStatus.style.color = "#ff6b76";
        else if (type === "success") formStatus.style.color = "#d9d5cf";
        else formStatus.style.color = "#8e8984";
    }

    function clearStatus() {
        if (!formStatus) return;
        formStatus.textContent = "";
    }

    if (toTopButton) {
        toTopButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const instagramLink = document.querySelector('[data-placeholder-link="instagram"]');
    const twitterLink = document.querySelector('[data-placeholder-link="twitter"]');
    const linkedinLink = document.querySelector('[data-placeholder-link="linkedin"]');

    if (instagramLink) {
        instagramLink.addEventListener("click", (e) => {
            if (!instagramLink.getAttribute("href")) {
                e.preventDefault();
                showStatus("Instagram link will be added soon.", "normal");
            }
        });
    }

    if (twitterLink) {
        twitterLink.addEventListener("click", (e) => {
            if (!twitterLink.getAttribute("href")) {
                e.preventDefault();
                showStatus("Twitter / X link will be added soon.", "normal");
            }
        });
    }

    if (linkedinLink) {
        linkedinLink.addEventListener("click", (e) => {
            if (linkedinLink.getAttribute("href") === "#") {
                e.preventDefault();
                showStatus("Add your LinkedIn profile URL in contact.html.", "normal");
            }
        });
    }

    function validateForm() {
        clearStatus();
        if (!nameInput.value.trim()) {
            showStatus("Please enter your name.", "error");
            nameInput.focus();
            return false;
        }
        if (!emailInput.value.trim() || !emailInput.checkValidity()) {
            showStatus("Please enter a valid email address.", "error");
            emailInput.focus();
            return false;
        }
        if (!messageInput.value.trim()) {
            showStatus("Please enter your message.", "error");
            messageInput.focus();
            return false;
        }
        return true;
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!validateForm()) return;
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent("Portfolio enquiry from " + name)}&body=${encodeURIComponent("Name: " + name + "\n\nEmail: " + email + "\n\nMessage:\n" + message)}`;
            showStatus("Opening your email client…", "success");
            window.location.href = mailtoLink;
        });
    }

    [nameInput, emailInput, messageInput].forEach((input) => {
        if (input) input.addEventListener("input", clearStatus);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") clearStatus();
    });
});