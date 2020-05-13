import "css/fqa.less";
import "../vendor/dropdown.js";
import "../vendor/collapse.js";
import "../vendor/button.js";
import "../vendor/transition.js";
import { isMobile, getUrl } from "util";

$(function() {
  if (isMobile()) {
    import("fastclick").then(({ default: FastClick }) => {
      FastClick.attach(document.body);
    });
  }
  $(".bouncing-loader").addClass("hidden");
  getUrl();
  bindH2Event();
});

function bindH2Event() {
  $("h2").each(function() {
    $(this)
      .next()
      .hide();
  });
  $("h2").on("click", function() {
    $(this).hasClass("active")
      ? $(this)
          .next()
          .slideUp()
      : $(this)
          .next()
          .slideDown();
    $(this).toggleClass("active");
  });
}

$(document).on("click", function(ev) {
  if (isMobile()) {
    if (!$.contains($(".navbar-nav").get(0), ev.target)) {
      $(".navbar-collapse").collapse("hide");
    }
  }
});

export default {};
