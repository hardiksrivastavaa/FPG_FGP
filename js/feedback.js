// Modal Elements
const modal = document.getElementById("feedbackModal");
const modalContent = document.getElementById("feedbackCard");
const closeBtn = document.getElementById("closeModal");
const thankYouMessage = document.getElementById("thankYouMessage");
const closeThankYouBtn = document.getElementById("closeThankYou");
const feedbackForm = document.forms["feedbackForm"];
const hasSeenModal = sessionStorage.getItem("feedbackModalSeen");

const thankYouMessages = [
    {
        heading: "Thank you for your feedback! 🙌",
        body: "We sincerely appreciate your input. It helps us improve and serve you better. ✅",
        subText: "You may now continue using the FPG App. 🚀"
    },
    {
        heading: "Thanks for taking the time! 📝",
        body: "Your feedback has been recorded successfully. We're grateful for your support. 🤝",
        subText: "Feel free to continue exploring FPG. 🌐"
    },
    {
        heading: "Feedback submitted! ✔️",
        body: "We value your thoughts and are always working to improve. Thanks again!",
        subText: "You may now proceed with the FPG App. 💡"
    },
    {
        heading: "Thanks for helping us grow! 🌱",
        body: "Every bit of feedback matters. We're committed to making things better for you.",
        subText: "FPG is ready when you are. 🚀"
    },
    {
        heading: "Much appreciated! 🙏",
        body: "Your opinion has been noted. Thanks for being a part of this journey!",
        subText: "Go ahead and continue using the FPG App. 📱"
    }
];

// Function to apply a random message
const applyRandomThankYouMessage = () => {
    const randomMessage = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];

    document.getElementById("heading").textContent = randomMessage.heading;
    document.getElementById("body").textContent = randomMessage.body;
    document.getElementById("subText").textContent = randomMessage.subText;
}


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
            feedbackForm.reset();
            feedbackForm.classList.remove("hidden");
            thankYouMessage.classList.add("hidden");
        },
    });
});

// Form submit with silent Google Script POST
const scriptURL = "https://script.google.com/macros/s/AKfycbwTjOig6S_11GS1_zcL0sMwuzxOBIlYgelsyd6vFgxIz3-e1SYctm75mk-DYwpKIQA_Xg/exec";

feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    applyRandomThankYouMessage();

    // Hide form, show thank-you message
    feedbackForm.classList.add("hidden");
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
        body: new FormData(feedbackForm),
    }).catch((error) => {
        console.error("Submission Error!", error.message);
    });
});

