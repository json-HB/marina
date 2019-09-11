import "./vendor/jquery.js";
import "./vendor/carousel.js";
import "./vendor/dropdown.js";
import "./vendor/collapse.js";
import "./vendor/button.js";
import { isMobile } from "./util/main";

$(function() {
  if (isMobile()) {
    import("fastclick").then(({ default: FastClick }) => {
      FastClick.attach(document.body);
    });
  }
});
