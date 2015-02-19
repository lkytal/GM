// ==UserScript==
// @name						Tieba Enhance
// @namespace					lkytal
// @author						lkytal
// @homepage					http://lkytal.github.io/
// @description					贴吧小尾巴, 坟贴提醒, 去除跳转等功能
// @include						http://tieba.baidu.com/*
// @include						https://tieba.baidu.com/*
// @version						6.0.5
// @author						lkytal
// @require						http://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @icon						http://lkytal.qiniudn.com/ic.ico
// @grant						unsafeWindow
// @grant						GM_addStyle
// @grant						GM_xmlhttpRequest
// @grant						GM_getValue
// @grant						GM_setValue
// @grant						GM_listValues
// @grant						GM_deleteValue
// @homepageURL					https://git.oschina.net/coldfire/GM
// @updateURL					https://git.oschina.net/coldfire/GM/raw/master/meta/tieba_enhance.meta.js
// @downloadURL					https://git.oschina.net/coldfire/GM/raw/master/tieba_enhance.user.js
// ==/UserScript==

"use strict";
var CheckPost, Init, TailInit, clearLink, log, open_setting_window, tiebaData,
  __hasProp = {}.hasOwnProperty;

tiebaData = {
  StopPost: 0,
  count: 0
};

log = function(msg) {
  var text;
  tiebaData.count += 1;
  text = "hit " + tiebaData.count + " : " + msg;
  return console.log(text);
};

