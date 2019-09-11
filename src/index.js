import "./preboot";
import "./css/main/index.less";

$(function() {
  $("body").removeClass("hidden");

  $("form").submit(ev => {
    ev.preventDefault();
    console.log("submit");
    const res = $("form").serialize();
    let resDel = "";
    res.split("&").forEach(item => {
      resDel += item.split("=")[0] + ": ";
      resDel += item.split("=")[1] + "\n";
    });
    const mailTo = "mailto:624172381@qq.com";
    const A = $(
      `<a href='${mailTo}?body=${encodeURIComponent(
        resDel
      )}' target='_blank'></a>`
    ).appendTo("body");
    A.get(0).click();
    setTimeout(() => {
      A.remove();
    }, 1000);
  });
});
