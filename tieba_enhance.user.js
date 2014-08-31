// ==UserScript==
// @name						Tieba Enhance
// @namespace					lkytal
// @author						lkytal
// @description					贴吧小尾巴, 坟贴提醒, 去除跳转, 最近表情等功能
// @include						http://tieba.baidu.com/*
// @include						https://tieba.baidu.com/*
// @version						5.9.2
// @author						lkytal
// @require						http://code.jquery.com/jquery-2.1.1.min.js
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
;
var CheckPost, NodeInsertListener, SmileConfig, SmileInit, TailInit, checkFather, count, fentie_date, fentie_forbidden, fentie_open, log, maxCount, maxHeight, maxWidth, open_setting_window, saveConfig, smiley_delay, smiley_height, smiley_max, smiley_open, smiley_width, tail_data, tail_open, tiebaData, x, _style_setted;

count = 0;

log = function(msg) {
  var text;
  count += 1;
  text = "hit at : " + count;
  if (msg != null) {
    text = "hit " + count + " : " + msg;
  }
  return console.log(text);
};

tiebaData = {
  StopPost: 0
};

smiley_open = GM_getValue("smiley_open", 1);

smiley_height = GM_getValue("smiley_height", 500);

smiley_width = GM_getValue("smiley_width", 500);

smiley_delay = GM_getValue("smiley_delay", 240);

smiley_max = GM_getValue("smiley_max", 20);

fentie_open = GM_getValue("fentie_open", 1);

fentie_date = GM_getValue("fentie_date", 30);

fentie_forbidden = GM_getValue("fentie_forbidden", 1);

tail_open = GM_getValue("tail_open", 1);

tiebaData.tail_cur = GM_getValue("tiebaData.tail_cur", "");

tail_data = JSON.parse(GM_getValue("tail_data", "{\"Default\":\" !分隔!html\"}"));

maxCount = smiley_max;

maxHeight = smiley_height;

maxWidth = smiley_width;

_style_setted = 0;

if (GM_getValue("tail_adopt", 0) < 2) {
  GM_setValue("tail_adopt", 2);
  if (typeof localStorage["tail_data"] === "string") {
    GM_setValue("tail_data", localStorage["tail_data"]);
    tail_data = JSON.parse(localStorage["tail_data"]);
  }
  GM_setValue("smiley_open", smiley_open);
  GM_setValue("smiley_height", smiley_height);
  GM_setValue("smiley_width", smiley_width);
  GM_setValue("smiley_delay", smiley_delay);
  GM_setValue("smiley_max", smiley_max);
  GM_setValue("fentie_open", fentie_open);
  GM_setValue("fentie_date", fentie_date);
  GM_setValue("fentie_forbidden", fentie_forbidden);
  GM_setValue("tail_open", tail_open);
  GM_setValue("tail_data", JSON.stringify(tail_data));
  for (x in tail_data) {
    tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
  }
}

saveConfig = function() {
  GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
};

NodeInsertListener = function(selector, callback, once) {
  var cssString, handler, id;
  cssString = " { animation-name: listener{id};animation-duration: 0.001s;} @keyframes listener{id} { from { opacity: 0.99; } to {opacity: 1; } }";
  id = new Date().getTime();
  GM_addStyle(selector + cssString.replace(/\{id\}/g, id));
  handler = (function(e) {
    if (e.animationName === "listener" + id) {
      if (once) {
        this.stop();
      }
      callback(e.target);
    }
  }).bind(this);
  this.stop = function() {
    removeEventListener("animationend", handler);
  };
  addEventListener("animationend", handler);
};

