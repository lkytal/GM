// ==UserScript==
// @name						Tieba Enhance
// @namespace					lkytal
// @author						lkytal
// @homepage					http://lkytal.github.io/
// @description					贴吧小尾巴, 坟贴提醒, 去除跳转等功能
// @include						http://tieba.baidu.com/*
// @include						https://tieba.baidu.com/*
// @version						6.2.1
// @author						lkytal
// @require						http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @icon						http://lkytal.qiniudn.com/tieba.png
// @noframes
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

var AddTail,
    CheckPost,
    TailInit,
    TiebaInit,
    addTiebaCSS,
    clearLink,
    log,
    open_setting_window,
    tiebaData,
    hasProp = {}.hasOwnProperty;

window.$ = window.jQuery = jQuery.noConflict(true);

tiebaData = {
  StopPost: 0,
  count: 0
};

log = function (msg) {
  var text;
  tiebaData.count += 1;
  text = "hit " + tiebaData.count + " : " + msg;
  return console.log(text);
};

//setting win
open_setting_window = function () {
  var UpdateText, ref, ref1, x;
  $('setting_shadow').remove();
  $('body').append("<div id=\"setting_shadow\" style=\"display:none\"> <div id=\"setting_window\"> <div id=\"setting_reset\" class=\"setting_btn_inside\">重置</div> <div id=\"setting_save\" class=\"setting_btn_inside\">保存</div> <div id=\"setting_close\" class=\"setting_title setting_btn_inside\">设置</div> <p class=\"setting_hiding_sp\"></p> <div id=\"setting_out_div\"> <div id=\"fentie_open\" class=\"setting_sp_btn\">坟贴检测</div> <div class=\"setting_sp\"> <p class=\"setting_hide\"></p><span>超过</span> <input class=\"setting_input\" type=\"number\" id=\"fentie_date\"></input><span>天的帖子视为坟贴</span> <div id=\"fentie_forbidden\" class=\"setting_sp_btn\">坟贴禁回</div> </div> <p class=\"setting_hide sp\"></p> <div id=\"tail_open\" class=\"setting_sp_btn\">小尾巴</div> <div id=\"tail_select\"> <div id=\"tail_select_text\" contenteditable=\"true\"></div> <div id=\"tail_option_box\"></div> <div id=\"tail_type\"> <div id=\"tail_type_text\"></div> <div id=\"tail_type_box\"> <div class=\"tail_type_option\">html</div> <div class=\"tail_type_option\">javascript</div> </div> </div> <div id=\"tail_save\" class=\"setting_btn_inside\">保存当前尾巴</div> <div id=\"tail_new\" class=\"setting_btn_inside\">新建尾巴</div> <div id=\"tail_delete\" class=\"setting_btn_inside\">删除尾巴</div> </div> <div class=\"setting_sp\"> <textarea class=\"setting_textarea\" id=\"tail_data\"></textarea><span>预览</span> <div class=\"setting_textarea\" id=\"tail_data_show\"></div> <p class=\"hiding_margin\" style=\"width:1px;height:20px;\"></p> </div> </div> </div> </div>");
  //读取设置
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
  ref = tiebaData.tail_data;
  for (x in ref) {
    if (!hasProp.call(ref, x)) continue;
    $("#tail_select_text")[0].innerHTML = x;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", x);
    $("#tail_data")[0].value = tiebaData.tail_data[x].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[x].split("!分隔!")[1];
    break;
  }
  ref1 = tiebaData.tail_data;
  for (x in ref1) {
    if (!hasProp.call(ref1, x)) continue;
    $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
  }
  UpdateText = function () {
    var e;
    if ($("#tail_type_text")[0].innerHTML === "javascript") {
      try {
        $("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
      } catch (error) {
        e = error;
        $("#tail_data_show")[0].innerHTML = e;
      }
    } else {
      if ($("#tail_type_text")[0].innerHTML === "html") {
        $("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
      }
    }
  };
  UpdateText();
  $(".tail_option").click(function () {
    $("#tail_select_text")[0].innerHTML = this.innerHTML;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", this.innerHTML);
    $("#tail_data")[0].value = tiebaData.tail_data[this.innerHTML].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[this.innerHTML].split("!分隔!")[1];
    return UpdateText();
  });
  $(".tail_type_option").click(function () {
    $("#tail_type_text")[0].innerHTML = this.innerHTML;
    return UpdateText();
  });
  $("#tail_data").keyup(function () {
    return UpdateText();
  });
  $("#setting_shadow").fadeIn(400);
  //按钮
  $("#setting_close").mouseenter(function () {
    return this.innerHTML = "关闭";
  });
  $("#setting_close").mouseleave(function () {
    return this.innerHTML = "设置";
  });
  //$("#setting_window").click (e) -> e.stopPropagation()
  $("#setting_close").click(function () {
    return $("#setting_shadow").fadeOut(400, function () {
      return $("#setting_shadow").remove();
    });
  });
  $("#setting_reset").click(function () {
    var j, key, len, ref2;
    if (confirm("确定重置设置吗(会刷新页面)")) {
      ref2 = GM_listValues();
      for (j = 0, len = ref2.length; j < len; j++) {
        key = ref2[j];
        GM_deleteValue(key);
      }
      window.location.reload();
    }
  });
  $("#fentie_open").click(function () {
    $("#fentie_open + div").slideToggle("slow");
    if (tiebaData.fentie_open) {
      tiebaData.fentie_open = 0;
      return $("#fentie_open").attr("class", "setting_sp_btn close");
    } else {
      tiebaData.fentie_open = 1;
      return $("#fentie_open").attr("class", "setting_sp_btn");
    }
  });
  $("#fentie_forbidden").click(function () {
    if (tiebaData.fentie_forbidden) {
      tiebaData.fentie_forbidden = 0;
      $("#fentie_forbidden").attr("class", "setting_sp_btn close");
    } else {
      tiebaData.fentie_forbidden = 1;
      $("#fentie_forbidden").attr("class", "setting_sp_btn");
    }
  });
  $("#tail_open").click(function () {
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
  $("#tail_select_text").click(function () {
    var hideSelect;
    $("#tail_select_text + div").show(400);
    $(document).bind("click", hideSelect = function (e) {
      if (e.target.id !== "tail_select_text" && e.target.id !== "tail_open") {
        $("#tail_select_text + div").hide(400);
        $(document).unbind("click", hideSelect);
      }
    });
  });
  $("#tail_type_text + div").css("display", "none");
  $("#tail_type_text").click(function () {
    var hideType;
    $("#tail_type_text + div").show(400);
    $(document).bind("click", hideType = function (e) {
      if (e.target.id !== "tail_type_text" && e.target.id !== "tail_open") {
        $("#tail_type_text + div").hide(400);
        $(document).unbind("click", hideType);
      }
    });
  });
  $("#tail_new").click(function () {
    $("#tail_select_text").attr("new", "1");
    $("#tail_select_text").attr("oname", "");
    $("#tail_select_text")[0].textContent = "New" + Math.random().toString().substr(3, 3);
    $("#tail_data")[0].value = "<br>小尾巴脚本Tieba Enhance:<br>https://git.oschina.net/coldfire/GM";
    $("#tail_type_text")[0].textContent = "html";
  });
  $("#tail_delete").click(function () {
    var oname, ref2, ref3;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") !== 1) {
      delete tiebaData.tail_data[oname];
    }
    ref2 = tiebaData.tail_data;
    for (x in ref2) {
      if (!hasProp.call(ref2, x)) continue;
      $("#tail_select_text")[0].innerHTML = x;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", x);
      $("#tail_data")[0].value = tiebaData.tail_data[x].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tiebaData.tail_data[x].split("!分隔!")[1];
      break;
    }
    //save
    GM_setValue("tail_data", JSON.stringify(tiebaData.tail_data));
    //reload
    $("#tail_option_box").empty();
    ref3 = tiebaData.tail_data;
    for (x in ref3) {
      if (!hasProp.call(ref3, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    UpdateText();
  });
  $("#tail_save").click(function () {
    var name, oname, ref2, ref3;
    name = $("#tail_select_text")[0].innerHTML;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") === 1) {
      if (tiebaData.tail_data[name] != null) {
        return alert("该尾巴已存在！");
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
    ref2 = tiebaData.tail_data;
    for (x in ref2) {
      if (!hasProp.call(ref2, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/,/g, "!逗号!").replace(/"/g, "!引号!");
    }
    GM_setValue("tail_data", JSON.stringify(tiebaData.tail_data));
    //reload
    $("#tail_option_box").empty();
    ref3 = tiebaData.tail_data;
    for (x in ref3) {
      if (!hasProp.call(ref3, x)) continue;
      tiebaData.tail_data[x] = tiebaData.tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    UpdateText();
  });
  //保存部分
  $("#setting_save").click(function () {
    tiebaData.fentie_date = $("#fentie_date")[0].value;
    GM_setValue("fentie_open", tiebaData.fentie_open);
    GM_setValue("fentie_date", tiebaData.fentie_date);
    GM_setValue("fentie_forbidden", tiebaData.fentie_forbidden);
    GM_setValue("tail_open", tiebaData.tail_open);
    return $("#setting_shadow").fadeOut(400, function () {
      return $("#setting_shadow").remove();
    });
  });
};

//坟贴检测函数
CheckPost = function () {
  var date_str, date_time, days, years;
  if ($("#j_core_title_wrap").length && tiebaData.fentie_open) {
    date_str = $("#j_p_postlist ul.p_tail > li:nth-child(2) > span")[0].textContent;
    if (date_str === "1970-01-01 07:00") {
      return setTimeout(CheckPost, 500);
    }
    date_str = date_str.replace(" ", "-").replace(":", "-").split("-");
    date_time = new Date(date_str[0], date_str[1] - 1, date_str[2], date_str[3], date_str[4]);
    days = Math.round(new Date() - date_time) / 86400000;
    if (days >= tiebaData.fentie_date) {
      if (days >= 365) {
        years = Math.round(days / 365);
        days = years + "\u5E74" + (days - years * 365);
      }
      $("#tb_nav").after("<div id='NotifyTide'><p>\u8FD9\u662F\u4E00\u4E2A " + days + " \u5929\u7684\u575F\u8D34\u54E6~</p></div>");
      if (tiebaData.fentie_forbidden) {
        return tiebaData.StopPost = 1;
      }
    }
  }
};

//Tail
AddTail = function (e) {
  var currentTail, key, tailList;
  if (tiebaData.StopPost === 1) {
    if (!confirm("这可能是一个坟贴, 确认要回复么?")) {
      return $("#ueditor_replace").empty();
    }
  }
  if (tiebaData.tail_cur === "不使用小尾巴") {
    return;
  }
  if (tiebaData.tail_cur === "随机小尾巴") {
    tailList = function () {
      var ref, results;
      ref = tiebaData.tail_data;
      results = [];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        results.push(key);
      }
      return results;
    }();
    tiebaData.tail_cur = tailList[Math.round(Math.random() * tailList.length)];
  }
  currentTail = tiebaData.tail_data[tiebaData.tail_cur].split("!分隔!");
  if (currentTail[1] === "html") {
    $("#ueditor_replace").append("<br>" + currentTail[0]);
  } else if (currentTail[1] === "javascript") {
    $("#ueditor_replace").append("<br>" + eval(currentTail[0]));
  }
};

TailInit = function () {
  var SendBt, i, ref, ref1, x;
  if (!tiebaData.tail_open) {
    return;
  }
  if (document.querySelector(".ui_btn.ui_btn_m.j_submit.poster_submit")) {
    $("a.j_submit.poster_submit").before("<span id=\"tail_use\"> <span class=\"ui_btn ui_btn_m\"> <span id=\"tail_use_text\"></span> </span> <div id=\"tail_use_box_out\"> <div id=\"tail_use_box\" style=\"display:none;\"></div> </div> </span>");
    $("#tail_use_text").click(function () {
      return $("#tail_use_box").slideToggle(400);
    });
    $(document).bind("click", function (e) {
      if (e.target.id !== "tail_use_text") {
        $("#tail_use_box").slideUp(400);
      }
    });
    if (tiebaData.tail_cur === "不使用小尾巴" || tiebaData.tail_cur === "随机小尾巴") {
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
    } else if (typeof tiebaData.tail_data[tiebaData.tail_cur] === "undefined") {
      ref = tiebaData.tail_data;
      for (i in ref) {
        if (!hasProp.call(ref, i)) continue;
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
    ref1 = tiebaData.tail_data;
    for (x in ref1) {
      if (!hasProp.call(ref1, x)) continue;
      $("#tail_use_box").append("<div class='tail_use_option'>" + x + "</div>");
    }
    $(".tail_use_option").click(function () {
      tiebaData.tail_cur = this.innerHTML;
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
      GM_setValue("tail_cur", tiebaData.tail_cur);
    });
    SendBt = document.querySelector("a.j_submit.poster_submit[title=\"Ctrl+Enter快捷发表\"]");
    SendBt.addEventListener("click", AddTail, true);
    document.onkeydown = function (event) {
      if (event.ctrlKey && event.keyCode === 13) {
        return AddTail();
      }
    };
  } else {
    setTimeout(TailInit, 100);
  }
};

clearLink = function (event) {
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

TiebaInit = function () {
  addTiebaCSS();
  tiebaData.fentie_open = GM_getValue("fentie_open", 1);
  tiebaData.fentie_date = GM_getValue("fentie_date", 30);
  tiebaData.fentie_forbidden = GM_getValue("fentie_forbidden", 1);
  tiebaData.tail_open = GM_getValue("tail_open", 1);
  tiebaData.tail_cur = GM_getValue("tail_cur", "");
  tiebaData.tail_data = JSON.parse(GM_getValue("tail_data", "{\"Default\":\" !分隔!html\"}"));
  tiebaData._style_setted = 0;
  $("#tb_nav").find("ul:first").append("<li id=\"setting_btn\" class=\"star_nav_tab\"> <div class=\"star_nav_tab_inner\"> <div class=\"space\"> <a style=\"cursor:pointer;-moz-user-select:none;\" class=\"star_nav_ico star_nav_ico_good\">设置</a> </div> </div> </li>");
  jQuery("body").on("mouseover", "a", clearLink);
  setTimeout(CheckPost, 500);
  $("#setting_btn").click(function () {
    return open_setting_window();
  });
  TailInit();
};

if (window.self === window.top) {
  setTimeout(TiebaInit, 150);
}

addTiebaCSS = function () {
  return GM_addStyle("#NotifyTide { width: 100%; text-align: center; color: white; font-size: 28px; vertical-align: middle; pointer-events: none; -webkit-user-select: none; -moz-user-select: none; } #NotifyTide p { background: rgba(255, 119, 119, .5); padding: 25px 0px 25px 0px; text-shadow: red 0 0 5px, red 0 0 5px, red 0 0 7px, red 0 0 7px, red 0 0 10px, red 0 0 10px, red 0 0 15px, red 0 0 15px; } #setting_shadow { position: fixed; z-index: 1024000000; bottom: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); -moz-transition: 0.4s; } #setting_window { position: fixed; top: -moz-calc(50% - 270px); top: -webkit-calc(50% - 270px); top: calc(50% - 270px); left: -moz-calc(50% - 300px); left: -webkit-calc(50% - 300px); left: calc(50% - 300px); width: 600px; background: #FFF; box-shadow: 0 0 5px #222; padding: 20px 20px 50px 20px; z-index: 1000000000; } #setting_out_div { overflow-y: scroll; padding: 0 10px 0 0; max-height:500px; } .setting_btn_inside { font-size: 16px; padding: 4px; -moz-user-select: none; cursor: default; } .setting_btn_inside:hover { background: #DDD; } .setting_btn_inside:active { box-shadow: 0 0 3px #999 inset; } #setting_reset { position: absolute; top: 14px; right: 14px; } #setting_save { display: inline-block; position: absolute; right: 15px; bottom: 10px; } .setting_sp_btn { font-size: 12px; padding: 4px; -moz-user-select: none; cursor: default; display: inline-block; position: relative; } .setting_sp_btn.close { background: #DDD; } .setting_sp_btn::before { position: absolute; right: -26px; top: 0; content: \"\"; width: 26px; height: 26px; background: #6B4; -moz-transition: 0.3s; } .setting_sp_btn.close::before { background: #C54; } .setting_sp_btn:hover { background: #DDD; } .setting_sp_btn:active { box-shadow: 0 0 3px #999 inset; } #setting_sp_q_c { margin: 0 0 0 40px !important; } #setting_window .setting_title { font-size: 34px; height: 42px; line-height: 42px; padding: 7px 10px; margin: 0 0 0 -7px; -moz-user-select: none; cursor: default; display: inline-block; } #setting_window p { font-size: 18px; height: 42px; line-height: 50px; -moz-user-select: none; cursor: default; } #setting_window p.setting_hide { height: 10px; line-height: 10px; -moz-user-select: none; cursor: default; } #setting_window p.setting_hide.sp { background: #CCC !important; height: 1px !important; margin: 8px 0 !important; } #setting_window p.setting_hiding_sp { height: 1px; line-height: 1px; -moz-user-select: none; cursor: default; } #setting_window .setting_input { -moz-appearance: none; border: none; background: #DDD; height: 28px; padding: 0px 7px !important; width: 100px; margin: 0 10px 0 0 !important; font-size: 14px !important; } #setting_window span { font-size: 14px !important; margin: 0 10px 0 0 !important; -moz-user-select: none; cursor: default; display: inline-block; } .setting_textarea { -moz-appearance: none !important; border: none; background: #DDD; margin: 10px 0 0 0 !important; padding: 7px !important; width: 550px; height: 100px; -moz-box-sizing: border-box; font-size: 12px !important; } #tail_select { display: inline-block; height: 26px !important; line-height: 26px !important; width: 450px !important; margin: 0px 0 0 40px !important; vertical-align: top !important; text-align: center !important; font-size: 12px !Important; -moz-box-sizing: border-box !Important; position: relative !important; cursor: default !important; } #tail_select_text { height: 26px; float: left; min-width: 100px !important; background: #DDD !important; padding: 0 5px !important; -moz-box-sizing: border-box !Important; } #tail_option_box { float: left; position: absolute !important; bottom: 30px; left: 0; min-width: 100px; background: #EEE !important; box-shadow: 0 0 3px #666 !important; display: inline-block; } .tail_option { padding: 0 8px !important; width: auto !important; font-size: 12px !important; height: 24px !important; line-height: 24px !important; cursor: default !important; } .tail_option:hover { background: #DDD !important; } #tail_type { background: #DDD !important; position: absolute !important; top: 0; right: 0px; } #tail_type_text { width: 80px !important; text-align: center !important; } #tail_type_box { position: absolute !important; width: 80px !important; bottom: 30px; right: 0px; background: #EEE; box-shadow: 0 0 3px #666; } .tail_type_option:hover { background: #DDD; } #tail_save { font-size: 12px !important; position: absolute; top: 0; right: 90px; height: 26px !important; padding: 0 !important; width: 86px !important; } #tail_new { font-size: 12px !important; -moz-box-sizing: border-box !Important; padding: 0 !important; height: 26px !important; width: 60px !important; position: absolute !important; top: 0 !important; right: 180px !important; } #tail_delete { font-size: 12px !important; -moz-box-sizing: border-box !Important; padding: 0 !important; height: 26px !important; width: 60px !important; position: absolute !important; top: 0 !important; right: 250px !important; } #tail_data + span { display: block !Important; margin: 5px 0 -3px 0 !important; font-size: 12px !Important; } #tail_use { margin-left: 20px; margin-right: 20px; height: 30px; width: auto; float: left !important; cursor: default; } #tail_use_text { width: auto; padding: 0 10px; line-height: 28px !important; text-align: center !important; } #tail_use_box_out { position: absolute !important; width: 300px !important; } #tail_use_box { position: absolute !important; background: #EEE; bottom: 35px; left: 0; box-shadow: 0 0 3px #666; z-index: 100; } .tail_use_option { padding: 0 10px; line-height: 30px !important; } .tail_use_option:hover { background: #DDD; }");
};