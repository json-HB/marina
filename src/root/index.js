import "../preboot";
import "css/index.less";
import { throttle, RegNum, isMobile, Alert, getUrl } from "util";
import carouseTpl from "ejs/carouse.ejs";
import carouseData from "static/carouse.json";

$(function() {
  $(".bouncing-loader").addClass("hidden");

  // getUrl
  getUrl();

  // screenHeight
  const screenHeight = $(window).height();

  // 调试carouse test;
  // $(".carousel").carousel({
  //   interval: 1000000
  // });

  $();

  // carouse render
  Object.assign(carouseData, {
    isMobile: isMobile()
  });
  $("#carousel-jason").html(carouseTpl(carouseData));

  // nav collapse

  $(document).on("click", function(ev) {
    if (isMobile()) {
      if (!$.contains($(".navbar-nav").get(0), ev.target)) {
        $(".navbar-collapse").collapse("hide");
      }
    }
  });

  // form submit
  $("form").submit(ev => {
    ev.preventDefault();
    const res = $("form").serialize();
    let resDel = "";
    res.split("&").forEach(item => {
      let part1 = item.split("=")[0];
      let part2 = item.split("=")[1];
      if (part1 == "CityHide") return;
      resDel += part1 + ": ";
      resDel += part1 == "PhoneNumber" ? `+91 ${part2}` : part2;
      resDel += "\n";
    });
    const mailTo = "marina.wei@kreditone.in";
    const A = $(
      `<a href='mailto:${mailTo}?subject=Customer&body=${encodeURIComponent(
        resDel
      ).replace(/%2540/, "@")}' target='_blank'></a>`
    ).appendTo("body");
    Alert.show(
      "Dear customer, Thanks for early sign up, We will contact you soon!"
    );
    setTimeout(() => {
      A.get(0).click();
      A.remove();
    }, 500);
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

  $('input[type="text"]').on("input", function(evt) {
    if ($(this).attr("name") == "Name") {
      $(this).val(evt.target.value.replace(/[^a-zA-Z]/g, ""));
    } else {
      $(this).val(evt.target.value.replace(/[^a-zA-Z-_\s\d]/g, ""));
    }
  });

  $('input[type="email"]').on("input", function(evt) {
    var pattern = new RegExp(
      "[`~!#%$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]",
      "g"
    );
    $(this).val(evt.target.value.replace(pattern, ""));
  });

  $("#phoneNumber").on("input", function(evt) {
    $(this).val(evt.target.value.replace(/[^\d]/g, ""));
  });

  // select city
  $("#selectCitySelect").on("change", function() {
    let val = $(this).val();
    $(this).css("color", val ? "black" : "#999");
  });

  // launch time
  function calcLunchTime() {
    const day1 = $("#day1");
    const day2 = $("#day2");
    const now = Date.now();
    const launchTime = new Date(2019, 9, 7).valueOf();
    const diff = launchTime - now;
    function setTime(d1, d2) {
      day1.text(d1);
      day2.text(d2);
    }
    if (diff <= 0) {
      setTime(0, 0);
    } else {
      const diffDay = Math.ceil(diff / 3600 / 1000 / 24).toString();
      console.log(diffDay);
      setTime(diffDay.split("")[0], diffDay.split("")[1]);
    }
  }

  // start time
  calcLunchTime();
  setInterval(calcLunchTime, 1 * 1000 * 3600);

  // nav bar scroll
  $(".navbar-nav a").on("click", function(ev) {
    if (/^\//.test($(this).attr("href"))) return;
    ev.preventDefault();
    let target = $(this)
      .attr("href")
      .substring("1");
    window.scrollTo({
      top: $(`#${target}`).offset().top,
      left: 0,
      behavior: "smooth"
    });
  });

  function scrollFuc() {
    const scrollTop = $(window).scrollTop();
    const $top = $("#back-to-top");
    const isShow = $top.css("display") !== "none";
    if (scrollTop >= 2 * screenHeight && !isShow) {
      $top.fadeIn();
    } else if (scrollTop < 2 * screenHeight && isShow) {
      $top.fadeOut();
    }
  }

  // listen scroll
  $(window).on("scroll", throttle(scrollFuc, 50));

  // to Top
  $("#back-to-top").click(function() {
    $("html, body").animate({ scrollTop: 0 }, 300, "linear");
  });

  // home fitst screen
  function homeFullScreen() {
    if (!isMobile()) {
      const totalHeight = 144;
      const clinetHeight = $(window).height();
      const restHeight = clinetHeight - totalHeight;
      if (restHeight > 638 || restHeight < 900) {
        $("#home").height(restHeight);
      }
    }
  }
  homeFullScreen();

  // visiter and download
  $("#visiter").text(RegNum(2000000));
  $("#download").text(RegNum(2000000));

  let toggle = true;
  // form toggle
  $("#toggleInput").on("click", function() {
    $(".select-arrow").toggleClass("hide");
    $("#selectCityInput").toggleClass("hide");
    if (toggle) {
      $("#selectCitySelect").attr("name", "CityHide");
      $("#selectCityInput").attr("name", "City");
    } else {
      $("#selectCitySelect").attr("name", "City");
      $("#selectCityInput").attr("name", "CityHide");
    }
    toggle = false;
  });
});

export default {};
