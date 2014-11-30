// ==UserScript==
// @name					Popup Search
// @author					lkytal
// @namespace				Lkytal
// @homepage				http://coldfire.qiniudn.com/
// @description				Popup Search Box and translate Button (etc) for selected Text
// @include					*
// @exclude					*/test/index.html*
// @require					http://code.jquery.com/jquery-2.1.1.min.js
// @version					2.9.2
// @icon					http://lkytal.qiniudn.com/ic.ico
// @grant					GM_xmlhttpRequest
// @grant					GM_addStyle
// @grant					unsafeWindow
// @grant					GM_openInTab
// @grant					GM_setClipboard
// @grant					GM_getClipboard
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_registerMenuCommand
// @charset					UTF-8
// @homepageURL				http://git.oschina.net/coldfire/GM
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/meta/popsearch.meta.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/popsearch.user.js
// ==/UserScript==

"use strict";
var GetOpt, InTextBox, Init, Load, OpenSet, SaveOpt, SetOpt, SettingWin, ShowBar, TimeOutHide, addCSS, ajaxTranslation, fixPos, getLastRange, get_offsets_and_remove, get_selection_offsets, popData, praseTranslation,
  __hasProp = {}.hasOwnProperty;

popData = {
  ajax: []
};

fixPos = function(sel, e) {
  var fix, m_left, offsetLeft, offsetTop, offsets;
  offsets = get_selection_offsets(sel);
  offsetTop = offsets[0];
  offsetLeft = offsets[1];
  if (e != null) {
    if (Math.abs(offsetLeft - e.pageX) > 120) {
      offsetLeft = e.pageX;
    }
    if (Math.abs(offsetTop - e.pageY) > 120) {
      offsetLeft = e.pageY - 8;
    }
  } else {
    $('#showupbody').css('margin-left', '60px');
  }
  if (GetOpt('Dis_st')) {
    offsetTop = offsetTop - 2 - $('#ShowUpBox').height();
    if ((offsetTop - document.documentElement.scrollTop) < 40) {
      offsetTop = document.documentElement.scrollTop + 40;
    }
  } else {
    offsetTop += 1.1 * offsets[2];
  }
  m_left = $('#ShowUpBox').width();
  fix = 0;
  if (offsetLeft - m_left < 4) {
    fix = 4 - offsetLeft + m_left;
  }
  $('#ShowUpBox').css("top", offsetTop + "px").css("left", (offsetLeft - m_left + fix) + "px");
  return $('#popuptip').css('margin-left', m_left - 20 - fix);
};

$(document).mousedown(function(event) {
  if (popData.bTrans === 1) {
    Init();
  }
  return $('#ShowUpBox').hide();
});

TimeOutHide = function() {
  if (popData.mouseIn === 0 && GetOpt("Fade_st") && !popData.bTrans) {
    return $('#ShowUpBox').fadeOut(600);
  }
};

