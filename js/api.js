const API_BASE_URL = "https://foodieland-oq9b.onrender.com";

async function apiRequest(endpoint, options) {
  const response = await fetch(API_BASE_URL + endpoint, options || {});
  if (!response.ok) {
    throw new Error("Server responded with status " + response.status);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return null;
}

function showLoading(container, message) {
  if (!container) return;
  container.innerHTML =
    '<div class="api-loading">' +
    '<div class="api-spinner"></div>' +
    "<p>" +
    (message || "Loading...") +
    "</p>" +
    "</div>";
}

function showError(container, message) {
  if (!container) return;
  container.innerHTML =
    '<div class="api-error">' +
    "<p>" +
    (message || "Something went wrong. Please try again later.") +
    "</p>" +
    "</div>";
}

function showFormStatus(formEl, message, type) {
  if (!formEl) return;
  let statusEl = formEl.querySelector(".form-status-msg");
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.className = "form-status-msg";
    formEl.appendChild(statusEl);
  }

  statusEl.className = "form-status-msg " + (type || "");

  if (type === "") {
    statusEl.innerHTML =
      '<div class="api-spinner" style="display:inline-block; vertical-align:middle; width:16px; height:16px; margin-right:8px; border-width:2px;"></div><span style="vertical-align:middle;">' +
      message +
      "</span>";
  } else {
    statusEl.innerHTML = "<span>" + message + "</span>";
  }
}

async function loadCategories() {
  const grid = document.querySelector(".categories-grid");
  if (!grid) return;

  showLoading(grid, "Waking up the server, this can take up to a minute...");

  try {
    const response = await apiRequest("/api/categories");
    const categories = extractArray(response);
    renderCategories(grid, categories);
  } catch (error) {
    console.error("Failed to load categories:", error);
    showError(
      grid,
      "We couldn't load the categories right now. Please refresh the page to try again.",
    );
  }
}

function extractArray(response) {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object") return [];
  const possibleKeys = ["data", "categories", "results", "items", "recipes"];
  for (const key of possibleKeys) {
    if (Array.isArray(response[key])) return response[key];
  }
  return [];
}

function resolveApiImage(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  return API_BASE_URL + (path.startsWith("/") ? path : "/" + path);
}

function renderCategories(grid, categories) {
  if (!categories || categories.length === 0) {
    showError(grid, "No categories were found.");
    return;
  }

  const colorClasses = [
    "category-card__inner--green",
    "category-card__inner--vegan",
    "category-card__inner--red",
    "category-card__inner--yellow",
    "category-card__inner--gray",
  ];

  grid.innerHTML = "";

  categories.forEach(function (category, index) {
    const name =
      category.name || category.title || category.categoryName || "Category";
    const rawIcon =
      category.icon ||
      category.image ||
      category.img ||
      category.thumbnail ||
      "";
    const icon = resolveApiImage(rawIcon);
    const colorClass = colorClasses[index % colorClasses.length];

    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML =
      '<div class="category-card__inner ' +
      colorClass +
      '">' +
      '<img src="' +
      icon +
      '" alt="' +
      name +
      '" class="category-card__img" />' +
      '<p class="category-card__name">' +
      name +
      "</p>" +
      "</div>";
    grid.appendChild(card);
  });
}

async function loadRecipeDetails() {
  const nutritionBox = document.querySelector(".recipe-nutrition");
  const descEl = document.querySelector(".recipe-desc");
  if (!nutritionBox && !descEl) return;

  let nutritionListEl = null;
  let nutritionNoteEl = null;
  if (nutritionBox) {
    nutritionListEl = nutritionBox.querySelector(".nutrition-list");
    nutritionNoteEl = nutritionBox.querySelector(".nutrition-note");
    showLoading(nutritionBox, "Loading nutrition info...");
  }

  try {
    const response = await apiRequest("/api/recipe-details/1");
    const data = (response && response.data) || response || {};

    if (nutritionBox) {
      renderNutrition(nutritionBox, data);
    }
    if (descEl) {
      const description =
        data.description || data.desc || data.text || data.summary;
      if (description) descEl.textContent = description;
    }
  } catch (error) {
    console.error("Failed to load recipe details:", error);
    if (nutritionBox) {
      showError(nutritionBox, "Nutrition info is unavailable right now.");
    }
    if (descEl) {
      descEl.textContent =
        "We couldn't load the recipe description right now. Please try again later.";
    }
  }
}

