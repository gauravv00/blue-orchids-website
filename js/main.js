/* =============================
   Scroll Reveal Animation
============================= */
window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

/* =============================
   Testimonial Slider (Homepage)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  let index = 0;
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");

  if (testimonials.length > 0) {
    setInterval(() => {
      testimonials[index].classList.remove("active");
      dots[index].classList.remove("active");

      index = (index + 1) % testimonials.length;

      testimonials[index].classList.add("active");
      dots[index].classList.add("active");
    }, 4000);
  }
});

/* =============================
   Mobile Menu Toggle
============================= */
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

/* =============================
   Accordion Fix
============================= */
document.querySelectorAll(".accordion-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    let panel = btn.nextElementSibling;

    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
});