import "css/privacy-policy.less";
import marked from "../agreement/terms.md";

$(function() {
  console.log(33333);
  $(".bouncing-loader").addClass("hidden");
  $(".container").html(marked);
});

export default {};