Init = function() {
  var $DivBox, UIList, id, opt;
  $('#ShowUpBox').remove();
  $('body').append("<span id=\"ShowUpBox\">\n	<span id=\"showupbody\">\n		<span id=\"popupwapper\" />\n		<span id=\"Gspan\" />\n	</span>\n</span>");
  $DivBox = $('#ShowUpBox');
  $DivBox.hide();
  if (!GetOpt("Round_st")) {
    $('#showupbody').css("border-radius", "4px");
  }
  $DivBox.on("mouseup", function(event) {
    event.stopPropagation();
    if (event.which === 3) {
      event.preventDefault();
      GM_setClipboard(document.defaultView.getSelection().toString());
      $('#ShowUpBox').remove();
      Init();
      return false;
    } else if (event.which === 2) {
      event.preventDefault();
      return GM_openInTab(document.defaultView.getSelection().toString());
    }
  });
  document.getElementById("ShowUpBox").oncontextmenu = function(event) {
    return false;
  };
  $DivBox.on("mousedown", function(event) {
    return event.stopPropagation();
  });
  $DivBox.on("dblclick", function(event) {
    return event.stopPropagation();
  });
  $DivBox.on("click", function(event) {
    return event.stopPropagation();
  });
  $DivBox.hover(function() {
    $(this).fadeTo(150, 1);
    return popData.mouseIn = 1;
  }, function() {
    if (!popData.bTrans) {
      $(this).fadeTo(300, 0.7);
      clearTimeout(popData.timer);
      popData.timer = setTimeout(TimeOutHide, 5500);
    }
    return popData.mouseIn = 0;
  });
  $('#popupwapper').append("<a id='gtrans' href=''><img title='translate' src='" + popData.tico + "' /></a>").append("<a id='openurl' href=''><img title='Open Url' id='iconie' src='" + popData.ieIcon + "'/></a>").append("<a id='sSite' href=''><img title='In Site Search' src='" + popData.inSite + "' /></a>").append("<a id='sbaidu' href=''><img title='Baidu' src='" + popData.baiduico + "' /></a>").append("<a id='sbing' href=''><img title='Bing' src='" + popData.bingico + "' /></a>").append("<a id='sgoogle' href=''><img title='Google' id='gicon' src='" + popData.gicon + "' /></a>");
  $('#sgoogle, #sbing, #sbaidu, #openurl').on("click", function(event) {
    return $('#ShowUpBox').hide();
  });
  UIList = {
    '#openurl': 'Open_st',
    '#sSite': 'Site_st',
    '#sbaidu': 'Baidu_st',
    '#sbing': 'Bing_st',
    '#sgoogle': 'Google_st'
  };
  for (id in UIList) {
    if (!__hasProp.call(UIList, id)) continue;
    opt = UIList[id];
    if (!GetOpt(opt)) {
      $(id).hide();
    }
  }
  if (GetOpt('Tab_st')) {
    $DivBox.find('a').attr('target', '_blank');
  } else {
    $DivBox.find('a').attr('target', '_self');
  }
  $('#gtrans').on("click", function(event) {
    var addr, addrList;
    popData.bTrans = 1;
    $("#Gspan").empty().append("<div style='padding:10px;'><img src=" + popData.pending + " /></div>").show();
    $('#popupwapper').hide();
    fixPos(document.defaultView.getSelection());
    addrList = ["translate.google.com", "74.125.22.189", "173.194.120.88", "74.125.205.95", "61.19.1.118", "64.15.115.187", "91.213.30.185", "178.60.128.53"];
    popData.ajax = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = addrList.length; _i < _len; _i++) {
        addr = addrList[_i];
        _results.push(ajaxTranslation(addr));
      }
      return _results;
    })();
    return event.preventDefault();
  });
  if (GetOpt('Dis_st')) {
    popData.tip = popData.tipup;
    $DivBox.append('<span id="popuptip" class="tipup"></span>');
    return $('#popuptip').css({
      'margin-top': '-2px',
      'margin-bottom': '0px'
    });
  } else {
    popData.tip = popData.tipdown;
    $DivBox.prepend('<span id="popuptip" class="tipdown"></span>');
    return $('#popuptip').css({
      'margin-top': '0px',
      'margin-bottom': '-2px'
    });
  }
};

praseTranslation = function(responseDetails) {
  var Rst, Rtxt, line, means, req, usage, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
  if (!popData.bTrans) {
    return;
  }
  _ref = popData.ajax;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    req = _ref[_i];
    req.abort();
  }
  Rtxt = JSON.parse(responseDetails.responseText);
  Rst = '<div id="tranRst" style="padding:10px;font-size:13px;overflow:auto;">';
  _ref1 = Rtxt.sentences;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    line = _ref1[_j];
    Rst += line.trans + '<br>';
  }
  Rst += '<br><ul style="font-size:13px;list-style-position:inside;">';
  if (Rtxt.dict != null) {
    _ref2 = Rtxt.dict;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      usage = _ref2[_k];
      Rst += "<li>" + usage.pos + " : ";
      _ref3 = usage.entry;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        means = _ref3[_l];
        if (means.score > 0.005 || means.score > usage.entry[0].score / 4) {
          Rst += means.word + ', ';
        }
      }
      Rst += '</li>';
    }
  }
  $('#Gspan').empty().append(Rst + '</ul></div>').show();
  return fixPos(document.defaultView.getSelection());
};

