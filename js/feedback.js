// Modal for feedback form
const modal = document.getElementById("feedbackModal");
const modalContent = document.getElementById("feedbackCard");
const closeBtn = document.getElementById("closeModal");

// Show modal with animation when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
    modal.classList.remove("hidden");
    gsap.fromTo(
        modalContent,
        { opacity: 0, scale: 0.85, y: -30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
});

const hideModalAnimation = {
    opacity: 0,
    scale: 0.85,
    y: -30,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
        modal.classList.add("hidden");
    },
};

// Manual close with animation
closeBtn.addEventListener("click", () => {
    gsap.to(modalContent, hideModalAnimation);
});

// Close on clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        gsap.to(modalContent, hideModalAnimation);
    }
});

// Silent background form submission
const scriptURL =
    "https://script.google.com/macros/s/AKfycbwTjOig6S_11GS1_zcL0sMwuzxOBIlYgelsyd6vFgxIz3-e1SYctm75mk-DYwpKIQA_Xg/exec";
const form = document.forms["feedbackForm"];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    gsap.to(modalContent, hideModalAnimation);

    // Submit form silently
    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
    }).catch((error) => console.error("Error!", error.message));
});
