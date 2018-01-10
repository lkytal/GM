// ==UserScript==
// @name						Text To link
// @description					Turn plain text URLs into clickable links
// @description:zh				把文字链接转换为可点击链接
// @author						lkytal
// @namespace					Lkytal
// @version						2.8.4
// @homepage					https://lkytal.github.io/
// @homepageURL					https://lkytal.github.io/coldfire/GM
// @license						LGPL
// @include						*
// @exclude						*pan.baidu.com/*
// @exclude						*renren.com/*
// @exclude						*exhentai.org/*
// @exclude						*music.google.com/*
// @exclude						*play.google.com/music/*
// @exclude						*mail.google.com/*
// @exclude						*docs.google.com/*
// @exclude						*www.google.*
// @exclude						*acid3.acidtests.org/*
// @exclude						*.163.com/*
// @exclude						*.alipay.com/*
// @run-at						document-end
// @icon						http://lkytal.qiniudn.com/link.png
// @grant						unsafeWindow
// @charset						UTF-8
// @supportURL					https://github.com/lkytal/GM/issues
// @updateURL					https://git.oschina.net/coldfire/GM/raw/master/meta/linkMix.meta.js
// @downloadURL					https://git.oschina.net/coldfire/GM/raw/master/linkMix.user.js
// ==/UserScript==

"use strict";
;
var clearLink, excludedTags, linkFilter, linkMixInit, linkPack, linkify, observePage, observer, setLink, urlPrefixes, url_regexp, xPath;

url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/]|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc|gov|edu))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;

urlPrefixes = ['http://', 'https://', 'ftp://', 'thunder://', 'ed2k://'];

clearLink = function (event) {
  var j, len, link, prefix, ref, url;
  link = (ref = event.originalTarget) != null ? ref : event.target;
  if (!(link != null && link.localName === "a" && link.className.indexOf("textToLink") !== -1)) {
    return;
  }
  url = link.getAttribute("href");
  //console.log url
  for (j = 0, len = urlPrefixes.length; j < len; j++) {
    prefix = urlPrefixes[j];
    if (url.indexOf(prefix) === 0) {
      return;
    }
  }
  return link.setAttribute("href", "http://" + url);
};

document.addEventListener("mouseover", clearLink);

setLink = function (candidate) {
  var span, text;
  if (candidate == null || candidate.parentNode.className.indexOf("textToLink") !== -1 || candidate.nodeName === "#cdata-section") {
    return;
  }
  text = candidate.textContent.replace(url_regexp, '<a href="$1" target="_blank" class="textToLink">$1</a>');
  if (candidate.textContent.length === text.length) {
    return;
  }
  span = document.createElement("span");
  span.innerHTML = text;
  return candidate.parentNode.replaceChild(span, candidate);
};

excludedTags = "a,svg,canvas,applet,input,button,area,pre,embed,frame,frameset,head,iframe,img,option,map,meta,noscript,object,script,style,textarea,code".split(",");

xPath = '//text()[not(ancestor::' + excludedTags.join(') and not(ancestor::') + ')]';

linkPack = function (result, start) {
  var i, j, k, ref, ref1, ref2, ref3, startTime;
  startTime = Date.now();
  while (start + 10000 < result.snapshotLength) {
    for (i = j = ref = start, ref1 = start + 10000; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      setLink(result.snapshotItem(i));
    }
    start += 10000;
    if (Date.now() - startTime > 2500) {
      return;
    }
  }
  for (i = k = ref2 = start, ref3 = result.snapshotLength; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
    setLink(result.snapshotItem(i));
  }
};

linkify = function (node) {
  var result;
  result = document.evaluate(xPath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  return linkPack(result, 0);
};

linkFilter = function (node) {
  var j, len, tag;
  for (j = 0, len = excludedTags.length; j < len; j++) {
    tag = excludedTags[j];
    if (tag === node.parentNode.localName.toLowerCase()) {
      return NodeFilter.FILTER_REJECT;
    }
  }
  return NodeFilter.FILTER_ACCEPT;
};

observePage = function (root) {
  var tW;
  tW = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { //+ NodeFilter.SHOW_ELEMENT,
    acceptNode: linkFilter
  }, false);
  while (tW.nextNode()) {
    setLink(tW.currentNode);
  }
};

observer = new window.MutationObserver(function (mutations) {
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

linkMixInit = function () {
  if (window !== window.top || window.document.title === "") {
    return;
  }
  //console.time('a')
  linkify(document.body);
  //console.timeEnd('a')
  return observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

setTimeout(linkMixInit, 100);