ajaxTranslation = function(addr, callback) {
  if (callback == null) {
    callback = function(err) {
      return log("Err: " + addr);
    };
  }
  return GM_xmlhttpRequest({
    method: 'POST',
    timeout: 4000,
    url: "http://" + addr + "/translate_a/t",
    data: "client=p&text=" + popData.text + "&langpair=auto|auto",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    onload: praseTranslation,
    onerror: callback,
    ontimeout: callback
  });
};

document.onmouseup = function(event) {
  if (event.which !== 1) {
    return;
  }
  if (GetOpt('Ctrl_st') && !event.ctrlKey) {
    return;
  }
  popData.lxe = event;
  return setTimeout(ShowBar, 10);
};

InTextBox = function(selection) {
  var area, _i, _len, _ref;
  _ref = $('textarea, input[type=text], *[contenteditable="true"]', document);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    area = _ref[_i];
    if (selection.containsNode(area, true)) {
      return true;
    }
  }
  return false;
};

ShowBar = function() {
  var UrlText, event, sel, seltxt;
  event = popData.lxe;
  sel = document.defaultView.getSelection();
  seltxt = sel.toString();
  if (seltxt === '' || InTextBox(sel)) {
    return;
  }
  if (GetOpt("Copy_st")) {
    GM_setClipboard(seltxt);
  }
  popData.text = encodeURIComponent(seltxt);
  $('#Gspan').empty().hide();
  fixPos(sel, event);
  $('#sbaidu').attr('href', "http://www.baidu.com/s?wd=" + popData.text);
  $('#sbing').attr('href', "http://bing.com/search?q=" + popData.text + "&form=MOZSBR");
  $('#sgoogle').attr('href', "https://www.google.com/search?newwindow=1&q=" + popData.text);
  $('#sSite').attr('href', "https://www.google.com/search?newwindow=1&q=" + popData.text + "%20site:" + document.domain);
  UrlText = seltxt;
  if (UrlText.indexOf('http') === -1) {
    UrlText = 'http://' + UrlText;
  }
  $('#openurl').attr('href', UrlText);
  $('#ShowUpBox').css('opacity', 0.9).fadeIn(150);
  popData.mouseIn = 0;
  popData.bTrans = 0;
  clearTimeout(popData.timer);
  return popData.timer = setTimeout(TimeOutHide, 4000);
};

GetOpt = function(id) {
  return $("#" + id).data('val');
};

SetOpt = function(id) {
  var dom, val;
  dom = $("#" + id);
  val = GM_getValue(id);
  if (!val) {
    dom.addClass('close');
  }
  dom.data('val', val);
  return dom.click(function() {
    $(this).toggleClass('close');
    if ($(this).data('val') === 1) {
      return $(this).data('val', 0);
    } else {
      return $(this).data('val', 1);
    }
  });
};

SaveOpt = function(id) {
  return GM_setValue(id, $("#" + id).data('val'));
};

OpenSet = function() {
  return $('#popup_setting').fadeIn(300);
};

SettingWin = function() {
  var item, _i, _len, _ref;
  $("body").append("<span id=\"popup_setting\">\n	<div id=\"popup_title\">PopUp Search设置</div>\n	<div id=\"pop_st_wapper\">\n		<div id=\"option_box\">\n			<div id=\"rol1\">\n				<span id=\"Google_st\">Google搜索</span>\n				<span id=\"Bing_st\">Bing搜索</span>\n				<span id=\"Baidu_st\">Baidu搜索</span>\n			</div>\n			<div id=\"rol2\">\n                        <span id=\"Site_st\">站内搜索按钮</span>\n				<span id=\"Fade_st\">超时自动隐藏</span>\n				<span id=\"Dis_st\">显示于文字上方</span>\n			</div>\n			<div id=\"rol3\">\n				<span id=\"Open_st\">打开选中网址按钮</span>\n				<span id=\"Tab_st\">新标签页打开</span>\n				<span id=\"Copy_st\">选中自动复制</span>\n			</div>\n			<div id=\"rol4\">\n				<span id=\"Round_st\">使用直角风格</span>\n				<span id=\"Ctrl_st\">仅按下Ctrl时显示</span>\n			</div>\n		</div>\n		<br>\n		<div id = \"btnarea\">\n			<div id=\"popup_tip\">请在GreaseMonkey的\"用户脚本命令\"菜单的\"Popup Search设置\"下打开此选项</div>\n			<div id=\"popup_close\" class=\"setting_btn\">Close</div>\n			<div id=\"popup_save\" class=\"setting_btn\">Save</div>\n		</div>\n	</div>\n</span>");
  $("#rol1 > span, #rol2 > span, #rol3 > span, #rol4 > span").addClass("setting_sp_btn");
  _ref = $("#popup_setting .setting_sp_btn");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    if (item != null) {
      SetOpt(item.id);
    }
  }
  $("#popup_save").click(function() {
    var _j, _len1, _ref1;
    _ref1 = $("#popup_setting .setting_sp_btn");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      if (item != null) {
        SaveOpt(item.id);
      }
    }
    return $("#popup_setting").fadeOut(300, function() {
      $("#popup_setting").remove();
      SettingWin();
      $('#ShowUpBox').remove();
      return Init();
    });
  });
  return $("#popup_close").click(function() {
    return $("#popup_setting").fadeOut(300, function() {
      $("#popup_setting").remove();
      return SettingWin();
    });
  });
};

