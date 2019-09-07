import "./vendor/jquery.js";
import "./vendor/carousel.js";
import { isMobile } from "./util/main";

$(function() {
  if (isMobile()) {
    import("fastclick").then(({ default: FastClick }) => {
      FastClick.attach(document.body);
    });
  }
});
