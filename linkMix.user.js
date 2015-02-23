// ==UserScript==
// @name						Text To link
// @description					Turn plain text URLs into clickable links, linkify with high speed & accuracy 把文字链接转换为可点击链接
// @author						lkytal
// @namespace					Lkytal
// @homepage					http://lkytal.github.io/
// @include						*
// @exclude						*pan.baidu.com/*
// @exclude						*renren.com/*
// @exclude						*exhentai.org/*
// @eexclude					*music.google.com/*
// @eexclude					*mail.google.com/*
// @eexclude					*docs.google.com/*
// @eexclude					*www.google.com/*
// @version						2.6.5
// @icon						http://lkytal.qiniudn.com/ic.ico
// @grant						unsafeWindow
// @homepageURL					https://git.oschina.net/coldfire/GM
// @updateURL					https://git.oschina.net/coldfire/GM/raw/master/meta/linkMix.meta.js
// @downloadURL					https://git.oschina.net/coldfire/GM/raw/master/linkMix.user.js
// ==/UserScript==

"use strict";
var excludedTags, filter, linkMixInit, linkPack, linkify, observePage, observer, setHttp, setLink, url_regexp, xpath;

url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/]|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;

setHttp = function(event) {
  var url;
  url = event.target.getAttribute("href");
  if (url.indexOf("http") !== 0 && url.indexOf("ed2k://") !== 0 && url.indexOf("thunder://") !== 0) {
    return event.target.setAttribute("href", "http://" + url);
  }
};

if (typeof exportFunction !== "undefined" && exportFunction !== null) {
  exportFunction(setHttp, unsafeWindow, {
    defineAs: "setHttp"
  });
} else {
  unsafeWindow.setHttp = setHttp;
}

setLink = function(candidate) {
  var span, text;
  if ((candidate == null) || candidate.parentNode.className.indexOf("texttolink") !== -1 || candidate.nodeName === "#cdata-section") {
    return;
  }
  text = candidate.textContent.replace(url_regexp, '<a href="$1" target="_blank" class="texttolink" onmouseover="setHttp(event);">$1</a>');
  if (candidate.textContent.length === text.length) {
    return;
  }
  span = document.createElement("span");
  span.innerHTML = text;
  return candidate.parentNode.replaceChild(span, candidate);
};

excludedTags = "a,svg,canvas,applet,input,button,area,pre,embed,frame,frameset,head,iframe,img,option,map,meta,noscript,object,script,style,textarea,code".split(",");

xpath = "//text()[not(ancestor::" + (excludedTags.join(') and not(ancestor::')) + ")]";

filter = new RegExp("^(" + (excludedTags.join('|')) + ")$", "i");

linkPack = function(result, start) {
  var i, j, k, ref, ref1, ref2, ref3;
  if (start + 10000 < result.snapshotLength) {
    for (i = j = ref = start, ref1 = start + 10000; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      setLink(result.snapshotItem(i));
    }
    setTimeout(function() {
      return linkPack(result, start + 10000);
    }, 15);
  } else {
    for (i = k = ref2 = start, ref3 = result.snapshotLength; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
      setLink(result.snapshotItem(i));
    }
  }
};

linkify = function(doc) {
  var result;
  result = document.evaluate(xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  return linkPack(result, 0);
};

observePage = function(root) {
  var tW;
  tW = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(a) {
      if (!filter.test(a.parentNode.localName)) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  }, false);
  while (tW.nextNode()) {
    setLink(tW.currentNode);
  }
};

observer = new window.MutationObserver(function(mutations) {
  var Node, j, k, len, len1, mutation, ref;
  for (j = 0, len = mutations.length; j < len; j++) {
    mutation = mutations[j];
    if (mutation.type === "childList") {
      ref = mutation.addedNodes;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        Node = ref[k];
        observePage(Node);
      }
    }
  }
});

linkMixInit = function() {
  if (window !== window.top || window.document.title === "") {
    return;
  }
  linkify(document.body);
  return observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

setTimeout(linkMixInit, 100);