Load = function() {
  var UpdateAlert, popupmenu;
  addCSS();
  popData.mouseIn = 0;
  popData.bTrans = 0;
  popData.text = "";
  UpdateAlert = GM_getValue("UpdateAlert", 0);
  if (UpdateAlert < 5) {
    GM_setValue("UpdateAlert", 5);
    GM_setValue("Open_st", GM_getValue("Open_st", 1));
    GM_setValue("Baidu_st", GM_getValue("Baidu_st", 1));
    GM_setValue("Bing_st", GM_getValue("Bing_st", 1));
    GM_setValue("Google_st", GM_getValue("Google_st", 1));
    GM_setValue("Fade_st", GM_getValue("Fade_st", 1));
    GM_setValue("Ctrl_st", GM_getValue("Ctrl_st", 0));
    GM_setValue("Dis_st", GM_getValue("Dis_st", 1));
    GM_setValue("Tab_st", GM_getValue("Tab_st", 1));
    GM_setValue("Copy_st", GM_getValue("Copy_st", 0));
    GM_setValue("Round_st", GM_getValue("Round_st", 1));
    GM_setValue("Site_st", GM_getValue("Site_st", 1));
    SettingWin();
    OpenSet();
  } else {
    SettingWin();
  }
  Init();
  GM_registerMenuCommand("Popup Search设置", OpenSet, 'p');
  if (GM_getValue("PopupMenu", 0)) {
    popupmenu = document.body.appendChild(document.createElement("menu"));
    popupmenu.outerHTML = '<menu id="userscript-popup" type="context"><menuitem id="Popupset" label="Popup Search设置"></menuitem></menu>';
    document.querySelector("#Popupset").addEventListener("click", OpenSet, false);
    return $(document).on("contextmenu", function() {
      return document.body.setAttribute("contextmenu", "userscript-popup");
    });
  }
};

if (!(window !== window.top || window.document.title === "")) {
  setTimeout(Load, 70);
}

