import "./preboot";
import "./css/main/index.less";
import { throttle } from "util";
import carouseTpl from "ejs/carouse.ejs";
import carouseData from "static/carouse.json";
import { isMobile } from "./util/main";

const { log } = console;

$(function() {
  $(".bouncing-loader").addClass("hidden");

  // screenHeight
  const screenHeight = $(window).height();

  // 调试carouse
  // $(".carousel").carousel({
  //   interval: 1000000
  // });

  // carouse render
  Object.assign(carouseData, {
    isMobile: isMobile()
  });
  log(carouseData);
  log(carouseTpl(carouseData));
  $("#carousel-jason").html(carouseTpl(carouseData));

  // form submit
  $("form").submit(ev => {
    ev.preventDefault();
    console.log("submit");
    const res = $("form").serialize();
    let resDel = "";
    res.split("&").forEach(item => {
      resDel += item.split("=")[0] + ": ";
      resDel +=
        (item.split("=")[0] == "PhoneNumber"
          ? `+91 ${item.split("=")[1]}`
          : item.split("=")[1]) + "\n";
    });
    const mailTo = "marina.wei@kreditone.in";
    log(encodeURIComponent(resDel).replace(/%40/, "@"));
    const A = $(
      `<a href='mailto:${mailTo}?subject=Customer&body=${encodeURIComponent(
        resDel
      ).replace(/%2540/, "@")}' target='_blank'></a>`
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

  // nav bar scroll
  $(".navbar-nav a").on("click", function(ev) {
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

  // mobile phone
  const isPhone = $(document).width() < 500;

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
});