SmileInit = function() {
  new NodeInsertListener(".edui-btn-emotion", function() {
    var mousein, panel, pushImages;
    panel = unsafeWindow.$.eduipopup().clone().appendTo(".edui-dialog-container").attr("style", "z-index: 1; display: none; top: 44px; left: -3px; position: absolute;");
    panel.find(".edui-popup-caret").addClass("up").attr("style", "top: -8px; left: 247px; position: absolute;");
    unsafeWindow._.Module.use("common/component/UeditorEmotion", [
      {
        container: $("<div class=\"j_emotion_container emotion_container\"></div>")
      }
    ], function(h) {
      var content;
      content = h.$container.appendTo(panel.find(".edui-popup-body"));
      content.find(".s_layer_tab.j_tab.ueditor_emotion_tab").remove();
      NodeInsertListener("table", (function() {
        var cell, pushImages, table;
        table = content.find("table tbody");
        cell = table.find(".j_emotion").eq(0).clone().removeClass("face").empty().css("cursor", "pointer").click(function() {
          unsafeWindow.test_editor.execCommand("inserthtml", "<img class=\"BDE_Smiley\" onload=\"EditorUI.resizeImage(this, 560)\" src=\"" + $(this).data("surl") + "\">");
          panel.hide();
        }).append($("<img>").css("max-height", "54px").css("max-width", "54px"));
        GM_addStyle(".review { max-height: 60px; max-width: 60px; }");
        table.parent().before($("<div>ctrl + 左键点击删除表情</div>"));
        pushImages = function() {
          var i;
          table.empty();
          i = 0;
          while (i < SmileConfig.length / 10) {
            table.append($("<tr>").append($(SmileConfig.slice(10 * i, 10 * (i + 1)).map(function(img) {
              var newCell;
              newCell = cell.clone(true).data("surl", img);
              newCell.find("img").attr("src", img);
              return newCell.get(0);
            }))));
            i++;
          }
          table.find("img").click(function(event) {
            if (event.ctrlKey) {
              SmileConfig.splice(SmileConfig.indexOf($(this).attr("src")), 1);
              GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
              $(this).parent().remove();
              event.preventDefault();
              event.stopPropagation();
            }
          });
        };
        pushImages();
      }), true);
    });
    pushImages = function() {};
    mousein = false;
    $(".edui-btn-emotion").click(function() {
      panel.hide();
      mousein = false;
    }).add(panel).mouseenter(function() {
      panel.show();
      mousein = true;
    }).mouseleave(function() {
      mousein = false;
      setTimeout((function() {
        if (!mousein) {
          panel.hide();
        }
      }), 300);
    });
    NodeInsertListener("#ueditor_replace img", function(node) {
      var i, idp, img;
      if (node.width <= maxWidth && node.height <= maxHeight) {
        img = node.src;
        if (img.indexOf("data:image") !== -1) {
          return;
        }
        if (img.indexOf("static.tieba.baidu.com/tb/editor/images/face/") !== -1) {
          idp = img.lastIndexOf("?t=");
          img = img.slice(0, idp);
        }
        i = SmileConfig.indexOf(img);
        if (i !== -1) {
          SmileConfig.splice(i, 1);
        } else {
          if (SmileConfig.length === maxCount) {
            SmileConfig.pop();
          }
        }
        SmileConfig.unshift(img);
        saveConfig();
        pushImages();
      }
    });
  }, true);
};

checkFather = function(that, e) {
  var parent;
  parent = e.relatedTarget;
  try {
    while (parent && parent !== that) {
      parent = parent.parentNode;
    }
    return parent !== that;
  } catch (_error) {}
};

