function getNumber(value, fallback = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}

function splitText(targetElement, type = "words") {
  const split = new SplitText(targetElement, {
    type: "chars,words,lines",
    mask: "words", // <-- this can be "lines" or "words" or "chars"
  });

  const parts = type === "words" ? split.words : split.chars;

  if (!parts.length) {
    console.warn(`No ${type} found in:`, targetElement);
    return null;
  }

  return parts;
}

document.addEventListener("DOMContentLoaded", function () {
  // Define breakpoints for different screen sizes
  const breakpoints = {
    mobilePortrait: 479,
    mobileLandscape: 767,
    tablet: 991,
  };

  // Loop through elements that have the data-animation attribute
  document.querySelectorAll("[data-animation]").forEach(function (element) {
    let $this = element;
    let windowWidth = window.innerWidth;
    let disableOn = $this.getAttribute("disable-on");

 // Skip animation if disabled on this viewport
 if (disableOn) {
  if (
    (disableOn.includes("mobilePortrait") && windowWidth <= breakpoints.mobilePortrait) ||
    (disableOn.includes("mobileLandscape") && windowWidth <= breakpoints.mobileLandscape) ||
    (disableOn.includes("tablet") && windowWidth <= breakpoints.tablet)
  ) {
    return; // skip this element
  }
}


const duration = parseFloat($this.getAttribute("data-duration")) || 1;
const ease = $this.dataset.ease || "power1.out";
const stagger = parseFloat($this.getAttribute("data-stagger")) || 0.1;
const start = $this.getAttribute("data-start") || "top 90%";
const end = $this.getAttribute("data-end") || "bottom top";
const scrub = $this.getAttribute("data-scrub") === "true";
const markers = $this.getAttribute("data-debug") === "true";
const animationName = $this.getAttribute("data-animation");
const animationType = $this.getAttribute("data-animation-type");
const toggleActions = $this.getAttribute("data-toggle-actions") || "play none none reverse";



  // Set up GSAP params
  const params = {
    duration: duration,
    ease: ease,
    stagger: stagger,
    scrollTrigger: {
      trigger: $this,
      start: start,
      end: end,
      scrub: scrub,
      markers: markers,
      toggleActions: toggleActions,
    },
  };

  // Run animation if valid
  if (animationName && animationType) {
    const animationExists = 
    animations[animationName] &&
    typeof animations[animationName][animationType] === "function";
  
    if (animationExists) {
      animations[animationName][animationType]($this, params, animationType);
    } else {
      console.warn(
        `Animation type "${animationType}" not found for "${animationName}"`
      );
    }
  }
});
});

const animations = {
  "fade-up": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0,
        yPercent: 50, // Changed from y to yPercent for more responsive effect
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, yPercent: 50 }, // Changed from y to yPercent
        {
          opacity: 1,
          yPercent: 0,
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0,
        yPercent: 50, // Changed from y to yPercent
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0,
        yPercent: 100,
        duration: getNumber(params.duration, 1),
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0,
        yPercent: 100,
        duration: getNumber(params.duration, 1),
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "fade-down": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0,
        yPercent: -50, // Start above the screen
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, yPercent: -50 }, // Start above the screen
        {
          opacity: 1,
          yPercent: 0, // End at its original position
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0,
        yPercent: -50, // Start above the screen for staggered items
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation with fade down
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0,
        yPercent: -100, // Start above the screen
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    // ➕ Added support for character-based animation with fade down
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0,
        yPercent: -100, // Start above the screen
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "fade-in": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0, // Start with 0 opacity for fade-in effect
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0 }, // Start with 0 opacity
        {
          opacity: 1, // Fade to 100% opacity
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0, // Start with 0 opacity
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation with fade-in effect
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0, // Start with 0 opacity
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    // ➕ Added support for character-based animation with fade-in effect
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0, // Start with 0 opacity
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "fade-left": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0, // Start with 0 opacity
        xPercent: -50, // Start the element off-screen to the left
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, xPercent: -50 }, // Start with opacity 0 and off-screen to the left
        {
          opacity: 1, // Fade to full opacity
          xPercent: 0, // Move the element to its original position
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0, // Start with opacity 0
        xPercent: -50, // Start off-screen to the left for staggered items
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation with fade left
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0, // Start with 0 opacity
        xPercent: -50, // Start off-screen to the left
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    // ➕ Added support for character-based animation with fade left
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0, // Start with 0 opacity
        xPercent: -50, // Start off-screen to the left
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "fade-right": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0, // Start with 0 opacity
        xPercent: 50, // Start the element off-screen to the right
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, xPercent: 50 }, // Start with opacity 0 and off-screen to the right
        {
          opacity: 1, // Fade to full opacity
          xPercent: 0, // Move the element to its original position
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0, // Start with opacity 0
        xPercent: 50, // Start off-screen to the right for staggered items
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation with fade right
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0, // Start with 0 opacity
        xPercent: 50, // Start off-screen to the right
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    // ➕ Added support for character-based animation with fade right
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0, // Start with 0 opacity
        xPercent: 50, // Start off-screen to the right
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "scale-in": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0, // Start with 0 opacity
        scale: 0.5, // Start scaled down
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger, // Directly using scrollTrigger from params
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.5 }, // Start with opacity 0 and scaled down
        {
          opacity: 1, // Fade to full opacity
          scale: 1, // Scale to original size
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0, // Start with 0 opacity
        scale: 0.5, // Start scaled down
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    // ➕ Added support for word-based animation with scale-in
    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0, // Start with 0 opacity
        scale: 0.5, // Start scaled down
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    // ➕ Added support for character-based animation with scale-in
    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0, // Start with 0 opacity
        scale: 0.5, // Start scaled down
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },

  "scale-up": {
    standard: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.from(element, {
        opacity: 0,
        scale: 0.5,
        yPercent: 50,
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        scrollTrigger: params.scrollTrigger,
        onComplete: () => $(element).css("transition-property", ""),
      });
    },

    scroll: (element, params = {}) => {
      $(element).css("transition-property", "none");
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.5, yPercent: 50 },
        {
          opacity: 1,
          scale: 1,
          yPercent: 0,
          duration: params.duration || 1,
          ease: params.ease || "power1.out",
          scrollTrigger: params.scrollTrigger,
          onComplete: () => $(element).css("transition-property", ""),
        }
      );
    },

    stagger: (element, params = {}) => {
      $(element)
        .children()
        .each(function () {
          $(this).css("transition-property", "none");
        });

      gsap.from($(element).children(), {
        opacity: 0,
        scale: 0.5,
        yPercent: 50,
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
        onComplete: () => {
          $(element)
            .children()
            .each(function () {
              $(this).css("transition-property", "");
            });
        },
      });
    },

    words: (element, params = {}) => {
      const splitParts = splitText(element, "words");
      if (!splitParts) return;
      gsap.from(splitParts, {
        opacity: 0,
        scale: 0.5,
        yPercent: 50,
        duration: params.duration || 1,
        ease: params.ease || "back.out(2)",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },

    letters: (element, params = {}) => {
      const chars = splitText(element, "chars");
      if (!chars) return;
      gsap.from(chars, {
        opacity: 0,
        scale: 0.5,
        yPercent: 50,
        duration: params.duration || 1,
        ease: params.ease || "power1.out",
        stagger: getNumber(params.stagger, 0.1),
        scrollTrigger: params.scrollTrigger,
      });
    },
  },
};
