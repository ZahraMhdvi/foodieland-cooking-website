document.addEventListener("DOMContentLoaded", function () {
  const ARTICLES_PER_PAGE = 6;

  const allArticles = Array.from(document.querySelectorAll(".blog-article"));
  const noResults = document.querySelector(".no-results");

  const searchInput = document.querySelector('.search-form input[type="text"]');
  const searchBtn = document.querySelector(".search-form button");

  let currentPage = 1;
  let filteredArticles = allArticles.slice();

  const paginationBtns = document.querySelectorAll(
    ".pagination__btn[data-page]",
  );

  paginationBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const page = parseInt(btn.getAttribute("data-page"), 10);
      if (isNaN(page)) return;
      currentPage = page;
      updatePagination();
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  function updatePagination() {
    paginationBtns.forEach(function (btn) {
      const page = parseInt(btn.getAttribute("data-page"), 10);
      if (page === currentPage) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function renderPage() {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    const end = start + ARTICLES_PER_PAGE;

    allArticles.forEach(function (article) {
      article.classList.add("hidden");
    });

    const pageArticles = filteredArticles.slice(start, end);

    if (pageArticles.length === 0) {
      if (noResults) noResults.classList.add("visible");
    } else {
      if (noResults) noResults.classList.remove("visible");
      pageArticles.forEach(function (article) {
        article.classList.remove("hidden");
      });
    }
  }

  function doSearch(query) {
    const q = query.trim().toLowerCase();
    if (q === "") {
      filteredArticles = allArticles.slice();
    } else {
      filteredArticles = allArticles.filter(function (article) {
        const title = article.querySelector(".blog-article__title");
        if (!title) return false;
        return title.textContent.toLowerCase().includes(q);
      });
    }
    currentPage = 1;
    updatePagination();
    renderPage();
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      doSearch(searchInput.value);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (searchInput) doSearch(searchInput.value);
    });
  }

  updatePagination();
  renderPage();
});
