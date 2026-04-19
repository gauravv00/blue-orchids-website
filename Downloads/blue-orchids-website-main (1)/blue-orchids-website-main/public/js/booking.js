/**
 * Booking Form + Confetti — Client-side logic
 * 
 * Flow:
 *   1. User fills booking form → POST /api/bookings
 *   2. On success → Confetti animation + "Appointment Booked" popup
 */
(function () {
  'use strict';

  const API_URL = 'https://blue-orchids-website-production.up.railway.app/api/bookings';

  // ── Modal Logic ──────────────────────────────────────────────
  const modal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('booking-modal-close');
  const modalTitle = document.getElementById('modal-title');

  // Steps
  const stepBooking = document.getElementById('step-booking');

  // Success popup elements
  const successOverlay = document.getElementById('success-popup-overlay');
  const successDetails = document.getElementById('success-popup-details');
  const successBookingId = document.getElementById('success-booking-id');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Confetti canvas
  const confettiCanvas = document.getElementById('confetti-canvas');

  // Store last booking data
  let lastBookingData = null;
  let lastBookingId = null;

  // ── Open/Close Modal ─────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-booking-trigger]');
    if (trigger && modal) {
      e.preventDefault();
      openModal();
    }
  });

  function openModal() {
    if (!modal) return;
    showStep('booking');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('#step-booking input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showStep(step) {
    if (stepBooking) stepBooking.classList.remove('active');

    if (step === 'booking') {
      if (stepBooking) stepBooking.classList.add('active');
      if (modalTitle) modalTitle.innerHTML = 'Book <em>Appointment</em>';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  // ── Form Handling ────────────────────────────────────────────
  document.querySelectorAll('.booking-form').forEach(form => {
    setupForm(form);
  });

  function setupForm(form) {
    const submitBtn = form.querySelector('.booking-submit-btn');
    const resultBox = form.querySelector('.booking-result');

    // Set min date to today
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('field-error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!validateField(input)) valid = false;
      });

      const emailInput = form.querySelector('input[name="email"]');
      if (emailInput && !validateEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email');
        valid = false;
      }

      if (!valid) return;

      // Collect data
      const data = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: form.querySelector('[name="phone"]').value.trim(),
        date: form.querySelector('[name="date"]').value,
        time: form.querySelector('[name="time"]').value,
        guests: parseInt(form.querySelector('[name="guests"]').value) || 1,
        special_requests: form.querySelector('[name="special_requests"]')?.value.trim() || ''
      };

      // Submit
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Booking...';

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const json = await res.json();

        if (res.ok && json.success) {
          showResult(resultBox, 'success',
            `✅ ${json.message}<br><small>Booking #${json.data.id} · ${formatDate(json.data.date)} at ${json.data.time}</small>`
          );

          // Store booking data
          lastBookingData = { ...data, id: json.data.id };
          lastBookingId = json.data.id;

          const isInsideModal = form.closest('#step-booking');

          setTimeout(() => {
            if (isInsideModal) {
              closeModal();
            }
            form.reset();
            showSuccessPopup();
            launchConfetti();
          }, 1500);

        } else {
          const errMsg = json.errors
            ? json.errors.map(e => e.message).join('<br>')
            : json.message || 'Something went wrong';
          showResult(resultBox, 'error', '❌ ' + errMsg);
        }
      } catch (err) {
        showResult(resultBox, 'error', '❌ Network error. Please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Book Appointment →';
      }
    });
  }

  // ── Success Popup ───────────────────────────────────────────
  function showSuccessPopup() {
    if (!successOverlay) return;

    if (successDetails && lastBookingData) {
      successDetails.textContent = `${formatDate(lastBookingData.date)} at ${lastBookingData.time}`;
    }
    if (successBookingId && lastBookingId) {
      successBookingId.textContent = `Booking #${lastBookingId}`;
    }

    successOverlay.classList.add('active');
  }

  function hideSuccessPopup() {
    if (!successOverlay) return;
    successOverlay.classList.remove('active');
    // Stop confetti
    stopConfetti();
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', hideSuccessPopup);
  }
  if (successOverlay) {
    successOverlay.addEventListener('click', (e) => {
      if (e.target === successOverlay) hideSuccessPopup();
    });
  }

  // ── Confetti Animation ──────────────────────────────────────
  let confettiAnimId = null;
  let confettiParticles = [];

  function launchConfetti() {
    if (!confettiCanvas) return;

    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = 'block';

    const colors = [
      '#c9a96e', '#e4ca95', '#FFD700', '#FF6347', '#00CED1',
      '#FF69B4', '#7B68EE', '#32CD32', '#FF4500', '#1E90FF',
      '#FFA500', '#9370DB', '#00FA9A', '#DC143C', '#4169E1'
    ];

    confettiParticles = [];

    // Create particles in multiple bursts
    for (let i = 0; i < 200; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        decay: Math.random() * 0.005 + 0.002
      });
    }

    function animate() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      let alive = false;

      confettiParticles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (alive) {
        confettiAnimId = requestAnimationFrame(animate);
      } else {
        stopConfetti();
      }
    }

    animate();

    // Second burst after 500ms
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        confettiParticles.push({
          x: Math.random() * confettiCanvas.width,
          y: -20,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 2 + 1,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          opacity: 1,
          decay: Math.random() * 0.004 + 0.002
        });
      }
    }, 500);
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    if (confettiCanvas) {
      const ctx = confettiCanvas.getContext('2d');
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCanvas.style.display = 'none';
    }
    confettiParticles = [];
  }

  // Handle window resize for confetti
  window.addEventListener('resize', () => {
    if (confettiCanvas && confettiCanvas.style.display !== 'none') {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  // ── Helpers ──────────────────────────────────────────────────
  function validateField(input) {
    const value = input.value.trim();
    if (input.hasAttribute('required') && !value) {
      showFieldError(input, 'This field is required');
      return false;
    }
    if (input.name === 'email' && value && !validateEmail(value)) {
      showFieldError(input, 'Please enter a valid email');
      return false;
    }
    clearFieldError(input);
    return true;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(input, msg) {
    input.classList.add('field-error');
    let errEl = input.parentElement.querySelector('.field-error-msg');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error-msg';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearFieldError(input) {
    input.classList.remove('field-error');
    const errEl = input.parentElement.querySelector('.field-error-msg');
    if (errEl) errEl.remove();
  }

  function showResult(box, type, html) {
    if (!box) return;
    box.className = 'booking-result ' + type;
    box.innerHTML = html;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (type === 'success') {
      setTimeout(() => { box.style.display = 'none'; }, 8000);
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
})();
