import "css/fqa.less";
import { isMobile } from "util";

$(function() {
  if (isMobile()) {
    import("fastclick").then(({ default: FastClick }) => {
      FastClick.attach(document.body);
    });
  }
});

export default {};
