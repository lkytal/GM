// ==UserScript==
// @name					Open Discuz Link in new tab
// @description				Discuz论坛链接默认新标签页打开
// @author					lkytal
// @namespace				Lkytal
// @version					1.3.4
// @homepage				https://lkytal.github.io/
// @homepageURL				https://lkytal.github.io/GM
// @license					AGPL
// @icon					https://github.com/lkytal/GM/raw/master/icons/def.ico
// @include					http://*/forum-*-*
// @include					http://*/forum-*-*.html
// @include					http://*/showforum-*.html
// @include					http://*/forum.php?mod=forumdisplay*
// @include					http://*/forum/viewforum.php?f=*
// @include					http://*/forum/search.php?*
// @include					http://*/forumdisplay.php?f=
// @include					https://*/forum-*-*
// @include					https://*/forum-*-*.html
// @include					https://*/showforum-*.html
// @include					https://*/forum.php?mod=forumdisplay*
// @include					https://*/forum/viewforum.php?f=*
// @include					https://*/forum/search.php?*
// @include					https://*/forumdisplay.php?f=
// @grant					unsafeWindow
// @run-at					document-end
// @charset					UTF-8
// @supportURL				https://github.com/lkytal/GM/issues
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/discuz_in_tab.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/discuz_in_tab.user.js
// ==/UserScript==

var x = document.getElementById("atarget");

if (x) {
	//x.click();
	unsafeWindow.setatarget(1);
}
else {
	var AFile = document.querySelectorAll('#threadlist tbody a, #threadslist tbody a');

	for (var i = AFile.length - 1; i > -1; i--) {
		AFile[i].setAttribute("target", "_blank");
	}
}
