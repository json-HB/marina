import "./vendor/carousel.js";
import "./vendor/dropdown.js";
import "./vendor/collapse.js";
import "./vendor/button.js";
import "./vendor/scrollspy.js";
import "./vendor/transition.js";
import { isMobile } from "./util/main";

$(function() {
  if (isMobile()) {
    import("fastclick").then(({ default: FastClick }) => {
      FastClick.attach(document.body);
    });
  }
});

// 进行 service-wroker 注册
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(registration => {
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

export default {};