function renderNutrition(nutritionBox, data) {
  const nutrition = (data && data.nutrition) || data || {};

  const fields = [
    { label: "Calories", key: "calories", unit: " kcal" },
    { label: "Total Fat", key: "fat", unit: " g" },
    { label: "Protein", key: "protein", unit: " g" },
    { label: "Carbohydrate", key: "carbohydrate", unit: " g" },
    { label: "Cholesterol", key: "cholesterol", unit: " mg" },
  ];

  let itemsHtml = "";
  fields.forEach(function (field) {
    const value = nutrition[field.key];
    if (value === undefined || value === null) return;
    itemsHtml +=
      "<li>" +
      '<span class="nutrition-list__label">' +
      field.label +
      "</span>" +
      '<span class="nutrition-list__value">' +
      value +
      field.unit +
      "</span>" +
      "</li>";
  });

  if (!itemsHtml) {
    showError(nutritionBox, "Nutrition info is unavailable right now.");
    return;
  }

  nutritionBox.innerHTML =
    "<h3>Nutrition Information</h3>" +
    '<ul class="nutrition-list">' +
    itemsHtml +
    "</ul>" +
    '<p class="nutrition-note">' +
    (data && data.note ? data.note : "Values are per serving.") +
    "</p>";
}

function initNewsletterForms() {
  const forms = document.querySelectorAll(".newsletter-form");

  forms.forEach(function (form) {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector("button");
    if (!input || !button) return;

    const statusContainer = form.parentElement || form;

    button.addEventListener("click", async function () {
      const email = input.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailPattern.test(email)) {
        showFormStatus(
          statusContainer,
          "Please enter a valid email address.",
          "error",
        );
        return;
      }

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Subscribing...";
      showFormStatus(
        statusContainer,
        "Waking up the server, this can take a moment...",
        "",
      );

      try {
        await apiRequest("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        input.value = "";
        showFormStatus(
          statusContainer,
          "Thanks! You're subscribed.",
          "success",
        );
      } catch (error) {
        console.error("Newsletter subscribe failed:", error);
        showFormStatus(
          statusContainer,
          "Something went wrong while subscribing. Please try again later.",
          "error",
        );
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });
}

function initContactForm() {
  const submitBtn = document.querySelector(".btn-submit");
  if (!submitBtn) return;

  const form = document.querySelector(".contact-form-area");

  submitBtn.addEventListener("click", async function () {
    const nameEl = document.getElementById("contact-name");
    const emailEl = document.getElementById("contact-email");
    const subjectEl = document.getElementById("contact-subject");
    const enquiryEl = document.getElementById("contact-enquiry");
    const messageEl = document.getElementById("contact-messages");

    const payload = {
      name: nameEl ? nameEl.value.trim() : "",
      email: emailEl ? emailEl.value.trim() : "",
      subject: subjectEl ? subjectEl.value.trim() : "",
      enquiryType: enquiryEl ? enquiryEl.value : "",
      message: messageEl ? messageEl.value.trim() : "",
    };

    if (!payload.name || !payload.email || !payload.message) {
      showFormStatus(
        form,
        "Please fill in your name, email, and message before sending.",
        "error",
      );
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showFormStatus(
      form,
      "Waking up the server, this can take up to a minute...",
      "",
    );

    try {
      await apiRequest("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      showFormStatus(
        form,
        "Your message has been sent. We'll get back to you soon!",
        "success",
      );

      if (nameEl) nameEl.value = "";
      if (emailEl) emailEl.value = "";
      if (subjectEl) subjectEl.value = "";
      if (messageEl) messageEl.value = "";
    } catch (error) {
      console.error("Contact form submit failed:", error);
      showFormStatus(
        form,
        "Something went wrong while sending your message. Please try again later.",
        "error",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadCategories();
  loadRecipeDetails();
  initNewsletterForms();
  initContactForm();
});
