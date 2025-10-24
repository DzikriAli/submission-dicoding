// Menunggu hingga seluruh dokumen HTML dimuat
document.addEventListener("DOMContentLoaded", function() {

  // --- FITUR 1: LIGHT/DARK MODE TOGGLE ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (themeToggle) {
    // Cek tema yang tersimpan di localStorage saat load
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      body.classList.add(currentTheme);
      // Update ikon tombol jika temanya light
      if (currentTheme === "light-theme") {
        themeToggle.innerHTML = "🌙";
      }
    } else {
       // Jika tidak ada tema tersimpan, default ke dark (sesuai body class awal)
       localStorage.setItem("theme", "dark-theme");
    }

    // Tambahkan event listener untuk tombol
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


  // --- FITUR 2: LOGIKA TAB SWITCHER (Mobile Dev / Game Dev) ---
  const roleButtons = document.querySelectorAll("#role-switcher .role-button");
  const allContent = document.querySelectorAll("#content .role-content"); // Target hanya konten di dalam #content

  function hideAllContent() {
    allContent.forEach(content => {
      if (content) content.style.display = "none";
    });
  }

  function removeActiveRoleClasses() { // Ganti nama agar lebih jelas
    roleButtons.forEach(button => {
      if (button) button.classList.remove("active");
    });
  }

  function showRoleContent(contentId) { // Ganti nama agar lebih jelas
    hideAllContent();
    const contentToShow = document.getElementById(contentId);
    if (contentToShow) {
      contentToShow.style.display = "block";
    }
  }

  roleButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      const contentId = button.dataset.role; // Ambil dari 'data-role'
      if (contentId) {
        showRoleContent(contentId);
        removeActiveRoleClasses();
        button.classList.add("active");
      }
    });
  });

  // Tampilan Default: Tampilkan 'mobile-dev' (sesuai HTML baru)
  hideAllContent();
  const defaultRoleContent = document.getElementById("mobile-dev"); // Pastikan ID ini benar
  if (defaultRoleContent) defaultRoleContent.style.display = "block";
  // Tombol default sudah 'active' di HTML


  // --- FITUR 4: ANIMASI 'FADE IN' SAAT SCROLL ---
  const fadeElements = document.querySelectorAll(".fade-in-section");
  // Cek apakah IntersectionObserver didukung
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.1 }); // Trigger saat 10% terlihat

    fadeElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback jika IntersectionObserver tidak didukung (jarang terjadi)
    // Tampilkan saja semua elemennya
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // --- Kode Animasi Welcome Screen (roleTexts) DIHAPUS karena tidak relevan lagi ---


  // ================= FITUR 3 & 5 (DIGABUNG): LOGIKA SCROLL (Navbar & Scrollspy) =================

  // --- Variabel Global untuk Scroll ---
  const header = document.querySelector("header");
  const welcomeSection = document.getElementById("welcome-section");
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sections = [];

  // --- Setup Scrollspy ---
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('href');
    // Pastikan link valid dan bukan hanya '#'
    if (sectionId && sectionId.length > 1 && sectionId.startsWith('#')) {
      try { // Gunakan try-catch untuk selector yang mungkin tidak valid
        const section = document.querySelector(sectionId);
        if (section) {
          sections.push(section);
        }
      } catch (e) {
        console.warn(`Scrollspy: Could not find section for selector "${sectionId}"`);
      }
    }
  });

  // Urutkan section berdasarkan posisinya di halaman (PENTING)
  sections.sort((a, b) => a.offsetTop - b.offsetTop);

  function removeAllActiveLinks() {
    navLinks.forEach(link => {
      link.classList.remove('active-link');
    });
  }

  // Fungsi Scrollspy
  function updateActiveLinkOnScroll() {
    // Pastikan header ada
    if (!header) return;

    const scrollPosition = window.scrollY;
    let triggerMargin = 100; // Default margin

    // Coba baca scroll-margin-top dari CSS
    if (sections.length > 0 && sections[0]) {
      const style = window.getComputedStyle(sections[0]);
      // Cek jika style ada sebelum parsing
      if(style.scrollMarginTop) {
         triggerMargin = parseInt(style.scrollMarginTop, 10) || 100;
      }
    }

    // Pemicu adalah posisi scroll + margin (jarak dari atas)
    const triggerLine = scrollPosition + triggerMargin;
    let currentSectionId = null;

    // Cek jika masih di area welcome/hero
    if (welcomeSection && scrollPosition < welcomeSection.offsetHeight - triggerMargin) {
      currentSectionId = null; // Tidak ada yang aktif
    } else {
      // Loop dari ATAS ke BAWAH melalui section yang sudah diurutkan
      for (const section of sections) {
        // Abaikan section yang tersembunyi (display: none)
        if (section.offsetParent === null) {
          continue;
        }
        // Jika bagian atas section sudah berada di atas garis pemicu
        if (section.offsetTop <= triggerLine) {
          currentSectionId = section.getAttribute('id');
          // Terus loop untuk menemukan section *terakhir* yang memenuhi syarat
        } else {
          // Jika section berikutnya sudah di bawah garis, berhenti
          break;
        }
      }
    }

    // Terapkan class active-link
    removeAllActiveLinks();
    if (currentSectionId) {
      // Cari link yang href-nya cocok dengan ID section yang aktif
      const activeLink = document.querySelector(`header nav a[href="#${currentSectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active-link');
      }
    }
  }

  // --- SATU Event Listener untuk SEMUA fungsi scroll ---
  window.addEventListener("scroll", function() {

    // --- Logika Navbar Scrolled ---
    if (welcomeSection && header) {
      const welcomeHeight = welcomeSection.offsetHeight;
      if (window.scrollY > welcomeHeight * 0.9) { // Trigger di 90% tinggi welcome section
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // --- Logika Scrollspy ---
    updateActiveLinkOnScroll();
  });

  // Jalankan scrollspy sekali saat halaman baru dimuat
  updateActiveLinkOnScroll();

}); // <-- AKHIR DARI 'DOMContentLoaded'