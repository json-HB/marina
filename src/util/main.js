export function isMobile() {
  var userAgentInfo = navigator.userAgent;

  var mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  ];

  var mobile_flag = false;

  //根据userAgent判断是否是手机
  for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }

  var screen_width = window.screen.width;
  var screen_height = window.screen.height;

  //根据屏幕分辨率判断是否是手机
  if (screen_width < 500 && screen_height < 800) {
    mobile_flag = true;
  }

  return mobile_flag;
}

export const RegNum = function(str) {
  str = String(str);
  return str
    .replace(/(\d)(?=(?:\d{3})$)/g, "$1,")
    .replace(/(\d)(?=(?:\d{2})+,\d{3}$)/g, "$1,");
};

export const throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

const AlertDom = `<div class='alert'>
  <p class='alert-content'></p>
  <span class='alert-close'>X</sann>
</div>`;

export const Alert = {
  timer: null,
  show(content, opt = {}) {
    if ($(".alert").get(0) == void 0) {
      $("body").append(AlertDom);
    }
    const $alert = $(".alert");
    clearTimeout(this.timer);
    $alert.find(".alert-content").text(content);
    setTimeout(() => {
      $alert.addClass("show");
    }, 2);
    this.timer = setTimeout(() => {
      this.close();
    }, opt.time || 5000);
    $(".alert-close").on("click", this.close);
  },
  close() {
    $(".alert").removeClass("show");
    clearTimeout(this.timer);
  }
};

export function getUrl() {
  $(".downloadApp").attr("href", "http://www.kreditone.in/kreditone.apk");
  // $.get(
  //   "http://haibo.online:3007/url",
  //   function(data) {
  //     if (data.code == "0") {
  //       $(".downloadApp").attr("href", data.url);
  //     } else {
  //       $(".downloadApp").attr(
  //         "href",
  //         "https://kreditone-dev.oss-cn-shenzhen.aliyuncs.com/kreditone.apk"
  //       );
  //     }
  //   },
  //   "json"
  // );
}