open_setting_window = function() {
  var e, _tmp;
  if (_style_setted === 0) {
    if (window.innerHeight <= 727) {
      GM_addStyle("#setting_window{top:50px;}#setting_out_div{max-height:" + (window.innerHeight - 227) + "px;}");
    } else {
      GM_addStyle("#setting_window{top:" + ((window.innerHeight - 627) / 2) + "px;}#setting_out_div{max-height:500px;}");
    }
    _style_setted = 1;
  }
  _tmp = document.createElement("div");
  _tmp.id = "setting_shadow";
  _tmp.innerHTML += "<div id=\"setting_window\"style=\"top:-100%;\"><div id=\"setting_reset\"class=\"setting_btn_inside\">重置</div><div id=\"setting_save\"class=\"setting_btn_inside\">保存</div><div id=\"setting_close\"class=\"setting_title setting_btn_inside\">设置</div><p class=\"setting_hiding_sp\"></p><div id=\"setting_out_div\"><div id=\"setting_sp_smiley\"class=\"setting_sp_btn\">最近使用的表情</div><div class=\"setting_sp\"><p>最近使用的表情仅获取符合以下条件的图片</p><span>图片宽度≤</span><input class=\"setting_input\"type=\"number\"id=\"smiley_width\"></input><span>图片高度≤</span><input class=\"setting_input\"type=\"number\"id=\"smiley_height\"></input><p>最近使用的表情窗口弹出延迟</p><input class=\"setting_input\"type=\"number\"id=\"smiley_delay\"></input><span>延迟时间(毫秒)</span><div id=\"setting_clear_smiley\"class=\"setting_btn_inside\">清空最近表情</div><p class=\"setting_hide\"></p><input class=\"setting_input\"type=\"number\"id=\"smiley_max\"></input><span>最大表情数量</span><p class=\"setting_hide\"></p><p class=\"setting_hide\"><div id=\"smiley_close_after_click\"class=\"setting_sp_btn\">点击表情后关闭窗口</div></div><p class=\"setting_hide sp\"></p><div id=\"fentie_open\"class=\"setting_sp_btn\">坟贴检测</div><div class=\"setting_sp\"><p class=\"setting_hide\"></p><span>超过</span><input class=\"setting_input\"type=\"number\"id=\"fentie_date\"></input><span>天的帖子视为坟贴</span><div id=\"fentie_forbidden\"class=\"setting_sp_btn\">坟贴禁回</div></div><p class=\"setting_hide sp\"></p><div id=\"tail_open\"class=\"setting_sp_btn\">小尾巴</div><div id=\"tail_select\"><div id=\"tail_select_text\"contenteditable=\"true\"></div><div id=\"tail_option_box\"></div><div id=\"tail_type\"><div id=\"tail_type_text\"></div><div id=\"tail_type_box\"><div class=\"tail_type_option\">html</div><div class=\"tail_type_option\">javascript</div></div></div><div id=\"tail_save\"class=\"setting_btn_inside\">保存当前尾巴</div><div id=\"tail_new\"class=\"setting_btn_inside\">新建尾巴</div><div id=\"tail_delete\"class=\"setting_btn_inside\">删除尾巴</div></div><div class=\"setting_sp\"><textarea class=\"setting_textarea\"id=\"tail_data\"></textarea><span>预览</span><div class=\"setting_textarea\"id=\"tail_data_show\"></div><p class=\"hiding_margin\"style=\"width:1px;height:20px;\"></p></div></div></div>";
  document.body.appendChild(_tmp);
  $("#smiley_height")[0].value = smiley_height;
  $("#smiley_width")[0].value = smiley_width;
  $("#smiley_delay")[0].value = smiley_width;
  $("#smiley_max")[0].value = smiley_max;
  $("#fentie_date")[0].value = fentie_date;
  if (!smiley_open) {
    $("#setting_sp_smiley").attr("class", "setting_sp_btn close");
    $("#setting_sp_smiley + div").css("display", "none");
  }
  if (!fentie_open) {
    $("#fentie_open").attr("class", "setting_sp_btn close");
    $("#fentie_open + div").css("display", "none");
  }
  if (!fentie_forbidden) {
    $("#fentie_forbidden").attr("class", "setting_sp_btn close");
  }
  if (!tail_open) {
    $("#tail_open").attr("class", "setting_sp_btn close");
    $("#tail_select,#tail_select + div").css("display", "none");
  }
  for (x in tail_data) {
    $("#tail_select_text")[0].innerHTML = x;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", x);
    $("#tail_data")[0].value = tail_data[x].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tail_data[x].split("!分隔!")[1];
    break;
  }
  for (x in tail_data) {
    $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
  }
  $(".tail_option").click(function() {
    var e;
    $("#tail_select_text")[0].innerHTML = this.innerHTML;
    $("#tail_select_text").attr("new", "0");
    $("#tail_select_text").attr("oname", this.innerHTML);
    $("#tail_data")[0].value = tail_data[this.innerHTML].split("!分隔!")[0];
    $("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split("!分隔!")[1];
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
  _tmp.style.opacity = "0";
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
    $("#setting_window")[0].style.top = "-600px";
    setTimeout((function() {
      $("#setting_shadow").css("opacity", "0");
    }), 200);
    setTimeout((function() {
      $("#setting_shadow").remove();
      $("#setting_window").remove();
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
  $("#setting_sp_smiley").click(function() {
    $("#setting_sp_smiley + div").slideToggle("slow");
    if (smiley_open) {
      smiley_open = 0;
      $("#setting_sp_smiley").attr("class", "setting_sp_btn close");
    } else {
      smiley_open = 1;
      $("#setting_sp_smiley").attr("class", "setting_sp_btn");
    }
  });
  $("#setting_clear_smiley").click(function() {
    var SmileConfig;
    SmileConfig = [];
    GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
  });
  $("#fentie_open").click(function() {
    $("#fentie_open + div").slideToggle("slow");
    if (fentie_open) {
      fentie_open = 0;
      $("#fentie_open").attr("class", "setting_sp_btn close");
    } else {
      fentie_open = 1;
      $("#fentie_open").attr("class", "setting_sp_btn");
    }
  });
  $("#fentie_forbidden").click(function() {
    if (fentie_forbidden) {
      fentie_forbidden = 0;
      $("#fentie_forbidden").attr("class", "setting_sp_btn close");
    } else {
      fentie_forbidden = 1;
      $("#fentie_forbidden").attr("class", "setting_sp_btn");
    }
  });
  $("#tail_open").click(function() {
    if (tail_open) {
      tail_open = 0;
      $("#tail_select,#tail_select + div").toggle("slow");
      $("#tail_option_box").hide(400);
      $("#tail_type_box").hide(400);
      $("#tail_open").attr("class", "setting_sp_btn close");
    } else {
      tail_open = 1;
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
    $("#tail_data")[0].value = "<br>小尾巴脚本Tieba Enhance:<br>https://userscripts.org/scripts/show/180666";
    $("#tail_type_text")[0].textContent = "html";
  });
  $("#tail_delete").click(function() {
    var oname;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") !== 1) {
      delete tail_data[oname];
    }
    for (x in tail_data) {
      $("#tail_select_text")[0].innerHTML = x;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", x);
      $("#tail_data")[0].value = tail_data[x].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tail_data[x].split("!分隔!")[1];
      break;
    }
    GM_setValue("tail_data", JSON.stringify(tail_data));
    $("#tail_option_box").empty();
    for (x in tail_data) {
      tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    $(".tail_option").click(function() {
      $("#tail_select_text")[0].innerHTML = this.innerHTML;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", this.innerHTML);
      $("#tail_data")[0].value = tail_data[this.innerHTML].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split("!分隔!")[1];
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
    var name, oname;
    name = $("#tail_select_text")[0].innerHTML;
    oname = $("#tail_select_text")[0].getAttribute("oname");
    if ($("#tail_select_text")[0].getAttribute("new") === 1) {
      if (tail_data[name]) {
        alert("该尾巴已存在！");
        return;
      } else {
        tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      }
    } else {
      if (name === oname) {
        tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      } else {
        delete tail_data[oname];
        tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
      }
    }
    for (x in tail_data) {
      tail_data[x] = tail_data[x].replace(/,/g, "!逗号!").replace(/"/g, "!引号!");
    }
    GM_setValue("tail_data", JSON.stringify(tail_data));
    $("#tail_option_box").empty();
    for (x in tail_data) {
      tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, "\"");
      $("#tail_option_box").append("<div class=\"tail_option\">" + x + "</div>");
    }
    $(".tail_option").click(function() {
      $("#tail_select_text")[0].innerHTML = this.innerHTML;
      $("#tail_select_text").attr("new", "0");
      $("#tail_select_text").attr("oname", this.innerHTML);
      $("#tail_data")[0].value = tail_data[this.innerHTML].split("!分隔!")[0];
      $("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split("!分隔!")[1];
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
    smiley_height = $("#smiley_height")[0].value;
    smiley_width = $("#smiley_width")[0].value;
    smiley_delay = $("#smiley_delay")[0].value;
    smiley_max = $("#smiley_max")[0].value;
    fentie_date = $("#fentie_date")[0].value;
    GM_setValue("smiley_open", smiley_open);
    GM_setValue("smiley_height", smiley_height);
    GM_setValue("smiley_width", smiley_width);
    GM_setValue("smiley_delay", smiley_delay);
    GM_setValue("smiley_max", smiley_max);
    GM_setValue("fentie_open", fentie_open);
    GM_setValue("fentie_date", fentie_date);
    GM_setValue("fentie_forbidden", fentie_forbidden);
    GM_setValue("tail_open", tail_open);
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
  var css, date_str, date_time, days, prefix, years;
  if ($("#j_core_title_wrap").length && fentie_open) {
    date_str = $("#j_p_postlist ul.p_tail > li:nth-child(2) > span")[0].textContent;
    if (date_str === "1970-01-01 07:00") {
      setTimeout(CheckPost, 1000);
      return;
    }
    date_str = date_str.replace(" ", "-").replace(":", "-").split("-");
    date_time = new Date(date_str[0], date_str[1] - 1, date_str[2], date_str[3], date_str[4]);
    days = parseInt((new Date() - date_time) / 86400000);
    if (days >= fentie_date) {
      prefix = days;
      if (days >= 365) {
        years = parseInt(days / 365);
        prefix = "" + years + "年" + (days - years * 365);
      }
      css = "#NotifyTide{width: 100%;text-align: center;color: white;font-size: 28px;vertical-align: middle;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;} #NotifyTide p{background: rgba(255, 119, 119, .5);padding: 25px 0px 25px 0px;text-shadow: red 0 0 5px,red 0 0 5px,red 0 0 7px,red 0 0 7px,red 0 0 10px,red 0 0 10px,red 0 0 15px,red 0 0 15px;}";
      GM_addStyle(css);
      $("#tb_nav").after("<div id='NotifyTide'><p>这是一个" + prefix + "天的坟贴哦~</p></div>");
      if (fentie_forbidden) {
        return tiebaData.StopPost = 1;
      }
    }
  }
};

CheckPost();


/*
ClearLink = ->
	for link in document.querySelectorAll('a[href^="http://jump.bdimg.com"]')
		url = link.textContent
		url = "http://" + url if url.indexOf("http") isnt 0
		link.href = url
	return

setTimeout ClearLink, 1000
 */

if (!GM_getValue("tieba_smile_config")) {
  SmileConfig = ["http://imgsrc.baidu.com/forum/pic/item/8989a544ebf81a4c82fc0a3ad72a6059272da6b6.jpg", "http://imgsrc.baidu.com/forum/pic/item/5f0e68ed2e738bd42bb054c2a18b87d6257ff9ef.jpg", "http://imgsrc.baidu.com/forum/pic/item/16a9927eca806538e37b42e097dda144af3482ef.jpg", "http://imgsrc.baidu.com/forum/pic/item/dcc451da81cb39dbe027d6f6d0160924aa1830ae.jpg", "http://imgsrc.baidu.com/forum/pic/item/a5be42fbfbedab64aa7b3a14f736afc378311e0d.jpg"];
  GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
}

SmileConfig = JSON.parse(GM_getValue("tieba_smile_config"));

$("#tb_nav > ul.nav_list").append("<li id=\"setting_btn\" class=\"j_tbnav_tab\">\n	<div class=\"tbnav_tab_inner\">\n		<p class=\"space\">\n			<a style=\"cursor:pointer;-moz-user-select:none;\" class=\"nav_icon icon_tie j_tbnav_tab_a\">设置</a>\n		</p>\n	</div>\n</li>");

$("#setting_btn").click(function() {
  return open_setting_window();
});

jQuery("body").on("mouseover", "a", function(event) {
  var link, url;
  link = event.target;
  url = link.textContent;
  if (link.href.indexOf("http://jump.bdimg.com") === 0) {
    if (url.indexOf("http") !== 0) {
      url = "http://" + url;
    }
    link.href = url;
  }
  return true;
});

TailInit = function() {
  var SendBt, i;
  if (document.querySelector(".ui_btn.ui_btn_m.j_submit.poster_submit")) {
    if (smiley_open) {
      SmileInit();
    }
    if (!tail_open) {
      return;
    }
    $(".poster_posting_status.j_posting_status").after("<span id=\"tail_use\" style=\"margin-left: 20px;\">\n	<span id=\"tail_use_text\" class=\"ui_btn\" style=\"color:black;\"></span>\n	<div id=\"tail_use_box_out\">\n		<div id=\"tail_use_box\" style=\"display:none;\"></div>\n	</div>\n</span>");
    log('add');
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
    } else if (typeof tail_data[tiebaData.tail_cur] === "undefined") {
      for (i in tail_data) {
        if (!(i != null)) {
          continue;
        }
        tiebaData.tail_cur = i;
        break;
      }
      GM_setValue("tiebaData.tail_cur", tiebaData.tail_cur);
    } else {
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
    }
    $("#tail_use_box").append("<div class=\"tail_use_option\">不使用小尾巴</div>");
    $("#tail_use_box").append("<div class=\"tail_use_option\">随机小尾巴</div>");
    for (x in tail_data) {
      $("#tail_use_box").append("<div class='tail_use_option'>" + x + "</div>");
    }
    $(".tail_use_option").click(function() {
      tiebaData.tail_cur = this.innerHTML;
      $("#tail_use_text")[0].innerHTML = tiebaData.tail_cur;
      GM_setValue("tiebaData.tail_cur", tiebaData.tail_cur);
    });
    window.AddTail = function(e) {
      var at, max, tailContent, xx;
      if (tiebaData.StopPost === 1) {
        if (!confirm("这可能是一个坟贴, 确认要回复么?")) {
          $("#ueditor_replace").empty();
        }
      }
      if (tiebaData.tail_cur === "不使用小尾巴") {
        return;
      }
      if (tiebaData.tail_cur === "随机小尾巴") {
        max = 0;
        for (xx in tail_data) {
          max++;
        }
        at = parseInt(Math.random() * max + 1);
        i = 0;
        for (xx in tail_data) {
          i++;
          if (i === at) {
            tiebaData.tail_cur = xx;
            break;
          }
        }
      }
      tailContent = void 0;
      if (tail_data[tiebaData.tail_cur].split("!分隔!")[1] === "html") {
        tailContent = tail_data[tiebaData.tail_cur].split("!分隔!")[0];
      } else {
        if (tail_data[tiebaData.tail_cur].split("!分隔!")[1] === "javascript") {
          tailContent = eval_(tail_data[tiebaData.tail_cur].split("!分隔!")[0]);
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

if (window === window.top && window.document.title !== "") {
  setTimeout(TailInit, 120);
}

GM_addStyle(".smiley {\n	position: relative;\n}\n.lzl_panel_wrapper {\n	position: relative !important;\n}\n#recent_img {\n	-moz-box-sizing: border-box !important;\n	position: absolute;\n	min-height: 90px;\n	background: #FFF;\n	border: 1px solid #999;\n	box-shadow: 0 0 3px #999;\n	z-index: 1;\n	top: 50px;\n	left: 0;\n	text-align: center;\n	padding: 6px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#recent_img.lzl {\n	left: auto;\n	right: 0px;\n}\n#recent_img > p {\n	line-height: 25px;\n	font-size: 15px;\n	color: #111;\n	height: 30px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#recent_img > div {\n	cursor: pointer;\n	display: inline-block;\n	margin: 2px;\n	overflow: hidden;\n	width: 50px;\n	height: 50px;\n	float: left;\n	background-position: 50% 50%;\n	background-repeat: no-repeat;\n	-moz-transition: 0.15s;\n}\n#recent_img > div:hover {\n	box-shadow: 0 0 2px #999;\n}\n#recent_img > div:active {\n	box-shadow: 0 0 3px #444;\n}\n#setting_shadow {\n	position: fixed;\n	z-index: 1024000000;\n	bottom: 0;\n	left: 0;\n	width: 100%;\n	height: 100%;\n	background: rgba(0, 0, 0, 0.6);\n	-moz-transition: 0.4s;\n}\n#setting_window {\n	position: fixed;\n	left: -moz-calc(50% - 320px);\n	left: -webkit-calc(50% - 320px);\n	width: 600px;\n	background: #FFF;\n	box-shadow: 0 0 5px #222;\n	padding: 20px 20px 50px 20px;\n	z-index: 1000000000;\n	-moz-transition: 0.5s ease all;\n}\n#setting_out_div {\n	overflow-y: scroll;\n	padding: 0 10px 0 0;\n}\n.setting_btn_inside {\n	font-size: 16px;\n	padding: 4px;\n	-moz-user-select: none;\n	cursor: default;\n}\n.setting_btn_inside:hover {\n	background: #DDD;\n}\n.setting_btn_inside:active {\n	box-shadow: 0 0 3px #999 inset;\n}\n#setting_reset {\n	position: absolute;\n	top: 14px;\n	right: 14px;\n}\n#setting_save {\n	display: inline-block;\n	position: absolute;\n	right: 15px;\n	bottom: 10px;\n}\n#setting_clear_smiley {\n	display: inline-block;\n	right: 22px;\n	float: right;\n}\n.setting_sp_btn {\n	font-size: 12px;\n	padding: 4px;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n	position: relative;\n}\n.setting_sp_btn.close {\n	background: #DDD;\n}\n.setting_sp_btn::before {\n	position: absolute;\n	right: -26px;\n	top: 0;\n	content: \"\";\n	width: 26px;\n	height: 26px;\n	background: #6B4;\n	-moz-transition: 0.3s;\n}\n.setting_sp_btn.close::before {\n	background: #C54;\n}\n.setting_sp_btn:hover {\n	background: #DDD;\n}\n.setting_sp_btn:active {\n	box-shadow: 0 0 3px #999 inset;\n}\n#setting_sp_q_c {\n	margin: 0 0 0 40px !important;\n}\n#setting_window .setting_title {\n	font-size: 34px;\n	height: 42px;\n	line-height: 42px;\n	padding: 7px 10px;\n	margin: 0 0 0 -7px;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n}\n#setting_window p {\n	font-size: 18px;\n	height: 42px;\n	line-height: 50px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window p.setting_hide {\n	height: 10px;\n	line-height: 10px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window p.setting_hide.sp {\n	background: #CCC !important;\n	height: 1px !important;\n	margin: 8px 0 !important;\n}\n#setting_window p.setting_hiding_sp {\n	height: 1px;\n	line-height: 1px;\n	-moz-user-select: none;\n	cursor: default;\n}\n#setting_window .setting_input {\n	-moz-appearance: none;\n	border: none;\n	background: #DDD;\n	height: 28px;\n	padding: 0px 7px !important;\n	width: 100px;\n	margin: 0 10px 0 0 !important;\n	font-size: 14px !important;\n}\n#setting_window span {\n	font-size: 14px !important;\n	margin: 0 10px 0 0 !important;\n	-moz-user-select: none;\n	cursor: default;\n	display: inline-block;\n}\n.setting_textarea {\n	-moz-appearance: none !important;\n	border: none;\n	background: #DDD;\n	margin: 10px 0 0 0 !important;\n	padding: 7px !important;\n	width: 550px;\n	height: 100px;\n	-moz-box-sizing: border-box;\n	font-size: 12px !important;\n}\n#tail_select {\n	display: inline-block;\n	height: 26px !important;\n	line-height: 26px !important;\n	width: 450px !important;\n	margin: 0px 0 0 40px !important;\n	vertical-align: top !important;\n	text-align: center !important;\n	font-size: 12px !Important;\n	-moz-box-sizing: border-box !Important;\n	position: relative !important;\n	cursor: default !important;\n}\n#tail_select_text {\n	height: 26px;\n	float: left;\n	min-width: 100px !important;\n	background: #DDD !important;\n	padding: 0 5px !important;\n	-moz-box-sizing: border-box !Important;\n}\n#tail_option_box {\n	float: left;\n	position: absolute !important;\n	bottom: 30px;\n	left: 0;\n	min-width: 100px;\n	background: #EEE !important;\n	box-shadow: 0 0 3px #666 !important;\n	display: inline-block;\n}\n.tail_option {\n	padding: 0 8px !important;\n	width: auto !important;\n	font-size: 12px !important;\n	height: 24px !important;\n	line-height: 24px !important;\n	cursor: default !important;\n}\n.tail_option:hover {\n	background: #DDD !important;\n}\n#tail_type {\n	background: #DDD !important;\n	position: absolute !important;\n	top: 0;\n	right: 0px;\n}\n#tail_type_text {\n	width: 80px !important;\n	text-align: center !important;\n}\n#tail_type_box {\n	position: absolute !important;\n	width: 80px !important;\n	bottom: 30px;\n	right: 0px;\n	background: #EEE;\n	box-shadow: 0 0 3px #666;\n}\n.tail_type_option:hover {\n	background: #DDD;\n}\n#tail_save {\n	font-size: 12px !important;\n	position: absolute;\n	top: 0;\n	right: 90px;\n	height: 26px !important;\n	padding: 0 !important;\n	width: 86px !important;\n}\n#tail_new {\n	font-size: 12px !important;\n	-moz-box-sizing: border-box !Important;\n	padding: 0 !important;\n	height: 26px !important;\n	width: 60px !important;\n	position: absolute !important;\n	top: 0 !important;\n	right: 180px !important;\n}\n#tail_delete {\n	font-size: 12px !important;\n	-moz-box-sizing: border-box !Important;\n	padding: 0 !important;\n	height: 26px !important;\n	width: 60px !important;\n	position: absolute !important;\n	top: 0 !important;\n	right: 250px !important;\n}\n#tail_data + span {\n	display: block !Important;\n	margin: 5px 0 -3px 0 !important;\n	font-size: 12px !Important;\n}\n#tail_use {\n	display: inline-block !important;\n	background: #EEE;\n	height: 30px;\n	width: auto;\n	position: relative !important;\n	cursor: default;\n}\n#tail_use_text {\n	display: inline-block !important;\n	background: #EEE;\n	height: 30px;\n	width: auto;\n	padding: 0 10px;\n	line-height: 30px !important;\n	text-align: center !important;\n	box-shadow: 0 0 3px #666;\n}\n#tail_use_box_out {\n	position: absolute !important;\n	width: 300px !important;\n}\n#tail_use_box {\n	position: absolute !important;\n	background: #EEE;\n	bottom: 35px;\n	left: 0;\n	box-shadow: 0 0 3px #666;\n	z-index: 100;\n}\n.tail_use_option {\n	padding: 0 10px;\n	line-height: 30px !important;\n}\n.tail_use_option:hover {\n	background: #DDD;\n}");
