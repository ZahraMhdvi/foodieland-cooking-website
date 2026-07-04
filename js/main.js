document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mainNav = document.querySelector(".main-nav");
  const navOverlay = document.getElementById("nav-overlay");

  function openMenu() {
    hamburgerBtn.classList.add("active");
    mainNav.classList.add("active");
    navOverlay.classList.add("active");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    hamburgerBtn.classList.remove("active");
    mainNav.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn && mainNav && navOverlay) {
    hamburgerBtn.addEventListener("click", function () {
      if (mainNav.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navOverlay.addEventListener("click", closeMenu);

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  const recipeCards = document.querySelectorAll(".recipe-card");

  recipeCards.forEach(function (card) {
    card.addEventListener("click", function () {
      window.location.href = "recipe-details.html";
    });
  });

  recipeCards.forEach(function (card) {
    card.style.cursor = "pointer";
  });
});
