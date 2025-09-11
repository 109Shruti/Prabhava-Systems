// Prabhava Systems Website JavaScript (Updated for React Integration)

// Dashboard Navigation Function - CORRECTED
function openDashboard(role) {
  const button = event.target.closest('button') || event.target.closest('.dashboard-btn');
  if (!button) return;
  
  const originalHTML = button.innerHTML;
  
  // Show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Dashboard...';
  button.disabled = true;
  
  // Add loading class for additional styling
  button.classList.add('btn-loading');
  
  // Track dashboard access
  if (window.PrabhavasUtils) {
    window.PrabhavasUtils.trackDashboardAccess(role);
  }
  
  // Force React app to take over
  setTimeout(() => {
    // Hide landing page elements and show React app
    document.body.classList.add('react-app-active');
    
    // Navigate to hash route
    window.location.hash = '#/login';
    
    // Force hash change event
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    
    // Ensure React app is visible
    const reactRoot = document.getElementById('root');
    if (reactRoot) {
      reactRoot.style.display = 'block';
    }
  }, 600);
  
  // Fallback: Reset button state if navigation fails
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.disabled = false;
    button.classList.remove('btn-loading');
  }, 5000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a hash route and should show React app
  function checkHashRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      document.body.classList.add('react-app-active');
      const reactRoot = document.getElementById('root');
      if (reactRoot) {
        reactRoot.style.display = 'block';
      }
    } else {
      document.body.classList.remove('react-app-active');
      const reactRoot = document.getElementById('root');
      if (reactRoot) {
        reactRoot.style.display = 'none';
      }
    }
  }

  // Check on page load
  checkHashRoute();

  // Listen for hash changes
  window.addEventListener('hashchange', checkHashRoute);

  // Mobile Navigation Toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Handle mobile menu toggle with hamburger animation
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      
      // Animate hamburger to X
      const spans = navToggle.querySelectorAll("span");
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Close mobile menu when nav links clicked (excluding dashboard links)
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const href = this.getAttribute("href");
      // Only close menu for anchor links, not dashboard routes
      if (href && href.startsWith("#") && !href.startsWith("#/")) {
        if (navMenu) {
          navMenu.classList.remove("active");
          const spans = navToggle ? navToggle.querySelectorAll("span") : null;
          if (spans) {
            spans[0].style.transform = "none";
            spans[1].style.opacity = "1";
            spans[2].style.transform = "none";
          }
        }
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (navMenu && navToggle) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        const spans = navToggle.querySelectorAll("span");
        if (spans) {
          spans[0].style.transform = "none";
          spans[1].style.opacity = "1";
          spans[2].style.transform = "none";
        }
      }
    }
  });

  // Header scroll effect with improved styling
  const header = document.getElementById("header");
  function handleScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      if (header) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.backdropFilter = "blur(20px)";
        header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
        header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.05)";
      }
    } else {
      if (header) {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(10px)";
        header.style.boxShadow = "none";
        header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.02)";
      }
    }
  }
  window.addEventListener("scroll", handleScroll);

  // Smooth scrolling for anchor links (excluding dashboard routes)
  document.querySelectorAll('a[href^="#"]:not([href^="#/"])').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      
      // Skip smooth scrolling for dashboard routes
      if (href.startsWith("#/")) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({ 
          top: targetPosition, 
          behavior: "smooth" 
        });
      }
    });
  });

  // Dashboard access buttons - Enhanced click tracking
  document.querySelectorAll('a[href^="#/"]').forEach((dashboardLink) => {
    dashboardLink.addEventListener("click", function(e) {
      e.preventDefault(); // Prevent default link behavior
      
      console.log("Dashboard access clicked:", this.getAttribute("href"));
      
      // Add loading indicator
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
      this.style.pointerEvents = 'none';
      
      // Trigger openDashboard function
      setTimeout(() => {
        openDashboard('general');
      }, 300);
      
      // Reset after navigation attempt
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.pointerEvents = 'auto';
      }, 3000);
    });
  });

  // Intersection Observers for animations
  function createObserver(selector, animationStyle, delay = 100) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    // Set initial state
    elements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = animationStyle.initialTransform || "translateY(20px)";
      el.style.transition = "none";
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              Object.assign(entry.target.style, {
                opacity: "1",
                transform: animationStyle.finalTransform || "translateY(0)",
                transition: animationStyle.transition || "all 0.6s ease-out",
              });
            }, index * delay);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    elements.forEach((el) => observer.observe(el));
  }

  // Apply animations to different sections
  createObserver(".service-card", {
    initialTransform: "translateY(30px) scale(0.95)",
    finalTransform: "translateY(0) scale(1)",
    transition: "all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  }, 150);

  createObserver(".tech-card", {
    initialTransform: "translateY(40px)",
    finalTransform: "translateY(0)",
    transition: "all 0.6s ease-out"
  }, 100);

  createObserver(".solution-card", {
    initialTransform: "scale(0.9) translateY(20px)",
    finalTransform: "scale(1) translateY(0)",
    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  }, 120);

  createObserver(".benefit-item", {
    initialTransform: "translateX(-30px)",
    finalTransform: "translateX(0)",
    transition: "all 0.6s ease-out"
  }, 80);

  createObserver(".feature-item", {
    initialTransform: "translateY(20px)",
    finalTransform: "translateY(0)",
    transition: "all 0.5s ease-out"
  }, 100);

  // Enhanced contact form handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name")?.trim();
      const email = formData.get("email")?.trim();
      const message = formData.get("message")?.trim();

      // Validation
      if (!name || !email || !message) {
        showNotification("❌ Please fill in all required fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("❌ Please enter a valid email address.", "error");
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitButton.innerHTML;
      
      // Loading state
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        showNotification("✅ Thank you! Your message has been sent successfully.", "success");
        contactForm.reset();
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  // Helper functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      ${type === "success" ? "background: #10b981;" : "background: #ef4444;"}
    `;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Parallax effect for hero background
  function handleParallax() {
    const heroBackground = document.querySelector(".hero-background");
    if (heroBackground) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      heroBackground.style.transform = `translateY(${rate}px)`;
    }
  }
  window.addEventListener("scroll", handleParallax);

  // Active navigation link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    let current = "";
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });
    
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}`) {
        link.classList.add("active");
      }
    });
  }
  
  window.addEventListener("scroll", updateActiveNavLink);

  // Page load animations
  function initializePageAnimations() {
    document.body.style.opacity = "1";
    
    // Animate hero elements
    const heroElements = [
      ".hero-badge",
      ".hero-title", 
      ".hero-subtitle",
      ".hero-stats",
      ".hero-buttons"
    ];
    
    heroElements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        setTimeout(() => {
          element.style.transition = "all 0.8s ease-out";
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, 200 + (index * 150));
      }
    });
  }

  // Initialize when page is ready
  setTimeout(initializePageAnimations, 100);

  // Counter animation for statistics
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .benefit-stat');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      if (isNaN(target)) return;
      
      const increment = target / 100;
      let current = 0;
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '');
              }
            }, 20);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(counter);
    });
  }
  
  animateCounters();

  // Add event listeners for any remaining dashboard buttons
  document.querySelectorAll('.dashboard-btn, button[onclick*="openDashboard"]').forEach(button => {
    if (!button.hasAttribute('onclick')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const role = this.dataset.role || 'general';
        openDashboard(role);
      });
    }
  });
});

