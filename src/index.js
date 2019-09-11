import "./preboot";
import "./css/main/index.less";

$(function() {
  $(".bouncing-loader").addClass("hidden");

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

  // phoneNumber
  $("#phoneNumber").on("keydown", function(evt) {
    const keyCode = evt.keyCode;
    if (
      !(
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105) ||
        keyCode == 8 ||
        keyCode == 9 ||
        keyCode == 13 ||
        keyCode == 190 ||
        keyCode == 110
      )
    ) {
      evt.preventDefault();
    }
  });

  // select city
  $("#selectCity").on("change", function() {
    let val = $(this).val();
    console.log(val);
    $(this).css("color", val ? "black" : "#999");
  });

  // launch time
  function calcLunchTime() {
    console.log(111);
    const day1 = $("#day1");
    const day2 = $("#day2");
    const now = Date.now();
    const launchTime = new Date(2019, 9, 1).valueOf();
    const diff = launchTime - now;
    function setTime(d1, d2) {
      day1.text(d1);
      day2.text(d2);
    }
    if (diff <= 0) {
      setTime(0, 0);
    } else {
      const diffDay = Math.ceil(diff / 3600 / 1000 / 24).toString();
      setTime(diffDay.split("")[0], diffDay.split("")[1]);
    }
  }

  // start time
  calcLunchTime();
  setInterval(calcLunchTime, 1 * 1000 * 3600);
});
