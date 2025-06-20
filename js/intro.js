const introModal = document.getElementById("IntroModal");
const introCard = document.getElementById("introCard");
const closeIntroModalBtn = document.getElementById("closeIntroModal");

// Show modal when page loads
window.addEventListener("DOMContentLoaded", () => {
    const hasSession = sessionStorage.getItem("hasSeenIntro");
    if (!hasSession) {
        introModal.classList.remove("hidden");
        gsap.fromTo(
            introCard,
            { opacity: 0, scale: 0.85, y: -30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
        sessionStorage.setItem("hasSeenIntro", "true");
    }
});

// Manual close button
closeIntroModalBtn.addEventListener("click", () => {
    gsap.to(introCard, {
        opacity: 0,
        scale: 0.85,
        y: -30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            introModal.classList.add("hidden");
        },
    });
});
