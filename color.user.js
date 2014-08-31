// ==UserScript==
// @name					Blue Light Filter
// @namespace				lkytal
// @author					lkytal
// @homepage				http://coldfire.qiniudn.com/
// @icon					http://lkytal.qiniudn.com/ic.ico
// @version					1.0.4
// @description				减低页面的亮度，快捷键：Alt+上/下调节亮度，Alt+F5开关遮罩
// @include					*
// @grant					GM_addStyle
// @grant					unsafeWindow
// @grant					GM_getValue
// @grant					GM_setValue
// @homepageURL				https://git.oschina.net/coldfire/GM
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/color.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/color.user.js
// ==/UserScript==

"use strict";
var brightness, cover, delta, showCover;

showCover = function() {
  var cover;
  if (brightness < 0) {
    if (cover) {
      cover.style.display = "none";
    }
    return;
  }
  if (!cover) {
    cover = document.createElement("div");
    cover.setAttribute("style", "position:fixed;top:0;left:0;width:0;height:0;outline:3000px solid;z-index:10240;");
    document.body.appendChild(cover);
  } else {
    cover.style.display = "block";
  }
  cover.style.outlineColor = "rgba(170, 250, 0, " + brightness + ")";
};

brightness = localStorage["brightness"] || 0.015;

cover = null;

delta = 0.005;

window.addEventListener("keydown", function(e) {
  if (e.altKey && e.keyCode === 116) {
    showCover(brightness = -brightness);
  } else {
    if (brightness < 0) {
      return;
    }
    if (e.altKey && e.keyCode === 38) {
      if (brightness - delta > 0) {
        showCover(brightness -= delta);
      }
    } else {
      if (e.altKey && e.keyCode === 40) {
        if (brightness + delta < 1) {
          showCover(brightness += delta);
        }
      }
    }
  }
  localStorage["brightness"] = brightness;
}, false);

showCover();
