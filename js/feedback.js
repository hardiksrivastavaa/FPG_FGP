// Modal Elements
const modal = document.getElementById("feedbackModal");
const modalContent = document.getElementById("feedbackCard");
const closeBtn = document.getElementById("closeModal");
const thankYouMessage = document.getElementById("thankYouMessage");
const closeThankYouBtn = document.getElementById("closeThankYou");
const form = document.forms["feedbackForm"];
const hasSeenModal = sessionStorage.getItem("feedbackModalSeen");


// Show modal when page loads
window.addEventListener("DOMContentLoaded", () => {
    if (!hasSeenModal) {
        modal.classList.remove("hidden");
        gsap.fromTo(
            modalContent,
            { opacity: 0, scale: 0.85, y: -30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
        sessionStorage.setItem("feedbackModalSeen", "true");
    }
});

// Modal close animation
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

// Manual close button
closeBtn.addEventListener("click", () => {
    gsap.to(modalContent, hideModalAnimation);
});

// Close thank-you view and reset form
closeThankYouBtn.addEventListener("click", () => {
    gsap.to(thankYouMessage, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            modal.classList.add("hidden");
            form.reset();
            form.classList.remove("hidden");
            thankYouMessage.classList.add("hidden");
        },
    });
});

// Form submit with silent Google Script POST
const scriptURL = "https://script.google.com/macros/s/AKfycbwTjOig6S_11GS1_zcL0sMwuzxOBIlYgelsyd6vFgxIz3-e1SYctm75mk-DYwpKIQA_Xg/exec";

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hide form, show thank-you message
    form.classList.add("hidden");
    closeBtn.classList.add("hidden");
    thankYouMessage.classList.remove("hidden");

    // Animate thank you message in
    gsap.fromTo(
        thankYouMessage,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );

    // Submit silently
    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
    }).catch((error) => {
        console.error("Submission Error!", error.message);
    });
});


// Close modal on outside click
// window.addEventListener("click", (e) => {
//     if (e.target === modal) {
//         gsap.to(modalContent, hideModalAnimation);
//     }
// });