addCSS = function() {
  popData.tipdown = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAXElEQVQYlYXMsQ5AQBREUSoVjQ+f+S0lSi2livJlr4ZEZDcmud3JVJIW2yPQVqXZPmwjaQXqEuJJ0vCLbrgDfRZFxBsH0GTRCybbcxF9HhPQZdEHbkUUEUg6JU0Xm2KvCU6v27kAAAAASUVORK5CYII=";
  popData.tipup = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAZElEQVQYlXXMIQ4CMBBE0UWhwHDw+ddCAhILEgWy4WNo0tAyyZidly1AwNba1CSvJOf6h/oduC/RAN7qfkJ9BC7VM6LhQ1O3E+pN8lAPNeYHHGsV4PkFN3WzREmuwEndLUFVfQC3Xa8Jl+92RAAAAABJRU5ErkJggg==";
  popData.baiduico = "data:image/png;base64,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";
  popData.bingico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACeklEQVRYhe2Wy2sTURTGu1fapOZRTKj2kaag1VaTNA9NjHkWLS3diC5q6wNc+A+EIkVw40ZRFBeuirgQF1JfuFBboYiIzb2TmdimCA0YWyupqalBTRo/F4M3KE0mhrR2kQsfDHPvOfOb794zZ6qErlb8T1VVACoAFYANDcD7dKAWFahFBd7TvL4AvE8HobsNqSmK1FuC6WP71gQiP4C3GeGe3fg9Zk54EHI35ub9evBenSi/fm0AhJ5dDCAy4Abn0ILa1CCGGlCrCsLhnRAO7QAxK0CMMlBb3R+QZQUId7ch0u9EYuwBVhs/s1l8fnIX00dtIEY5eF9LeQG+RWfYdeLZKGaHTiLS70TkuAvR4TP48vIpm19+MwFqURZ1ZooGAIAf8+/B2TWgZgVCzm0IuRtFHagH6awF72vBytek6EgmDWpVSTpRNEA2k0awYxN4T1PeZCFXA6hZwWKWxh+CWtXlAYhdHgK3f6ukpdSqxqfb11kcMckLVknhMuxtZ4lmA4MIOeslATiHFrFLARbH2TUFtyE/gF8PYpKzRIuP7oAYZZIAwY7NWJ6cEM/BSgbEIINQigNCVys4uwZz187nPkan/CCdW1Z9I96rAzHIMBsYZOuj505Lula4F/j1CO6tRnz0Fku6MHIF1KIEMclBrSpQqwrEKANn1yJ+b4Stm795EcRUW3oZ/r0V7872IZOI50ryYwzJV2NIvh5HenGB3f8eiyIy4AK1KCUfXhQAK7GD2xHcU42pI2bM3biApRePkQoHkQpPIvH8Pj5cHUa4tx3EUIOQq6GonP8EIEoP3tPEegK1KEXZ6sA5tCV1y439Q1IBqABUANZDvwDe9YuA3jr3dgAAAABJRU5ErkJggg==";
  popData.tico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABzUlEQVRYhe2WTWsTURSGr5iQNOkIgvgDJEIXdqUrUTeltFt3gr/And3afZcuzbo/IC5qksnMtCITrYYWlGAJBKW0fpCNLSiBgtXHxQkmMvdOZkhCicyBs5rLOc+d856Xq9i8wFmmSgASgOkE8CxzThzAzUDtHJRVMG0VGyIegJOCl9fg8zra6DyFipoQgJsDNyuNvLweAMC/In9p7ABlBUcvpEm3DdvX9QAnX2Aj+iiiAThpeH3j30aN2/C9qYdo3hedjAXAs+CZgtNusJE3Yx5FRYE3OwYAW0Hrob5JexUOi/pvn4qRBBkO4OUFwBRbF6WJ8fslcGdGAKgo6JT0xfcfQ7W3+3sP9Gd+vJfxbZoFaQZwM+AXzLcr92bsWaL6n8f6c7vL4JyPCeBZ0uDkq77o27tyeyctaSuoXzXD2mZB6gHcLLya1xfrfhBH3F2CnYV+Nm5BfS6Yb27C88sxAf4ajx8EcDPmm+ri96/eSup1EKKBnCh4MA6eQPtRPAC/EGrN4VtQVfBxrV+sFrJyuuiUhnrBEB+YlVEAvLsH37biAdhKvGQkJ3TS0LgDO4vxmrdWBGAkJxz0BCclphI1a9HeBVP6JkwAEoD/CeAP3U729kMHHe8AAAAASUVORK5CYII=";
  popData.gicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcElEQVRYhe2VX0hTcRTHD0SP9SjUQ4hKbv4pm1u6JhFEVCL2ENGD0UME9haUFAQh0kM9xvRubnebRpFSIVELyRXhsheVIT1kWYIz1MwMy9Qo49PDT7cR5lZe7aH94Dzc3733fD/nd875HZGmMv6ppQHSAGmAv/rJb0c8OxB3AeLKU+YuQDxFiK9kFQH8dkQzs655Nxd6GwmP9TEyM8HIzAThsT4uRnQ2tVYi9TmIb6fBALoV0Yt5MhoBoGUwhD1YzcYb+8m6fYRzPS4W19sv45jbqlKDSEnca2Fz66GYgPhK1LHrNsRfqp49RYgzi2uv22OA0rjNAAB/Keub98TF3fm/j0y3srf9NFp/G+LMRgKOFQIEHIgzm3ezkwBUPjqvIl02VTbEsz018aQAug17sDoefapRGdYF7kJuDoYA6H7/AtHMxoonBdDMDEwNA3Av2oW48tcawMTQ9CgAkQ+vEM20xgCufEIj3fEaqM9ZugYCDsRrUSnSTHHTrSsE8Fo48fRyDKA8VKOEfhXXbdRG/AB8/jbDwKdhxmc/cqyzLjnEsi8DuxBXXgxg/sc84sxS+wnfbLi+j4yWCkS3kXnrcELXZCbvmqRH5LVQ3lETc/p4tBe5ukXdgImgfjuiW8m5czQOoOUaANBUhjTkUhvxxRw/n3yDeItVzr0WdfnoNsRdSEZLxSoALEAceHiGxHV/+BlVnXXYg9U4HpziePgSPRP9cUh3gYEAC+mQhq0c7DhLYCDIy6kos9/nmJv/SnR6jLvRMCe7rqjhpJkMmAVLFqZDVXZjoZqIiy3nylN7Xouqh1T9/TGA0ZYGSAP89wA/AZoF9N4ossasAAAAAElFTkSuQmCC";
  popData.ieIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC2ElEQVRYhe2Wy08TURTGSboAlSjKq5SQSlH6cCsLYuIf4FpXLF2oTQpaSqf0YWdciAjRaOKKGGJIQEOIzxgFhZXEKIpPBExQjKJ27i2UdphOp+VzUSEhU8baoiamJ/k2d07u97v33HPn5u05FcS/VF4OIAfwXwBYuCB2n6SochNUMARahkDvobBwfwjAxFLs9FBUupKG207wOHBpAV2PRLyZk/GBxHFxREC5k/wS4rcALByFjiEw+Cj8dyK49SqK4SkJESkBAJgNxuG8HsahrhAujy6hfVBAtZduDICJpdjRTNDzRIRaXBhZwuZGHsUOgraNAjCzFGVOAiokVM1XYi6UQGETD+ZGBDW+LAEsXBBFdh5T3+WUZnJiOeX46EwMx64uwpAtQLWX4mjfosLg3oQELUOw9TiPylaCkWlJkdPQHYIh2xKUthDMBuNrJp74JkNjDWCXj6LWT1Hjo9BYA3gfkBV5ZS0kcwAzR1HZShQr896OoK49iP3n5ldVdyYI9m5EkVvmJLBw6++CKkCtn6K+Yz5ljdON+o55GP0ZAlS1EnQ+ELIC2NeZIYCFoyh28CknbegOId/GY3szWaMCGw+NNbCqfBuvaq4KYPBSHOlNnn4htrbV3n6VUWDjYf5ZWwtHUe4kaOwPo29MxJXHInqfijg7lMVFpHMRDL6TwEcSONgVUuzCwHgURXYeJQ6CLU08mgfCihz7QDjzNixtIRCkZZwfFqCxBvCRxhUGADBDUo9PB2QU2XnVDlAFKHEk2+9wzyL0HgqdiyhKsV4siAloGQIzq26uClDBELz+IuPmyygKm3joGIJNjTzCkvr/4NpzEcUOAlMa5qoAJjZ5wz37FMOLzzH0j0fROyZib1sQRpaifUjAw0kJY7MxDE1KOH1fgJGlqGDI6uHMCmAFQuci0LkIqtwEejeF0U9hZCn07uTbQMskv+s9NO1Vpw3wN5QDyAHkAH4APkBEEJ/n2M4AAAAASUVORK5CYII=";
  popData.pending = "data:image/png;base64,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";
  popData.inSite = 'data:image/png;base64,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';
  return GM_addStyle("#ShowUpBox{\n	width:auto; height:auto; position:absolute; z-index:10240; display:inline-block;\n	line-height:0; vertical-align:baseline;\n}\n#showupbody{\n	all: unset; min-width: 20px; max-width: 750px; min-height: 20px; max-height: 500px;\n	display: block; border:solid 2px rgb(144,144,144); border-radius:1px;\n	background:rgba(252, 252, 252, 1);\n}\n#popupwapper{\n	margin: 3px 2px 3.8px 2px; display:block; line-height: 0;\n}\n#Gspan{\n	line-height: normal; width: auto; font-size: 16px; overflow: auto; display: none;\n}\n#ShowUpBox img{\n	margin: 0px 2px 0px 2px; height: 20px; width: 20px; border-radius: 0px; padding: 0px;\n	display: inline-block; -moz-transition-duration: 0.1s;\n}\n#ShowUpBox img:hover{\n	margin: -1px 1px -1px 1px; height: 22px; width: 22px;\n}\n#popuptip{\n	display:inline-block; clear:both; height:9px; width:9px;\n}\n.tipup {\n	background: url(" + popData.tipup + ") 0px 0px no-repeat transparent;\n}\n.tipdown {\n	background: url(" + popData.tipdown + ") 0px 0px no-repeat transparent;\n}\n#ShowUpBox a{\n	text-decoration: none; display:inline-block;\n}\n\n#popup_setting{\n	all: unset; display:none; text-align: justify; position:fixed; z-index:102400;\n	box-shadow:0 0 5px #222; -moz-user-select:none; font-family:\"Microsoft YaHei\";\n	left:-moz-calc(50% - 340px); left:-webkit-calc(50% - 340px); width:auto;\n	top: -moz-calc(50% - 160px); top: -webkit-calc(50% - 160px); background: white;\n}\n#pop_st_wapper{\n	padding:30px 40px 20px 40px;\n}\n#popup_title{\n	font-size:28px; text-align:center; background:rgba(0,0,0,0.45); color:white; padding: 5px;\n}\n#option_box { margin-right: -85px; }\n#popup_tip{\n	display:inline-block; font-size:12px; color:red; margin-top: 20px;\n}\n.setting_btn{\n	display:inline-block; font-size:16px; cursor:default; float: right; border: 2px solid #20CC66;\n	padding: 2px 10px; border-radius: 4px; font-weight: bold; margin: 10px 0px 10px 15px; color: #20CC66;\n}\n.setting_btn:hover { box-shadow: 0px 0px 2px #20CC66; }\n\n.setting_sp_btn{\n	min-width:120px; height:18px; font-size:12px; padding:4px; -moz-user-select:none; cursor:default;\n	position:relative; margin: 5px 85px 5px 0px; display:inline-block;\n}\n.setting_sp_btn.close {background:#DDD;border:none;}\n.setting_sp_btn::before{\n	position:absolute; right:-26px;t op:0; content:\" \"; width:26px; height:26px;\n	background:#6B4; transition:0.3s;\n}\n.setting_sp_btn.close::before{background:#C54;}\n.setting_sp_btn:hover {background:#DDD;}\n.setting_sp_btn:active {box-shadow:0 0 3px #999 inset;}");
};

