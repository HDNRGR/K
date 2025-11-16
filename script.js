document.addEventListener("DOMContentLoaded", () => {

  // ----- Intersection Observer for scroll animations -----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.2 });

  // Observe all fade elements
  document.querySelectorAll('.fade-left, .fade-right, .fade-up, .experience')
    .forEach(el => observer.observe(el));

  // ----- Portfolio View Gallery toggle -----
  const btn = document.getElementById("viewGalleryBtn");
  const extraGallery = document.querySelector(".extra-gallery");

  if (btn && extraGallery) {
    btn.addEventListener("click", () => {
      extraGallery.classList.toggle("show");

      // Change button text
      btn.textContent = extraGallery.classList.contains("show") 
        ? "Show Less" 
        : "View Gallery";
    });
  }

  // ----- Hero button scroll -----
  const hero = document.querySelector(".hero");
  const about = document.querySelector("#astage6");
  const vpBtn = document.querySelector(".hero .btn");

  if (vpBtn && hero && about) {
    vpBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Fade hero out
      hero.classList.add("fade-out");

      setTimeout(() => {
        window.scrollTo(0, about.offsetTop);
        about.classList.add("fade-in");

        setTimeout(() => {
          hero.classList.remove("fade-out");
          hero.classList.add("fade-in");

          setTimeout(() => hero.classList.remove("fade-in"), 900);
        }, 1200);
      }, 600);
    });
  }

  // ----- Scroll to top when clicking logo -----
  const logo = document.querySelector(".navbar .logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ----- Fullscreen image viewer with dimmed background -----
  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0, 0, 0, 0.85)";
      overlay.style.backdropFilter = "blur(15px)";
      overlay.style.webkitBackdropFilter = "blur(15px)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.cursor = "zoom-out";
      overlay.style.zIndex = 2000;

      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.style.width = "auto";
      fullImg.style.height = "auto";
      fullImg.style.maxWidth = "95vw";
      fullImg.style.maxHeight = "95vh";
      fullImg.style.borderRadius = "10px";
      fullImg.style.boxShadow = "0 0 30px rgba(0,0,0,0.5)";
      fullImg.style.transition = "transform 0.3s ease";
      fullImg.style.transform = "scale(0.8)";

      setTimeout(() => fullImg.style.transform = "scale(1)", 10);

      overlay.appendChild(fullImg);

      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  // ----- Info-box click animation -----
  document.querySelectorAll('.info-box').forEach(box => {
    box.addEventListener('click', () => box.classList.toggle('active'));
  });

  // ----- Image reveal buttons -----
  const placeholders = document.querySelectorAll(".image-placeholder");

  placeholders.forEach(placeholder => {
    const btn = placeholder.querySelector(".reveal-btn");
    const img = placeholder.querySelector(".reveal-image");

    if (btn && img) {
      btn.addEventListener("click", () => {
        img.classList.add("active");
        placeholder.classList.add("revealed");
      });
    }
  });

  document.querySelectorAll('.reveal-btn').forEach(button => {
    button.addEventListener('click', () => {
      const container = button.parentElement;
      const img = container.querySelector('.reveal-image');
      const durationBar = container.querySelector('.duration-bar');
      const stage = button.dataset.stage;

      // Hide the button
      button.style.display = 'none';

      // Show and fade in the image
      img.classList.remove('hidden');
      img.classList.add('visible');

      // Create audio element and load the file
      const audio = new Audio(`Audio${stage}.mp3`);

      // When metadata loaded, we know duration
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration; // seconds

        // Animate the duration bar from 0% to 100% width over audio duration
        durationBar.style.transition = `width ${duration}s linear`;
        durationBar.style.width = '100%';

        // Play the audio
        audio.play().catch(e => {
          console.warn("Audio play was prevented or failed:", e);
        });
      });

      // Reset bar width in case button clicked multiple times
      durationBar.style.width = '0%';
    });
  });

  // --- Stage 6 Photo Stack Viewer ---
  const stackImages = [
    "Comic0.png",
    "Comic1.png",
    "Comic2.png",
    "Comic3.png",
    "Comic4.png",
    "Comic5.png"
  ];

  let currentIndex = 0;
  let hasMovedForward = false; // Track if user ever went past Comic0

  const stackImage = document.getElementById("stackImage");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  // Fade transition function
  function updateStackImage() {
    stackImage.classList.remove("visible");   // fade out

    setTimeout(() => {
      stackImage.src = stackImages[currentIndex];
      stackImage.classList.add("visible");    // fade in
    }, 200); // must match CSS fade-out duration
  }

  // Messages for right clicks (index matches stackImages)
  const rightClickMessages = [
    "",  // No message for Comic0
    "Okay okay it's a start, let's add some shading!",
    "Nice love! Now lets add a background.",
    "Getting there, needs some colour!",
    "Perfect just need to add a title!",
    "Might just make this my wallpaper."
  ];

  // Left arrow logic (no message)
  leftArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + stackImages.length) % stackImages.length;
    updateStackImage();
  });

  // Right arrow logic + message logic
  rightArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % stackImages.length;
    updateStackImage();

    if (currentIndex !== 0) {
      hasMovedForward = true;
    }

    // Show message only if currentIndex > 0 and user has moved forward
    if (currentIndex !== 0 && hasMovedForward) {
      showTopPopup(rightClickMessages[currentIndex]);
    }
  });

  // Load the very first image on page load
  window.addEventListener("load", () => {
    stackImage.src = stackImages[0];
    stackImage.classList.add("visible");  // show instantly on load
  });

  // Click to Expand Stack Image
  stackImage.addEventListener("click", () => {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.85)";
    overlay.style.backdropFilter = "blur(15px)";
    overlay.style.webkitBackdropFilter = "blur(15px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.cursor = "zoom-out";
    overlay.style.zIndex = 9999;

    const fullImg = document.createElement("img");
    fullImg.src = stackImage.src;
    fullImg.style.maxWidth = "95vw";
    fullImg.style.maxHeight = "95vh";
    fullImg.style.borderRadius = "14px";
    fullImg.style.boxShadow = "0 0 30px rgba(0,0,0,0.5)";
    fullImg.style.transform = "scale(0.8)";
    fullImg.style.transition = "transform 0.3s ease";

    // Smooth scale-in animation
    setTimeout(() => {
      fullImg.style.transform = "scale(1)";
    }, 10);

    overlay.appendChild(fullImg);

    // Click anywhere to close
    overlay.addEventListener("click", () => overlay.remove());

    document.body.appendChild(overlay);
  });

  // Popup function
  function showTopPopup(message, duration = 3000) {
    // Create popup div
    const popup = document.createElement('div');
    popup.classList.add('top-popup');
    popup.textContent = message;

    // Add to body
    document.body.appendChild(popup);

    // Show popup (slide down + fade in)
    setTimeout(() => popup.classList.add('show'), 50);

    // Hide popup after duration (slide up + fade out)
    setTimeout(() => {
      popup.classList.remove('show');
      // Remove from DOM after transition
      setTimeout(() => popup.remove(), 500);
    }, duration);
  }

  // Intersection Observer for stage6 popups
  const stage6Section = document.getElementById("stage6");

if (stage6Section) {
  let hasShownPopups = false;  // Flag to track if popups were shown

  const stage6Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasShownPopups) {
        hasShownPopups = true;  // Mark as shown to prevent repeats

        showTopPopup("Thought we should add a background for our flower :)", 3000);

        // Show second popup after the first one disappears (duration + buffer)
        setTimeout(() => {
          showTopPopup("Pro tip you can tap the image to expand it.", 3000);
        }, 3200); // 3000ms + 200ms buffer
        setTimeout(() => {
          showTopPopup("We'll start with an outline, click the right arrow!", 3000);
        }, 6400); // 3000ms + 200ms buffer
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% visible

  stage6Observer.observe(stage6Section);
}


});


