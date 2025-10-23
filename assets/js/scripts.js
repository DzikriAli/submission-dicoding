// Menunggu hingga seluruh dokumen HTML dimuat
document.addEventListener("DOMContentLoaded", function() {

  // --- FITUR 1: LIGHT/DARK MODE TOGGLE ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (themeToggle) {
    // Cek tema yang tersimpan di localStorage
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      body.classList.add(currentTheme);
      // Update ikon tombol jika temanya light
      if (currentTheme === "light-theme") {
        themeToggle.innerHTML = "🌙";
      }
    }

    themeToggle.addEventListener("click", function() {
      if (body.classList.contains("light-theme")) {
        // Ganti ke Dark Mode
        body.classList.remove("light-theme");
        themeToggle.innerHTML = "☀️";
        localStorage.setItem("theme", "dark-theme");
      } else {
        // Ganti ke Light Mode
        body.classList.add("light-theme");
        themeToggle.innerHTML = "🌙";
        localStorage.setItem("theme", "light-theme");
      }
    });
  }


  // --- FITUR 2: LOGIKA TAB SWITCHER ---
  const roleButtons = document.querySelectorAll("#role-switcher .role-button");
  const allContent = document.querySelectorAll(".role-content");

  function hideAllContent() {
    allContent.forEach(content => {
      if (content) content.style.display = "none";
    });
  }

  function removeActiveClasses() {
    roleButtons.forEach(button => {
      if (button) button.classList.remove("active");
    });
  }

  function showContent(contentId) {
    hideAllContent();
    const contentToShow = document.getElementById(contentId);
    if (contentToShow) {
      contentToShow.style.display = "block";
    }
  }
  
  roleButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      const contentId = button.dataset.role; // Ambil dari 'data-role'
      
      showContent(contentId);
      removeActiveClasses();
      button.classList.add("active");
    });
  });

  // Tampilan Default: Tampilkan 'programmer'
  hideAllContent();
  const programmerContent = document.getElementById("programmer");
  if (programmerContent) programmerContent.style.display = "block";


  // --- FITUR 4: ANIMASI 'FADE IN' SAAT SCROLL ---
  const fadeElements = document.querySelectorAll(".fade-in-section");
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
      observer.observe(el);
    });
  }


  // --- FITUR 5 (LAMA): ANIMASI WELCOME SCREEN ---
  // (Ini adalah logika 'role-text' yang berputar di welcome screen)
  const roleTexts = document.querySelectorAll(".role-text");
  let currentRoleIndex = 0;
  
  if (roleTexts.length > 0) {
    const roleInterval = setInterval(() => {
      let oldRole = roleTexts[currentRoleIndex];
      if (oldRole) {
        oldRole.classList.remove("active");
        oldRole.classList.add("exiting");
      }

      currentRoleIndex++;
      if (currentRoleIndex >= roleTexts.length) {
        currentRoleIndex = 0; 
      }

      let newRole = roleTexts[currentRoleIndex];
      if (newRole) {
        newRole.classList.remove("exiting"); 
        newRole.classList.add("active");
      }
    }, 2000); 
  }
  
  
  // ================= FITUR 3 & 5 (DIGABUNG): LOGIKA SCROLL =================
  
  // --- Variabel untuk FITUR 3 (Navbar) & 5 (Scrollspy) ---
  const header = document.querySelector("header");
  const welcomeSection = document.getElementById("welcome-section");
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sections = [];

  // --- Setup FITUR 5 (Scrollspy) ---
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('href');
    if (sectionId.length > 1) {
      const section = document.querySelector(sectionId);
      if (section) {
        sections.push(section);
      }
    }
  });

  // Urutkan section berdasarkan posisinya di halaman
  sections.sort((a, b) => a.offsetTop - b.offsetTop);

  function removeAllActiveLinks() {
    navLinks.forEach(link => {
      link.classList.remove('active-link');
    });
  }

  // Fungsi Scrollspy (FITUR 5)
  function updateActiveLinkOnScroll() {
    // Pastikan header ada sebelum mencoba membaca 'offsetHeight'
    if (!header) return; 
    
    const scrollPosition = window.scrollY;
    let triggerMargin = 100; 
    
    if (sections.length > 0 && sections[0]) {
      const style = window.getComputedStyle(sections[0]);
      triggerMargin = parseInt(style.scrollMarginTop, 10) || 100;
    }
    
    const triggerLine = scrollPosition + triggerMargin; 
    let currentSectionId = null;

    if (welcomeSection && scrollPosition < welcomeSection.offsetHeight - triggerMargin) {
      currentSectionId = null; // Tidak ada yang aktif
    } else {
      for (const section of sections) {
        if (section.offsetParent === null) {
          continue; 
        }
        if (section.offsetTop <= triggerLine) {
          currentSectionId = section.getAttribute('id');
        } else {
          break; 
        }
      }
    }
    
    removeAllActiveLinks();
    if (currentSectionId) {
      const activeLink = document.querySelector(`header nav a[href="#${currentSectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active-link');
      }
    }
  }

  // --- SATU Event Listener untuk SEMUA fungsi scroll ---
  window.addEventListener("scroll", function() {
    
    // --- Logika FITUR 3 (Navbar Scrolled) ---
    if (welcomeSection && header) {
      const welcomeHeight = welcomeSection.offsetHeight;
      // Gunakan 0.9 (90%) seperti di kode Anda yang benar
      if (window.scrollY > welcomeHeight * 0.9) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    
    // --- Logika FITUR 5 (Scrollspy) ---
    updateActiveLinkOnScroll();
  });

  // Jalankan scrollspy sekali saat memuat halaman
  updateActiveLinkOnScroll();

}); // <-- AKHIR DARI 'DOMContentLoaded'