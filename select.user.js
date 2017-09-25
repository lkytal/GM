// ==UserScript==
// @name					Select like opera
// @namespace				lkytal
// @author					lkytal
// @homepage				https://lkytal.github.io/
// @icon					http://lkytal.qiniudn.com/select.png
// @version					1.2.0
// @description				Select texts insider links, support firefox and chrome
// @include					*
// @grant					unsafeWindow
// @grant					GM_getValue
// @grant					GM_setValue
// @homepageURL				https://git.oschina.net/coldfire/GM
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/select.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/select.user.js
// ==/UserScript==

var selectLikeOpera = function () {
	var findHTMLAnchor = function (node) {
		if (node.nodeType === 3) node = node.parentNode;
		do {
			if (node.constructor === HTMLAnchorElement) return node;
		} while ((node = node.parentNode) && node !== document.body);
		return null;
	};

	var preventEvent = function (e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	var rangeOperator = (function () {
		var notFirefox = navigator.userAgent.indexOf("Firefox") == -1;

		return {
			createRange: function (x, y) {
				if (notFirefox) {
					return document.caretRangeFromPoint(x, y);
				}
				else {
					var range = document.createRange();
					var position = document.caretPositionFromPoint(x, y);
					range.setStart(position.offsetNode, position.offset);
					return range;
				}
			},
			rangeAttr: (notFirefox ? '-webkit-user-select' : '-moz-user-select')
		}
	})();

	var j = (function () {
		var o = [
			{
				p: rangeOperator.rangeAttr,
				v: 'text'
			},
			{
				p: 'outline-width',
				v: 0
			}
		];

		var n;
		var s;
		return function (a) {
			if (a) {
				n = a, s = [];
				for (var i = o.length - 1; i >= 0; i -= 1) {
					s.push([n.style.getPropertyValue(o[i].p), n.style.getPropertyPriority(o[i].p)]);
					n.style.setProperty(o[i].p, o[i].v, 'important');
				}
			}
			else if (n) {
				for (var i = o.length; i-- > 0;) {
					n.style.removeProperty(o[i].p);
					if (s[i][0] !== null) n.style.setProperty(o[i].p, s[i][0], s[i][1]);
				}
				n = s = null;
			}
		}
	})();

	var toggleEvent = function (events, bAdd) {
		if (bAdd === undefined) bAdd = true;
		if (events.constructor !== Array) events = [events];

		for (var i = 0, len = events.length; i < len; i += 1) {
			if (bAdd) {
				document.addEventListener(events[i], eventList[events[i]], true);
			}
			else {
				document.removeEventListener(events[i], eventList[events[i]], true);
			}
		}
	};

	var removeEvent = function (a) {
		toggleEvent(a, false);
	};

	var m, q, u, v, z, resetState = function () {
		q = v = true;
		u = z = false;
	};

	var B, selection = document.getSelection();

	let selectEvent = function (e) {
		if (e.which < 2) {
			resetState();
			var x = e.clientX,
				y = e.clientY;
			if (selection.rangeCount > 0) {
				var selectedRange = selection.getRangeAt(0);
				if (!selectedRange.collapsed) {
					var newRange = rangeOperator.createRange(x, y);
					if (newRange && selectedRange.isPointInRange(newRange.startContainer, newRange.startOffset)) return;
				}
			}
			j();
			var target = e.target;
			var node = findHTMLAnchor(target);
			if (!node) node = target.nodeType !== 3 ? target : target.parentNode;
			if (node.constructor === HTMLCanvasElement || node.textContent === '') return;
			var range = node.getBoundingClientRect();
			B = {
				n: node,
				x: Math.round(range.left),
				y: Math.round(range.top),
				c: 0
			};
			m = {
				x: x,
				y: y
			};
			toggleEvent(['mousemove', 'mouseup', 'dragend', 'dragstart']);
			j(node);
		}
	};

	var D = 3, K = 0.8;
	var eventList = {
		'mousemove': function (e) {
			if (B) {
				if (B.c++ < 12) {
					var r = B.n.getBoundingClientRect();
					if (Math.round(r.left) !== B.x || Math.round(r.top) !== B.y) {
						removeEvent(['mousemove', 'mouseup', 'dragend', 'dragstart', 'click']);
						j();
						selection.removeAllRanges();
						return;
					}
				} else {
					B = null;
				}
			}
			var x = e.clientX,
				y = e.clientY;
			if (v) {
				selection.removeAllRanges();
				var a = x > m.x ? -2 : 2;
				var newRange = rangeOperator.createRange(x + a, y);
				if (newRange) {
					selection.addRange(newRange);
					v = false;
				}
			}
			if (q) {
				var c = Math.abs(m.x - x),
					d = Math.abs(m.y - y);
				u = d === 0 || c / d > K;
				if (c > D || d > D) {
					q = false;
					z = true;
					toggleEvent('click');
				}
			}
			if (u) {
				var newRange = rangeOperator.createRange(x, y);
				if (newRange) selection.extend(newRange.startContainer, newRange.startOffset);
			}
		},
		'dragstart': function (e) {
			removeEvent('dragstart');
			if (u) return preventEvent(e);
		},
		'mouseup': function (e) {
			removeEvent(['mousemove', 'mouseup', 'dragstart', 'dragend']);
			if (!u && z) z = false;
			setTimeout(function () {
				removeEvent('click');
			}, 111);
		},
		'dragend': function (e) {
			removeEvent(['dragend', 'mousemove', 'mouseup']);
		},
		'click': function (e) {
			removeEvent('click');
			if (z) return preventEvent(e);
		}
	};

	document.addEventListener('mousedown', selectEvent, true);
};

setTimeout(selectLikeOpera, 100);
