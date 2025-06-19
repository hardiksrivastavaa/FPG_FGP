const devModal = document.getElementById("developerModal");
const devCard = document.getElementById("developerCard");
const openDevModalBtn = document.getElementById("openDevModal");
const closeDevModalBtn = document.getElementById("closeDevModal");

openDevModalBtn.addEventListener("click", (e) => {
  devModal.classList.remove("hidden");
  gsap.fromTo(
    devCard,
    { opacity: 0, scale: 0.8, y: -50 },
    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
  );
});

closeDevModalBtn.addEventListener("click", () => {
  gsap.to(devCard, {
    opacity: 0,
    scale: 0.8,
    y: -50,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      devModal.classList.add("hidden");
    },
  });
});