// Enhanced CSS for better mobile experience and React integration
const enhancedStyles = document.createElement("style");
enhancedStyles.textContent = `
  /* Page Load Animation */
  body { 
    opacity: 0; 
    transition: opacity 0.5s ease-in; 
  }

  /* React App Integration Styles */
  #root {
    display: none; /* Hidden by default */
    min-height: 100vh;
    width: 100%;
  }

  /* Show React app and hide landing page when active */
  body.react-app-active #root {
    display: block !important;
  }

  body.react-app-active .header,
  body.react-app-active .hero,
  body.react-app-active .about,
  body.react-app-active .services,
  body.react-app-active .technology,
  body.react-app-active .solutions,
  body.react-app-active .benefits,
  body.react-app-active .contact,
  body.react-app-active .footer {
    display: none !important;
  }

  /* Mobile Navigation Improvements */
  .nav-toggle span {
    display: block;
    width: 25px;
    height: 2px;
    background: var(--color-text, #1f2937);
    border-radius: 1px;
    transition: all 0.3s ease;
  }

  .nav-toggle span:nth-child(2) {
    margin: 5px 0;
  }

  /* Dashboard Access Buttons Hover Effects */
  .dashboard-btn,
  a[href^="#/"],
  button[onclick*="openDashboard"] {
    transition: all 0.3s ease !important;
  }

  .dashboard-btn:hover,
  a[href^="#/"]:hover,
  button[onclick*="openDashboard"]:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  /* Loading states for dashboard buttons */
  .dashboard-btn.btn-loading,
  button[onclick*="openDashboard"].btn-loading {
    position: relative;
    pointer-events: none;
  }

  /* Mobile Responsive Improvements */
  @media (max-width: 768px) {
    .nav-menu { 
      position: fixed; 
      top: 80px; 
      left: -100%; 
      width: 100%; 
      height: calc(100vh - 80px); 
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
      z-index: 999; 
      overflow-y: auto;
    }
    
    .nav-menu.active { 
      left: 0; 
    }
    
    .nav-list { 
      flex-direction: column; 
      padding: 2rem; 
      gap: 1.5rem; 
      height: 100%; 
      justify-content: flex-start; 
    }
    
    .nav-link { 
      font-size: 1.2rem; 
      padding: 1rem 0; 
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      display: block;
    }
    
    .nav-actions {
      margin-top: 2rem;
      text-align: center;
    }

    .hero-stats {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }

    .dashboard-access {
      padding: 1.5rem !important;
    }

    .dashboard-access > div:last-child {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }

    .dashboard-access button {
      width: 100% !important;
      justify-content: center !important;
    }
  }

  /* Enhanced animations */
  .hero-badge {
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Improved focus states for accessibility */
  a:focus,
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid var(--color-primary, #10b981);
    outline-offset: 2px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Notification improvements */
  .notification {
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Smooth transition between landing and React app */
  body.react-app-active {
    transition: all 0.3s ease-in-out;
  }
`;

document.head.appendChild(enhancedStyles);

// Global utility functions
window.PrabhavasUtils = {
  // Smooth scroll to section
  scrollToSection: function(sectionId) {
    const section = document.getElementById(sectionId);
    const header = document.getElementById("header");
    if (section) {
      const headerHeight = header ? header.offsetHeight : 80;
      const targetPosition = section.offsetTop - headerHeight;
      window.scrollTo({ 
        top: targetPosition, 
        behavior: "smooth" 
      });
    }
  },

  // Check if user is on mobile
  isMobile: function() {
    return window.innerWidth <= 768;
  },

  // Analytics tracking for dashboard access
  trackDashboardAccess: function(role) {
    console.log(`Dashboard access: ${role}`);
    // Add your analytics code here (Google Analytics, etc.)
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'dashboard_access', {
        'custom_role': role,
        'custom_source': 'landing_page'
      });
    }
  },

  // Navigation helper
  navigateToDashboard: function(role = 'general') {
    openDashboard(role);
  }
};

// Expose openDashboard function globally for HTML onclick handlers
window.openDashboard = openDashboard;
