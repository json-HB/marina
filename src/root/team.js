import "css/privacy-policy.less";
import marked from "../agreement/terms.md";

window.onload = function() {
  document.querySelector(".bouncing-loader").classList.add("hidden");
  document.querySelector(".container").innerHTML = marked;
};

export default {};
