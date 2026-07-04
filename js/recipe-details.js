document.addEventListener("DOMContentLoaded", function () {
  function toggleCheck(el) {
    var checked = el.classList.toggle("is-checked");
    el.setAttribute("aria-checked", checked ? "true" : "false");
  }

  var ingredientItems = document.querySelectorAll(".ingredient-list__item");

  ingredientItems.forEach(function (item) {
    item.addEventListener("click", function () {
      toggleCheck(item);
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleCheck(item);
      }
    });
  });

  var directionSteps = document.querySelectorAll(".instructions-step");

  directionSteps.forEach(function (step) {
    var circle = step.querySelector(".instructions-step__num");

    if (circle) {
      circle.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleCheck(step);
      });

      circle.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggleCheck(step);
        }
      });
    }
  });
});