getLastRange = function(selection) {
  var rangeNum, _i, _ref;
  for (rangeNum = _i = _ref = selection.rangeCount - 1; _ref <= 0 ? _i <= 0 : _i >= 0; rangeNum = _ref <= 0 ? ++_i : --_i) {
    if (!selection.getRangeAt(rangeNum).collapsed) {
      return selection.getRangeAt(rangeNum);
    }
  }
  return selection.getRangeAt(selection.rangeCount - 1);
};

get_offsets_and_remove = function($test_span) {
  var curr_elem, span_ht, span_wt, total_offsetLeft, total_offsetTop;
  curr_elem = $test_span[0];
  total_offsetTop = 0;
  total_offsetLeft = 0;
  while (curr_elem !== null) {
    total_offsetTop += curr_elem.offsetTop;
    total_offsetLeft += curr_elem.offsetLeft;
    curr_elem = curr_elem.offsetParent;
  }
  span_ht = $test_span.height();
  span_wt = $test_span.width();
  $test_span.remove();
  return [total_offsetTop, total_offsetLeft, span_ht, span_wt];
};

get_selection_offsets = function(selection) {
  var $test_span, lastRange, newRange;
  $test_span = $('<span style="display:inline;">x</span>');
  lastRange = getLastRange(selection);
  newRange = document.createRange();
  newRange.setStart(lastRange.endContainer, lastRange.endOffset);
  newRange.insertNode($test_span[0]);
  return get_offsets_and_remove($test_span);
};
