(() => {
  "use strict";

  const config = window.DAR_LELLA_CONFIG || {};
  const email = config.email || "bonjour@darlella.tn";
  const whatsapp = String(config.whatsapp || "").replace(/\D/g, "");
  const hasWhatsApp = whatsapp.length >= 8;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Smooth scroll */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({
      autoRaf: true,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: { offset: -84 }
    });
  }

  /* Coordonnées */
  $$("[data-contact-email]").forEach((link) => {
    link.href = `mailto:${email}`;
    if (link.textContent.includes("@")) link.textContent = email;
  });

  $$('a[href*="instagram.com"]').forEach((link) => {
    if (config.instagram) link.href = config.instagram;
    else link.closest("div")?.contains(link) && link.remove();
  });

  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Hero cinematique */
  const hero = $(".hero");
  const heroMedia = $(".hero-media");
  const heroContent = $(".hero-content");
  const heroSlides = $$(".hero-slide");
  let activeSlide = 0;
  let heroVisible = true;

  if (heroSlides.length > 1 && !reduceMotion) {
    setInterval(() => {
      if (document.hidden || !heroVisible) return;
      heroSlides[activeSlide].classList.remove("is-active");
      activeSlide = (activeSlide + 1) % heroSlides.length;
      heroSlides[activeSlide].classList.add("is-active");
    }, 6500);
  }

  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    ).observe(hero);
  }

  if (hero && !reduceMotion) {
    let ticking = false;
    let pointerX = 0;
    let pointerY = 0;

    const parallax = () => {
      ticking = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      const driftX = pointerX * 16;
      const driftY = pointerY * 12;
      if (heroMedia) {
        heroMedia.style.transform = `translate3d(${driftX}px, ${y * 0.16 + driftY}px, 0)`;
      }
      if (heroContent) {
        const fade = Math.min(1, Math.max(0, (y - window.innerHeight * 0.15) / (window.innerHeight * 0.7)));
        heroContent.style.opacity = String(1 - fade);
        heroContent.style.transform = `translate3d(${-driftX * 0.32}px, ${-driftY * 0.32}px, 0)`;
      }
    };

    const requestParallax = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(parallax);
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    hero.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      requestParallax();
    });
    hero.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      requestParallax();
    });
  }

  /* Marquee réactif au scroll */
  const marqueeTrack = $(".marquee-track");
  if (marqueeTrack && !reduceMotion) {
    marqueeTrack.style.animation = "none";
    let offset = 0;
    let boost = 0;
    let lastScroll = window.scrollY;

    const moveMarquee = () => {
      const half = marqueeTrack.scrollWidth / 2;
      offset += 0.55 + Math.abs(boost) * 0.14;
      if (half > 0 && offset >= half) offset -= half;
      const skew = Math.max(-3.5, Math.min(3.5, boost * 0.12));
      marqueeTrack.style.transform = `translate3d(${-offset}px, 0, 0) skewX(${skew}deg)`;
      boost *= 0.9;
      requestAnimationFrame(moveMarquee);
    };

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        boost = Math.max(-26, Math.min(26, boost + (y - lastScroll) * 0.06));
        lastScroll = y;
      },
      { passive: true }
    );

    moveMarquee();
  }

  /* Curseur */
  const cursor = $(".cursor-ring");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursor && finePointer && !reduceMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let cursorVisible = false;

    const renderCursor = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };

    document.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!cursorVisible) {
        cursorVisible = true;
        cursor.classList.add("is-on");
        renderCursor();
      }
    });

    document.addEventListener("mouseover", (event) => {
      cursor.classList.toggle(
        "is-link",
        Boolean(event.target.closest("a, button, summary, input, select, textarea"))
      );
    });

    document.addEventListener("mouseleave", () => {
      cursorVisible = false;
      cursor.classList.remove("is-on");
    });
  }

  /* Header */
  const header = $("#header");
  const floatingBook = $(".floating-book");
  const bookingSection = $("#reserver");
  const progressBar = $(".scroll-progress");
  let bookingInView = false;

  const updateHeader = () => {
    const nearFooter = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 520;
    header.classList.toggle("scrolled", window.scrollY > 60);
    floatingBook?.classList.toggle(
      "visible",
      window.scrollY > window.innerHeight * 0.85 && !nearFooter && !bookingInView
    );
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    }
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);

  if (bookingSection && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        bookingInView = entry.isIntersecting;
        updateHeader();
      },
      { threshold: 0.18 }
    ).observe(bookingSection);
  }

  /* Navigation mobile */
  const menuToggle = $("#menuToggle");
  const nav = $("#nav");

  const closeMenu = () => {
    document.body.classList.remove("nav-open", "locked");
    lenis?.start();
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    document.body.classList.toggle("locked", isOpen);
    if (isOpen) lenis?.stop();
    else lenis?.start();
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) closeMenu();
  });

  /* Dates */
  const toISO = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  $$('input[type="date"]').forEach((input) => {
    input.min = toISO(today);
    if (input.name === "departure") input.min = toISO(tomorrow);
  });

  $$("form").forEach((form) => {
    const arrival = form.elements.arrival;
    const departure = form.elements.departure;
    if (!arrival || !departure) return;

    arrival.addEventListener("change", () => {
      if (!arrival.value) return;
      const next = new Date(`${arrival.value}T12:00:00`);
      next.setDate(next.getDate() + 1);
      departure.min = toISO(next);
      if (departure.value && departure.value < toISO(next)) departure.value = "";
      departure.setCustomValidity("");
    });

    departure.addEventListener("change", () => {
      if (arrival.value && departure.value && departure.value <= arrival.value) {
        departure.setCustomValidity("La date de départ doit être après la date d'arrivée.");
      } else {
        departure.setCustomValidity("");
      }
    });
  });

  /* Demandes de séjour */
  const formatDate = (value) => {
    if (!value) return "à préciser";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(`${value}T12:00:00`));
  };

  const sendRequest = (form) => {
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const arrival = formatDate(data.get("arrival"));
    const departure = formatDate(data.get("departure"));
    const guests = data.get("guests") || "à préciser";
    const name = (data.get("name") || "").trim();
    const visitorEmail = (data.get("email") || "").trim();
    const message = (data.get("message") || "").trim();

    let body = "Bonjour Dar Lella,\n\nJe souhaite connaître vos disponibilités.\n\n";
    body += `Arrivée : ${arrival}\nDépart : ${departure}\nVoyageurs : ${guests}\n`;
    if (name) body += `Nom : ${name}\n`;
    if (visitorEmail) body += `Email : ${visitorEmail}\n`;
    if (message) body += `\nMessage : ${message}\n`;
    body += "\nMerci et à bientôt !";

    const subject = "Demande de séjour — Dar Lella";
    const note = $("[data-form-note]", form);

    if (hasWhatsApp) {
      const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(body)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      if (note) note.textContent = "WhatsApp s'ouvre dans un nouvel onglet. Il ne vous reste qu'à envoyer le message.";
      return;
    }

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    if (note) note.textContent = `Votre logiciel de messagerie s'ouvre. Si rien ne se passe, écrivez à ${email}.`;
  };

  $$("#quickForm, #bookingForm").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendRequest(form);
    });
    form.addEventListener("input", () => {
      const note = $("[data-form-note]", form);
      if (note) note.textContent = "";
    });
  });

  const legalNote = $(".form-legal");
  if (legalNote) {
    legalNote.textContent = hasWhatsApp
      ? "Aucun paiement ne vous sera demandé sur ce site. Votre demande sera transmise par email ou WhatsApp."
      : "Aucun paiement ne vous sera demandé sur ce site. Votre demande sera transmise par email.";
  }

  /* Apparitions au scroll */
  const revealItems = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  /* Galerie */
  const galleryItems = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lbImage");
  const lightboxCaption = $("#lbCaption");
  let currentImage = 0;
  let lastFocused = null;

  const showImage = (index) => {
    currentImage = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentImage];
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.dataset.caption || "";
    lightboxCaption.textContent = item.dataset.caption || "";
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    lenis?.stop();
    $("#lbClose").focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
    lenis?.start();
    lastFocused?.focus();
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  $("#lbClose")?.addEventListener("click", closeLightbox);
  $("#lbPrev")?.addEventListener("click", () => showImage(currentImage - 1));
  $("#lbNext")?.addEventListener("click", () => showImage(currentImage + 1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentImage - 1);
    if (event.key === "ArrowRight") showImage(currentImage + 1);
  });
})();
