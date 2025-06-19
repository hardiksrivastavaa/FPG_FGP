const feedbackModal = document.getElementById("feedbackModal");
const feedbackCard = document.getElementById("feedbackCard");
const openFeedbackModalBtn = document.getElementById("openFeedbackModal");
const closeFeedbackModalBtn = document.getElementById("closeFeedbackModalBtn");
const feedbackFormSection = document.getElementById("feedbackFormSection");
const thankYouMessageSection = document.getElementById("thankYouMessage");
const closeThankYouBtn = document.getElementById("closeThankYou");
const feedbackForm = document.forms["feedbackForm"];

openFeedbackModalBtn.addEventListener("click", (e) => {
    feedbackModal.classList.remove("hidden");
    gsap.fromTo(
        feedbackCard,
        { opacity: 0, scale: 0.8, y: -50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
});

// Modal close animation
const hideModalAnimation = {
    opacity: 0,
    scale: 0.85,
    y: -30,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
        feedbackModal.classList.add("hidden");
    },
};

// Manual close button
closeFeedbackModalBtn.addEventListener("click", () => {
    gsap.to(feedbackCard, hideModalAnimation);
});

// Function to apply a random message
const applyRandomThankYouMessage = () => {
    const randomMessage =
        thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
    document.getElementById("heading").textContent = randomMessage.heading;
    document.getElementById("body").textContent = randomMessage.body;
    document.getElementById("subText").textContent = randomMessage.subText;
};

// Close thank-you view and reset form
closeThankYouBtn.addEventListener("click", () => {
    gsap.to(thankYouMessageSection, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            feedbackForm.reset();
            feedbackModal.classList.add("hidden");
            closeFeedbackModalBtn.classList.remove("hidden");
            feedbackFormSection.classList.remove("hidden");
            thankYouMessageSection.classList.add("hidden");
        },
    });
});

// Form submit with silent Google Script POST
feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyRandomThankYouMessage();

    // Hide form, show thank-you message
    feedbackFormSection.classList.add("hidden");
    closeFeedbackModalBtn.classList.add("hidden");
    thankYouMessageSection.classList.remove("hidden");

    // Animate thank you message in
    gsap.fromTo(
        thankYouMessageSection,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );

    let formData = {
        name: document.getElementById("feedbackName").value.trim(),
        email: document.getElementById("feedbackEmail").value.trim(),
        message: document.getElementById("feedbackMessage").value.trim(),
        institute: "FGP",
    };

    const url =
        "https://script.google.com/macros/s/AKfycbypEOWF8Drt-zS2HlWdttUnXx8WNpfo0lCCrLsyG43vhHJi_Sl4HCukFfuwA1_GtvmUCw/exec";

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    }).catch((error) => console.error("Error:", error));
});
