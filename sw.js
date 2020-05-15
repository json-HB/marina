/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gulp-pwa"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bootstrap.css",
    "revision": "0e994e0cb5792fa56841af26abede539"
  },
  {
    "url": "fqa.html",
    "revision": "ae3c5577f3c1c23aa1d1e74d72b89b3c"
  },
  {
    "url": "images/bank1.png",
    "revision": "36261e0f73f59de96e639e6e5a2cb9d1"
  },
  {
    "url": "images/bottom.jpg",
    "revision": "9d935157e42f27e13e6173d9a3772ee7"
  },
  {
    "url": "images/custom1.png",
    "revision": "bd5169c27f9e35dd5650705494f4df52"
  },
  {
    "url": "images/custom2.png",
    "revision": "f9c296301022670dfbd1ae599ea3c5f9"
  },
  {
    "url": "images/custom3.png",
    "revision": "2e07bcd0a73624de6db10ca7bf3af8f1"
  },
  {
    "url": "images/google-play.png",
    "revision": "60f28f2e7487bc6add33f20c3724a89c"
  },
  {
    "url": "images/google-white.png",
    "revision": "13b625b20bb99b7901041994358fe482"
  },
  {
    "url": "images/happy.png",
    "revision": "b25839f9760a6b37cbb6e8fa424e2a5a"
  },
  {
    "url": "images/icon-arrow.png",
    "revision": "6d69003b98430e6a76651bb73081088f"
  },
  {
    "url": "images/icon-facebook.png",
    "revision": "6a4d80794725d35ace70fee594c56ca3"
  },
  {
    "url": "images/icon-instagram.png",
    "revision": "a7c4212ba84b72513004ecf7ebf98ddc"
  },
  {
    "url": "images/icon-money.png",
    "revision": "4a47a9180042785476058f96b2704c91"
  },
  {
    "url": "images/icon-ok.png",
    "revision": "812f332d412da446756a9ce9ce28b0d9"
  },
  {
    "url": "images/icon-person-add.png",
    "revision": "54907836c84e511351ee7dcd494c7fad"
  },
  {
    "url": "images/icon-right.png",
    "revision": "d373c8f9d39b2025431daf776bb5eaf4"
  },
  {
    "url": "images/icon-security.png",
    "revision": "0f663d3e2dd63307e62b302ce11c4835"
  },
  {
    "url": "images/icon-time.png",
    "revision": "2f744efd98e24483e7047b2937bf71c6"
  },
  {
    "url": "images/icon-wallet.png",
    "revision": "523a65966b2851c133ee56bf179aef4e"
  },
  {
    "url": "images/icon-write.png",
    "revision": "6a0a4f6aea0e26d59d71e3219b3a33fd"
  },
  {
    "url": "images/logo.png",
    "revision": "9ba9995b59ac60cdc2923c21361f3285"
  },
  {
    "url": "images/map.png",
    "revision": "019ef428386c298fc152b89ea72329ef"
  },
  {
    "url": "images/people.png",
    "revision": "a5cf6c912489a0d9f38f33d4f86d0592"
  },
  {
    "url": "images/phone.png",
    "revision": "7c78e75120cf0e56afb4f2b549990626"
  },
  {
    "url": "images/qr-code.png",
    "revision": "24c5b906dd6d49692d4fa1aea65bb9cf"
  },
  {
    "url": "images/time.png",
    "revision": "ffcf0def9c65926c9e01b60b6429b3f1"
  },
  {
    "url": "jquery.js",
    "revision": "0b7376bf8aebb21a3959747fa341da9b"
  },
  {
    "url": "js/fqa.js",
    "revision": "efadd85f5086e43bb2326ba4add30b88"
  },
  {
    "url": "js/index.js",
    "revision": "10443d747bbb944654ff6f6180845c17"
  },
  {
    "url": "js/manifest.js",
    "revision": "430ece2616b629a9d725b6b331146b41"
  },
  {
    "url": "js/personLoan.js",
    "revision": "7634216ad1110e89e8c3970a7e00dde9"
  },
  {
    "url": "js/privacy-policy.js",
    "revision": "a44ec60b3a6fc30df9a1db4a3c3a8370"
  },
  {
    "url": "js/team.js",
    "revision": "48389496fea1eb065fd3704411e29a43"
  },
  {
    "url": "js/vendors-faskclick.js",
    "revision": "235e14af26cb1bbb2e4e363d812a5f77"
  },
  {
    "url": "personLoan.html",
    "revision": "c904028ad2653dc50fed2ac650b5f23b"
  },
  {
    "url": "privacy-policy.html",
    "revision": "18c90c8ea4f4a469a4aa4332ebd4e44e"
  },
  {
    "url": "team.html",
    "revision": "099ccb27cad6c4ef471b28de6990402b"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/jquery\.js/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/bootstrap\.css$/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/.*\.js/, new workbox.strategies.NetworkFirst(), 'GET');
workbox.routing.registerRoute(/.*\.css/, new workbox.strategies.StaleWhileRevalidate({ plugins: [{ cacheableResponse: { statuses: [ 0, 200 ] } }] }), 'GET');
workbox.routing.registerRoute(/.*\.(?:png|jpg|jpeg|svg|gif)/, new workbox.strategies.CacheFirst({ "cacheName":"jason-image", plugins: [{ expiration: { maxAgeSeconds: 86400, maxEntries: 50 } }] }), 'GET');
workbox.routing.registerRoute(/.*\.html/, new workbox.strategies.NetworkFirst(), 'GET');
