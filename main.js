/**
 * Aryan - Portfolio Website Main JavaScript
 * Handles dynamic typing, themes, project filtering, animated stats, and interactive events.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypewriter();
  initNavbarScroll();
  initMobileMenu();
  initProjectFilters();
  initStatsCounter();
  initSkillBars();
  initContactForm();
  initBackToTop();
});

/* ==========================================
   1. Theme Toggle (Dark / Light)
   ========================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = themeBtn?.querySelector('i');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('aryan_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aryan_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fas fa-moon';
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fas fa-sun';
      themeBtn.setAttribute('title', 'Switch to Light Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ==========================================
   2. Dynamic Typewriter Effect
   ========================================== */
function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const words = [
    'B.Tech CSE Student',
    'Python & Backend Developer',
    'Competitive Judoka & Athlete',
    'Problem Solver & DSA Enthusiast',
    'AI & Automation Builder'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* ==========================================
   3. Navbar Scroll & Active Link Tracking
   ========================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Navbar glass effect
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Spy
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   4. Mobile Menu Navigation
   ========================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking link
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================
   5. Project Category Filtering
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   6. Animated Stats Counter
   ========================================== */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statsElements.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = 40;
          const increment = Math.ceil(target / (1500 / speed));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = count + suffix;
            }
          }, speed);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-ribbon');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================
   7. Animated Skill Bars
   ========================================== */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        skillFills.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.querySelector('#skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

/* ==========================================
   8. Contact Form Handling & Toast Feedback
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('⚠️ Please fill in all required fields.', '#f59e0b');
      return;
    }

    // Simulate sending state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      contactForm.reset();
      showToast('🥋 Message received! Aryan will connect with you soon.', '#22c55e');
    }, 1200);
  });

  function showToast(message, borderColor) {
    if (!toast) return;
    toast.textContent = message;
    if (borderColor) toast.style.borderColor = borderColor;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* ==========================================
   9. Back to Top Button
   ========================================== */
function initBackToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const footerScrollLink = document.getElementById('footer-scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  footerScrollLink?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

