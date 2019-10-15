import "css/privacy-policy.less";
import marked from "../agreement/privacy.md";

$(function() {
  $(".bouncing-loader").addClass("hidden");
  $(".container").html(marked);
});

export default {};