open_setting_window = function() {
  var e, x, _ref, _ref1;
  $('body').append("<div id=\"setting_shadow\" style=\"opacity:0\">\n	<div id=\"setting_window\" style=\"top:-100%;\">\n		<div id=\"setting_reset\" class=\"setting_btn_inside\">重置</div>\n		<div id=\"setting_save\" class=\"setting_btn_inside\">保存</div>\n		<div id=\"setting_close\" class=\"setting_title setting_btn_inside\">设置</div>\n		<p class=\"setting_hiding_sp\"></p>\n		<div id=\"setting_out_div\">\n			<div id=\"fentie_open\" class=\"setting_sp_btn\">坟贴检测</div>\n			<div class=\"setting_sp\">\n				<p class=\"setting_hide\"></p><span>超过</span>\n				<input class=\"setting_input\" type=\"number\" id=\"fentie_date\"></input><span>天的帖子视为坟贴</span>\n				<div id=\"fentie_forbidden\" class=\"setting_sp_btn\">坟贴禁回</div>\n			</div>\n			<p class=\"setting_hide sp\"></p>\n			<div id=\"tail_open\" class=\"setting_sp_btn\">小尾巴</div>\n			<div id=\"tail_select\">\n				<div id=\"tail_select_text\" contenteditable=\"true\"></div>\n				<div id=\"tail_option_box\"></div>\n				<div id=\"tail_type\">\n					<div id=\"tail_type_text\"></div>\n					<div id=\"tail_type_box\">\n						<div class=\"tail_type_option\">html</div>\n						<div class=\"tail_type_option\">javascript</div>\n					</div>\n				</div>\n				<div id=\"tail_save\" class=\"setting_btn_inside\">保存当前尾巴</div>\n				<div id=\"tail_new\" class=\"setting_btn_inside\">新建尾巴</div>\n				<div id=\"tail_delete\" class=\"setting_btn_inside\">删除尾巴</div>\n			</div>\n			<div class=\"setting_sp\">\n				<textarea class=\"setting_textarea\" id=\"tail_data\"></textarea><span>预览</span>\n				<div class=\"setting_textarea\" id=\"tail_data_show\"></div>\n				<p class=\"hiding_margin\" style=\"width:1px;height:20px;\"></p>\n			</div>\n		</div>\n	</div>\n</div>");
  $("#fentie_date")[0].value = tiebaData.fentie_date;
  if (!tiebaData.fentie_open) {
    $("#fentie_open").attr("class", "setting_sp_btn close");
    $("#fentie_open + div").css("display", "none");
  }
  if (!tiebaData.fentie_forbidden) {
    $("#fentie_forbidden").attr("class", "setting_sp_btn close");
  }
  if (!tiebaData.tail_open) {
    $("#tail_open").attr("class", "setting_sp_btn close");
    $("#tail_select,#tail_select + div").css("display", "none");
  }
  _ref = tiebaData.tail_data;
  for (x in _ref) {
    if (!__hasProp.call(_ref, x)) continue;
    $("#tail_select_text")[0].innerHTML = x;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", x);
    $("#tail_data")[0].value = tiebaData.tail_data[x].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[x].split("!分隔!")[1];
    break;
  }
  _ref1 = tiebaData.tail_data;
  for (x in _ref1) {
    if (!__hasProp.call(_ref1, x)) continue;
    $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
  }
  $(".tail_option").click(function() {
    var e;
    $("#tail_select_text")[0].innerHTML = this.innerHTML;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", this.innerHTML);
    $("#tail_data")[0].value = tiebaData.tail_data[this.innerHTML].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[this.innerHTML].split("!分隔!")[1];
    if ($("#tail_type_text")[0].innerHTML === "javascript") {
      try {
        $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
      } catch (_error) {
        e = _error;
        $("#tail_data_show")[0].innerHTML = e;
      }
    } else {
      if ($("#tail_type_text")[0].innerHTML === "html") {
        $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
      }
    }
  });
  $(".tail_type_option").click(function() {
    var e;
    $("#tail_type_text")[0].innerHTML = this.innerHTML;
    if ($("#tail_type_text")[0].innerHTML === "javascript") {
      try {
        $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
      } catch (_error) {
        e = _error;
        $("#tail_data_show")[0].innerHTML = e;
      }
    } else {
      if ($("#tail_type_text")[0].innerHTML === "html") {
        $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
      }
    }
  });
  $("#tail_data").keyup(function() {
    var e;
    if ($("#tail_type_text")[0].innerHTML === "javascript") {
      try {
        $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
      } catch (_error) {
        e = _error;
        $("#tail_data_show")[0].innerHTML = e;
      }
    } else {
      if ($("#tail_type_text")[0].innerHTML === "html") {
        $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
      }
    }
  });
  if ($("#tail_type_text")[0].innerHTML === "javascript") {
    try {
      $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
    } catch (_error) {
      e = _error;
      $("#tail_data_show")[0].innerHTML = e;
    }
  } else {
    if ($("#tail_type_text")[0].innerHTML === "html") {
      $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
    }
  }
  setTimeout((function() {
    $("#setting_shadow")[0].removeAttribute("style");
  }), 10);
  setTimeout((function() {
    $("#setting_window")[0].removeAttribute("style");
  }), 510);
  $("#setting_close").mouseenter(function() {
    this.innerHTML = "关闭";
  });
  $("#setting_close").mouseleave(function() {
    this.innerHTML = "设置";
  });
  $("#setting_close").click(function() {
    $("#setting_window").css("top", "-600px");
    setTimeout((function() {
      $("#setting_shadow").css("opacity", "0");
      $("#setting_shadow").remove();
      return $("#setting_window").remove();
    }), 300);
  });
  $("#setting_reset").click(function() {
    var i, key, keys;
    if (confirm("确定重置设置吗(会刷新页面)")) {
      keys = GM_listValues();
      i = 0;
      key = null;
      while (key === keys[i]) {
        key = keys[i];
        GM_deleteValue(key);
        i++;
      }
      $("#setting_window")[0].style.top = "-600px";
      setTimeout((function() {
        $("#setting_shadow").css("opacity", "0");
      }), 200);
      setTimeout((function() {
        $("#setting_shadow").remove();
      }), 700);
      window.location.reload();
    }
  });
  $("#fentie_open").click(function() {
    $("#fentie_open + div").slideToggle("slow");
    if (tiebaData.fentie_open) {
      tiebaData.fentie_open = 0;
      $("#fentie_open").attr("class", "setting_sp_btn close");
    } else {
      tiebaData.fentie_open = 1;
      $("#fentie_open").attr("class", "setting_sp_btn");
    }
  });
  $("#fentie_forbidden").click(function() {
    if (tiebaData.fentie_forbidden) {
      tiebaData.fentie_forbidden = 0;
      $("#fentie_forbidden").attr("class", "setting_sp_btn close");
    } else {
      tiebaData.fentie_forbidden = 1;
      $("#fentie_forbidden").attr("class", "setting_sp_btn");
    }
  });
  $("#tail_open").click(function() {
    if (tiebaData.tail_open) {
      tiebaData.tail_open = 0;
      $("#tail_select,#tail_select + div").toggle("slow");
      $("#tail_option_box").hide(400);
      $("#tail_type_box").hide(400);
      $("#tail_open").attr("class", "setting_sp_btn close");
    } else {
      tiebaData.tail_open = 1;
      $("#tail_select,#tail_select + div").slideToggle("slow");
      $("#tail_open").attr("class", "setting_sp_btn");
    }
  });
  $("#tail_select_text + div").css("display", "none");
  $("#tail_select_text").click(function() {
    var myfunction;
    $("#tail_select_text + div").show(400);
    $(document).bind("click", myfunction = function(e) {
      if (e.target.id !== "tail_select_text" && e.target.id !== "tail_open") {
        $("#tail_select_text + div").hide(400);
        $(document).unbind("click", myfunction);
      }
    });
  });
  $("#tail_type_text + div").css("display", "none");
  $("#tail_type_text").click(function() {
    var myfunction2;
    $("#tail_type_text + div").show(400);
    $(document).bind("click", myfunction2 = function(e) {
      if (e.target.id !== "tail_type_text" && e.target.id !== "tail_open") {
        $("#tail_type_text + div").hide(400);
        $(document).unbind("click", myfunction2);
      }
    });
  });
  $("#tail_new").click(function() {
    $("#tail_select_text").attr("new", "1");
    $("#tail_select_text").attr("oname", "");
    $("#tail_select_text")[0].textContent = "新尾巴" + Math.random().toString().substr(3, 3);
    $("#tail_data")[0].value = "<br>小尾巴脚本Tieba Enhance:<br>https://git.oschina.net/coldfire/GM";
    $("#tail_type_text")[0].textContent = "html";
  });
  $("#tail_delete").click(function() {
    var oname, _ref2, _ref3;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") !== 1) {
      delete tiebaData.tail_data[oname];
    }
    _ref2 = tiebaData.tail_data;
    for (x in _ref2) {
      if (!__hasProp.call(_ref2, x)) continue;
      $("#tail_select_text")[0].innerHTML = x;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", x);
      $("#tail_data")[0].value = tiebaData.tail_data[x].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[x].split("!分隔!")[1];
      break;
    }
    GM_setValue("tail_data", JSON.stringify(tiebaData.tail_data));
    $("#tail_option_box").empty();
    _ref3 = tiebaData.tail_data;
    for (x in _ref3) {
      if (!__hasProp.call(_ref3, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    $(".tail_option").click(function() {
      $("#tail_select_text")[0].innerHTML = this.innerHTML;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", this.innerHTML);
      $("#tail_data")[0].value = tiebaData.tail_data[this.innerHTML].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[this.innerHTML].split("!分隔!")[1];
      if ($("#tail_type_text")[0].innerHTML === "javascript") {
        try {
          $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
        } catch (_error) {
          e = _error;
          $("#tail_data_show")[0].innerHTML = e;
        }
      } else {
        if ($("#tail_type_text")[0].innerHTML === "html") {
          $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
        }
      }
    });
  });
  $("#tail_save").click(function() {
    var name, oname, _ref2, _ref3;
    name = $("#tail_select_text")[0].innerHTML;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") === 1) {
      if (tiebaData.tail_data[name]) {
        alert("该尾巴已存在！");
        return;
      } else {
        tiebaData.tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      }
    } else {
      if (name === oname) {
        tiebaData.tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      } else {
        delete tiebaData.tail_data[oname];
        tiebaData.tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      }
    }
    _ref2 = tiebaData.tail_data;
    for (x in _ref2) {
      if (!__hasProp.call(_ref2, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/,/g, "!逗号!").replace(/"/g, "!引号!");
    }
    GM_setValue("tail_data", JSON.stringify(tiebaData.tail_data));
    $("#tail_option_box").empty();
    _ref3 = tiebaData.tail_data;
    for (x in _ref3) {
      if (!__hasProp.call(_ref3, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    $(".tail_option").click(function() {
      $("#tail_select_text")[0].innerHTML = this.innerHTML;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", this.innerHTML);
      $("#tail_data")[0].value = tiebaData.tail_data[this.innerHTML].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[this.innerHTML].split("!分隔!")[1];
      if ($("#tail_type_text")[0].innerHTML === "javascript") {
        try {
          $("#tail_data_show")[0].innerHTML = eval_($("#tail_data")[0].value);
        } catch (_error) {
          e = _error;
          $("#tail_data_show")[0].innerHTML = e;
        }
      } else {
        if ($("#tail_type_text")[0].innerHTML === "html") {
          $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
        }
      }
    });
  });
  $("#setting_save").click(function() {
    tiebaData.fentie_date = $("#fentie_date")[0].value;
    GM_setValue("fentie_open", tiebaData.fentie_open);
    GM_setValue("fentie_date", tiebaData.fentie_date);
    GM_setValue("fentie_forbidden", tiebaData.fentie_forbidden);
    GM_setValue("tail_open", tiebaData.tail_open);
    $("#setting_window")[0].style.top = "-600px";
    setTimeout((function() {
      $("#setting_shadow").css("opacity", "0");
    }), 200);
    setTimeout((function() {
      $("#setting_shadow").remove();
    }), 600);
    window.location.reload();
  });
};

CheckPost = function() {
  var date_str, date_time, days, years;
  if ($("#j_core_title_wrap").length && tiebaData.fentie_open) {
    date_str = $("#j_p_postlist ul.p_tail > li:nth-child(2) > span")[0].textContent;
    if (date_str === "1970-01-01 07:00") {
      return setTimeout(CheckPost, 500);
    }
    date_str = date_str.replace(" ", "-").replace(":", "-").split("-");
    date_time = new Date(date_str[0], date_str[1] - 1, date_str[2], date_str[3], date_str[4]);
    days = parseInt((new Date() - date_time) / 86400000);
    if (days >= tiebaData.fentie_date) {
      if (days >= 365) {
        years = parseInt(days / 365);
        days = (years + "年") + (days - years * 365);
      }
      $("#tb_nav").after("<div id='NotifyTide'><p>这是一个" + days + "天的坟贴哦~</p></div>");
      if (tiebaData.fentie_forbidden) {
        return tiebaData.StopPost = 1;
      }
    }
  }
};

TailInit = function() {
  var AddTail, SendBt, i, x, _ref, _ref1;
  if (document.querySelector(".ui_btn.ui_btn_m.j_submit.poster_submit")) {
    if (!tiebaData.tail_open) {
      return;
    }
    $("a.j_submit.poster_submit").before("<span id=\"tail_use\">\n	<span class=\"ui_btn ui_btn_m\">\n		<span id=\"tail_use_text\"></span>\n	</span>\n	<div id=\"tail_use_box_out\">\n		<div id=\"tail_use_box\" style=\"display:none;\"></div>\n	</div>\n</span>");
    $("#tail_use_text").click(function() {
      return $("#tail_use_box").slideToggle(400);
    });
    $(document).bind("click", function(e) {
      if (e.target.id !== "tail_use_text") {
        $("#tail_use_box").slideUp(400);
      }
    });
    if (tiebaData.tail_cur === "不使用小尾巴" || tiebaData.tail_cur === "随机小尾巴") {
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
    } else if (typeof tiebaData.tail_data[tiebaData.tail_cur] === "undefined") {
      _ref = tiebaData.tail_data;
      for (i in _ref) {
        if (!__hasProp.call(_ref, i)) continue;
        if (!(i != null)) {
          continue;
        }
        tiebaData.tail_cur = i;
        break;
      }
      GM_setValue("tail_cur", tiebaData.tail_cur);
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
    } else {
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
    }
    $("#tail_use_box").append("<div class=\"tail_use_option\">不使用小尾巴</div>");
    $("#tail_use_box").append("<div class=\"tail_use_option\">随机小尾巴</div>");
    _ref1 = tiebaData.tail_data;
    for (x in _ref1) {
      if (!__hasProp.call(_ref1, x)) continue;
      $("#tail_use_box").append("<div class='tail_use_option'>" + x + "</div>");
    }
    $(".tail_use_option").click(function() {
      tiebaData.tail_cur = this.innerHTML;
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
      GM_setValue("tail_cur", tiebaData.tail_cur);
    });
    AddTail = function(e) {
      var key, tailContent, tailList, value;
      if (tiebaData.StopPost === 1) {
        if (!confirm("这可能是一个坟贴, 确认要回复么?")) {
          $("#ueditor_replace").empty();
        }
      }
      if (tiebaData.tail_cur === "不使用小尾巴") {
        return;
      }
      if (tiebaData.tail_cur === "随机小尾巴") {
        tailList = (function() {
          var _ref2, _results;
          _ref2 = tiebaData.tail_data;
          _results = [];
          for (key in _ref2) {
            value = _ref2[key];
            _results.push(value);
          }
          return _results;
        })();
        tiebaData.tail_cur = tailList[parseInt(Math.random() * tailList.length)];
      }
      tailContent = void 0;
      if (tiebaData.tail_data[tiebaData.tail_cur].split("!分隔!")[1] === "html") {
        tailContent = tiebaData.tail_data[tiebaData.tail_cur].split("!分隔!")[0];
      } else {
        if (tiebaData.tail_data[tiebaData.tail_cur].split("!分隔!")[1] === "javascript") {
          tailContent = eval(tiebaData.tail_data[tiebaData.tail_cur].split("!分隔!")[0]);
        }
      }
      return $("#ueditor_replace").append("<br>" + tailContent);
    };
    SendBt = document.querySelector("a.j_submit.poster_submit[title=\"Ctrl+Enter快捷发表\"]");
    SendBt.addEventListener("click", AddTail, true);
    document.onkeydown = function(event) {
      if (event.ctrlKey && event.keyCode === 13) {
        return AddTail();
      }
    };
  } else {
    setTimeout(TailInit, 100);
  }
};

clearLink = function(event) {
  var link, url;
  link = event.target;
  if (link.href.indexOf("http://jump.bdimg.com/safecheck") === 0) {
    url = link.textContent;
    if (url.indexOf("http") !== 0) {
      url = "http://" + url;
    }
    return link.href = url;
  }
};

Init = function() {
  var x, _ref;
  tiebaData.fentie_open = GM_getValue("fentie_open", 1);
  tiebaData.fentie_date = GM_getValue("fentie_date", 30);
  tiebaData.fentie_forbidden = GM_getValue("fentie_forbidden", 1);
  tiebaData.tail_open = GM_getValue("tail_open", 1);
  tiebaData.tail_cur = GM_getValue("tail_cur", "");
  tiebaData.tail_data = JSON.parse(GM_getValue("tail_data", "{\"Default\":\" !分隔!html\"}"));
  tiebaData._style_setted = 0;
  if (GM_getValue("tail_adopt", 0) < 2) {
    GM_setValue("tail_adopt", 2);
    if (typeof localStorage["tail_data"] === "string") {
      GM_setValue("tail_data", localStorage["tail_data"]);
      tiebaData.tail_data = JSON.parse(localStorage["tail_data"]);
    }
    GM_setValue("fentie_open", tiebaData.fentie_open);
    GM_setValue("fentie_date", tiebaData.fentie_date);
    GM_setValue("fentie_forbidden", tiebaData.fentie_forbidden);
    GM_setValue("tail_open", tiebaData.tail_open);
    GM_setValue("tail_data", JSON.stringify(tiebaData.tail_data));
    _ref = tiebaData.tail_data;
    for (x in _ref) {
      if (!__hasProp.call(_ref, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
    }
  }
  $("#tb_nav").find("ul:first").append("<li id=\"setting_btn\" class=\"star_nav_tab\">\n	<div class=\"star_nav_tab_inner\">\n		<div class=\"space\">\n			<a style=\"cursor:pointer;-moz-user-select:none;\" class=\"star_nav_ico star_nav_ico_good\">设置</a>\n		</div>\n	</div>\n</li>");
  jQuery("body").on("mouseover", "a", clearLink);
  setTimeout(CheckPost, 500);
  $("#setting_btn").click(function() {
    return open_setting_window();
  });
  TailInit();
};

if (window === window.top && window.document.title !== "") {
  setTimeout(Init, 150);
}

GM_addStyle("#NotifyTide {\n	width: 100%;\n	text-align: center;\n	color: white;\n	font-size: 28px;\n	vertical-align: middle;\n	pointer-events: none;\n	-webkit-user-select: none;\n	-moz-user-select: none;\n}\n#NotifyTide p {\n	background: rgba(255, 119, 119, .5);\n	padding: 25px 0px 25px 0px;\n	text-shadow: red 0 0 5px, red 0 0 5px, red 0 0 7px, red 0 0 7px, red 0 0 10px, red 0 0 10px, red 0 0 15px, red 0 0 15px;\n}\n\n#setting_shadow {\n	position: fixed;\n	z-index: 1024000000;\n	bottom: 0;\n	left: 0;\n	width: 100%;\n	height: 100%;\n	background: rgba(0, 0, 0, 0.5);\n	-moz-transition: 0.4s;\n}\n#setting_window {\n	position: fixed;\n	top: -moz-calc(50% - 320px);\n	top: -webkit-calc(50% - 320px);\n	left: -moz-calc(50% - 300px);\n	left: -webkit-calc(50% - 300px);\n	width: 600px;\n	background: #FFF;\n	box-shadow: 0 0 5px #222;\n	padding: 20px 20px 50px 20px;\n	z-index: 1000000000;\n	-moz-transition: 0.4s ease all;\n}\n#setting_out_div {\n	overflow-y: scroll;\n	padding: 0 10px 0 0;\n	max-height:500px;\n}\n.setting_btn_inside {\n	font-size: 16px;\n	padding: 4px;\n	-moz-user-select: none;\n	cursor: default;\n}\n.setting_btn_inside:hover {\n	background: #DDD;\n}\n.setting_btn_inside:active {\n	box-shadow: 0 0 3px #999 inset;\n}\n#setting_reset {\n	position: absolute;\n	top: 14px;\n	right: 14px;\n}\n#setting_save {\n	display: inline-block;\n	position: absolute;\n	right: 15px;\n	bottom: 10px;\n}\n.setting_sp_btn {\n	font-size: 12px;\n	padding: 4px;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n	position: relative;\n}\n.setting_sp_btn.close {\n	background: #DDD;\n}\n.setting_sp_btn::before {\n	position: absolute;\n	right: -26px;\n	top: 0;\n	content: \"\";\n	width: 26px;\n	height: 26px;\n	background: #6B4;\n	-moz-transition: 0.3s;\n}\n.setting_sp_btn.close::before {\n	background: #C54;\n}\n.setting_sp_btn:hover {\n	background: #DDD;\n}\n.setting_sp_btn:active {\n	box-shadow: 0 0 3px #999 inset;\n}\n#setting_sp_q_c {\n	margin: 0 0 0 40px !important;\n}\n#setting_window .setting_title {\n	font-size: 34px;\n	height: 42px;\n	line-height: 42px;\n	padding: 7px 10px;\n	margin: 0 0 0 -7px;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n}\n#setting_window p {\n	font-size: 18px;\n	height: 42px;\n	line-height: 50px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window p.setting_hide {\n	height: 10px;\n	line-height: 10px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window p.setting_hide.sp {\n	background: #CCC !important;\n	height: 1px !important;\n	margin: 8px 0 !important;\n}\n#setting_window p.setting_hiding_sp {\n	height: 1px;\n	line-height: 1px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window .setting_input {\n	-moz-appearance: none;\n	border: none;\n	background: #DDD;\n	height: 28px;\n	padding: 0px 7px !important;\n	width: 100px;\n	margin: 0 10px 0 0 !important;\n	font-size: 14px !important;\n}\n#setting_window span {\n	font-size: 14px !important;\n	margin: 0 10px 0 0 !important;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n}\n.setting_textarea {\n	-moz-appearance: none !important;\n	border: none;\n	background: #DDD;\n	margin: 10px 0 0 0 !important;\n	padding: 7px !important;\n	width: 550px;\n	height: 100px;\n	-moz-box-sizing: border-box;\n	font-size: 12px !important;\n}\n#tail_select {\n	display: inline-block;\n	height: 26px !important;\n	line-height: 26px !important;\n	width: 450px !important;\n	margin: 0px 0 0 40px !important;\n	vertical-align: top !important;\n	text-align: center !important;\n	font-size: 12px !Important;\n	-moz-box-sizing: border-box !Important;\n	position: relative !important;\n	cursor: default !important;\n}\n#tail_select_text {\n	height: 26px;\n	float: left;\n	min-width: 100px !important;\n	background: #DDD !important;\n	padding: 0 5px !important;\n	-moz-box-sizing: border-box !Important;\n}\n#tail_option_box {\n	float: left;\n	position: absolute !important;\n	bottom: 30px;\n	left: 0;\n	min-width: 100px;\n	background: #EEE !important;\n	box-shadow: 0 0 3px #666 !important;\n	display: inline-block;\n}\n.tail_option {\n	padding: 0 8px !important;\n	width: auto !important;\n	font-size: 12px !important;\n	height: 24px !important;\n	line-height: 24px !important;\n	cursor: default !important;\n}\n.tail_option:hover {\n	background: #DDD !important;\n}\n#tail_type {\n	background: #DDD !important;\n	position: absolute !important;\n	top: 0;\n	right: 0px;\n}\n#tail_type_text {\n	width: 80px !important;\n	text-align: center !important;\n}\n#tail_type_box {\n	position: absolute !important;\n	width: 80px !important;\n	bottom: 30px;\n	right: 0px;\n	background: #EEE;\n	box-shadow: 0 0 3px #666;\n}\n.tail_type_option:hover {\n	background: #DDD;\n}\n#tail_save {\n	font-size: 12px !important;\n	position: absolute;\n	top: 0;\n	right: 90px;\n	height: 26px !important;\n	padding: 0 !important;\n	width: 86px !important;\n}\n#tail_new {\n	font-size: 12px !important;\n	-moz-box-sizing: border-box !Important;\n	padding: 0 !important;\n	height: 26px !important;\n	width: 60px !important;\n	position: absolute !important;\n	top: 0 !important;\n	right: 180px !important;\n}\n#tail_delete {\n	font-size: 12px !important;\n	-moz-box-sizing: border-box !Important;\n	padding: 0 !important;\n	height: 26px !important;\n	width: 60px !important;\n	position: absolute !important;\n	top: 0 !important;\n	right: 250px !important;\n}\n#tail_data + span {\n	display: block !Important;\n	margin: 5px 0 -3px 0 !important;\n	font-size: 12px !Important;\n}\n#tail_use {\n	margin-left: 20px;\n	margin-right: 20px;\n	height: 30px;\n	width: auto;\n	float: left !important;\n	cursor: default;\n}\n#tail_use_text {\n	width: auto;\n	padding: 0 10px;\n	line-height: 28px !important;\n	text-align: center !important;\n}\n#tail_use_box_out {\n	position: absolute !important;\n	width: 300px !important;\n}\n#tail_use_box {\n	position: absolute !important;\n	background: #EEE;\n	bottom: 35px;\n	left: 0;\n	box-shadow: 0 0 3px #666;\n	z-index: 100;\n}\n.tail_use_option {\n	padding: 0 10px;\n	line-height: 30px !important;\n}\n.tail_use_option:hover {\n	background: #DDD;\n}");
