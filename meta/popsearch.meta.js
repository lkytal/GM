// ==UserScript==
// @name					Popup Search
// @name:zh					Popup Search: 快捷搜索
// @author					lkytal
// @namespace				Lkytal
// @version					5.0.1
// @icon					https://github.com/lkytal/GM/raw/master/icons/search.png
// @homepage				https://lkytal.github.io/
// @homepageURL				https://lkytal.github.io/GM
// @description				Popup search box and translate button (etc) for selected texts
// @description:zh			为选中文字弹出搜索和翻译的快捷按钮
// @license					AGPL
// @include					*
// @exclude					*/test/*.html*
// @exclude					http://acid3.acidtests.org/*
// @exclude					http://www.acfun.tv/*
// @exclude					http://www.sf-express.com/*
// @exclude					http://furk.net/*
// @connect					google.com
// @connect					google.cn
// @grant					GM_xmlhttpRequest
// @grant					GM_addStyle
// @grant					GM_openInTab
// @grant					GM_setClipboard
// @grant					GM_download
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_registerMenuCommand
// @grant					GM_info
// @run-at					document-end
// @inject-into				auto
// @require					https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @connect					google.com
// @connect					translate.google.cn
// @charset					UTF-8
// @supportURL				https://github.com/lkytal/GM/issues
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/popsearch.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/popsearch.user.js
// ==/UserScript==