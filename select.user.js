// ==UserScript==
// @name					Select like opera
// @namespace				lkytal
// @author					lkytal
// @homepage				http://lkytal.github.io/
// @icon					http://lkytal.qiniudn.com/ic.ico
// @version					1.0.2
// @description				Select like opera
// @include					*
// @grant					unsafeWindow
// @grant					GM_getValue
// @grant					GM_setValue
// @homepageURL				https://git.oschina.net/coldfire/GM
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/select.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/select.user.js
// ==/UserScript==

selectLikeOpera = function() {
	var f = function(a) {
		if (a.nodeType === 3) a = a.parentNode;
		do {
			if (a.constructor === HTMLAnchorElement) return a;
		} while ((a = a.parentNode) && a !== document.body);
		return null;
	};
	
	var g = function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	
	var h = (function() {
		var w = typeof InstallTrigger === 'undefined';
		return {
			qq: function(x, y) {
				if (w) {
					return document.caretRangeFromPoint(x, y)
				}
				else
				{
					var a = document.createRange();
					var p = document.caretPositionFromPoint(x, y);
					a.setStart(p.offsetNode, p.offset);
					return a;
				}
				return null
			},
			qr: ((w ? '-webkit-' : '-moz-') + 'user-select')
		}
	})();
	
	var j = (function() {
		var o = [{
			p: h.qr,
			v: 'text'
		}, {
			p: 'outline-width',
			v: 0
		}];
		var n;
		var s;
		return function(a) {
			if (a) {
				n = a, s = [];
				for (var i = o.length - 1; i >= 0; i -= 1) {
					s.push([n.style.getPropertyValue(o[i].p), n.style.getPropertyPriority(o[i].p)]);
					n.style.setProperty(o[i].p, o[i].v, 'important');
				}
			}
			else if (n)
			{
				for (var i = o.length; i-- > 0;) {
					n.style.removeProperty(o[i].p);
					if (s[i][0] !== null) n.style.setProperty(o[i].p, s[i][0], s[i][1]);
				}
				n = s = null
			}
		}
	})();
	
	var toggleEvent = function(a, b) {
		if (b === undefined) b = true;
		if (a.constructor !== Array) a = [a];

		for (var i = 0, len = a.length; i < len; i += 1)
		{
			if (b)
			{
				document.addEventListener(a[i], E[a[i]], true);
			}
			else
			{
				document.removeEventListener(a[i], E[a[i]], true);
			}
		}
	};
	
	var removeEvent = function(a) {
		toggleEvent(a, false);
	};
	
	var m, q, u, v, z, A = function() {
		q = v = true;
		u = z = false;
	};
	
	var B, s = document.getSelection();
	
	selectEvent = function(e) {
		if (e.which < 2) {
			A();
			var x = e.clientX,
				y = e.clientY;
			if (s.rangeCount > 0) {
				var a = s.getRangeAt(0);
				if (!a.collapsed) {
					var r = h.qq(x, y);
					if (r && a.isPointInRange(r.startContainer, r.startOffset)) return;
				}
			}
			j();
			var t = e.target,
				n = f(t);
			if (!n) n = t.nodeType !== 3 ? t : t.parentNode;
			if (n.constructor === HTMLCanvasElement || n.textContent === '') return;
			var r = n.getBoundingClientRect();
			B = {
				n: n,
				x: Math.round(r.left),
				y: Math.round(r.top),
				c: 0
			};
			m = {
				x: x,
				y: y
			};
			toggleEvent(['mousemove', 'mouseup', 'dragend', 'dragstart']);
			j(n);
		}
	};
	
	var D = 3,
		K = 0.8,
		E = {
			'mousemove': function(e) {
				if (B) {
					if (B.c++ < 12) {
						var r = B.n.getBoundingClientRect();
						if (Math.round(r.left) !== B.x || Math.round(r.top) !== B.y) {
							removeEvent(['mousemove', 'mouseup', 'dragend', 'dragstart', 'click']);
							j();
							s.removeAllRanges();
							return;
						}
					} else {
						B = null;
					}
				}
				var x = e.clientX,
					y = e.clientY;
				if (v) {
					s.removeAllRanges();
					var a = x > m.x ? -2 : 2;
					var b = h.qq(x + a, y);
					if (b) {
						s.addRange(b);
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
					var b = h.qq(x, y);
					if (b) s.extend(b.startContainer, b.startOffset);
				}
			},
			'dragstart': function(e) {
				removeEvent('dragstart');
				if (u) return g(e);
			},
			'mouseup': function(e) {
				removeEvent(['mousemove', 'mouseup', 'dragstart', 'dragend']);
				if (!u && z) z = false;
				setTimeout(function() {
					removeEvent('click');
				}, 111);
			},
			'dragend': function(e) {
				removeEvent(['dragend', 'mousemove', 'mouseup']);
			},
			'click': function(e) {
				removeEvent('click');
				if (z) return g(e);
			}
		};

	document.addEventListener('mousedown', selectEvent, true);
};

setTimeout(selectLikeOpera, 300);
