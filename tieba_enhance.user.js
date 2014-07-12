// ==UserScript==
// @name					Tieba Enhance
// @namespace				lkytal
// @author					lkytal
// @description				Multiply Enhance for tieba
// @include					http://tieba.baidu.com/*
// @include					https://tieba.baidu.com/*
// @version					5.8.1
// @author					lkytal
// @icon					http://lkytal.qiniudn.com/ic.ico
// @grant					unsafeWindow
// @grant					GM_addStyle
// @grant					GM_xmlhttpRequest
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_listValues
// @grant					GM_deleteValue
// @homepageURL				https://git.oschina.net/coldfire/GM
// @updateURL				https://git.oschina.net/coldfire/GM/raw/master/tieba_enhance.user.js
// @downloadURL				https://git.oschina.net/coldfire/GM/raw/master/tieba_enhance.user.js
// ==/UserScript==

//var $ = unsafeWindow.$;
var tail_cur = "";
var _style_setted = 0;

function load()
{
	GM_addStyle('.smiley{position:relative;}.lzl_panel_wrapper{position:relative !important;}#recent_img{-moz-box-sizing:border-box !important;position:absolute;min-height:90px;background:#FFF;border:1px solid #999;box-shadow:0 0 3px #999;z-index:1;top:50px;left:0;text-align:center;padding:6px;-moz-user-select:none;cursor:default;}#recent_img.lzl{left:auto;right:0px;}#recent_img > p{line-height:25px;font-size:15px;color:#111;height:30px;-moz-user-select:none;cursor:default;}#recent_img > div{cursor:pointer;display:inline-block;margin:2px;overflow:hidden;width:50px;height:50px;float:left;background-position:50% 50%;background-repeat:no-repeat;-moz-transition:0.15s;}#recent_img > div:hover{box-shadow:0 0 2px #999;}#recent_img > div:active{box-shadow:0 0 3px #444;}#setting_shadow{position:fixed;z-index:999999999;bottom:0;left:0;width:10000px;height:10000px;background:rgba(0,0,0,0.6);-moz-transition:0.5s;}#setting_window{position:fixed;left:-moz-calc(50% - 320px);left:-webkit-calc(50% - 320px);width:600px;background:#FFF;box-shadow:0 0 5px #222;padding:20px 20px 50px 20px;z-index:1000000000;-moz-transition:0.5s ease all;}#setting_out_div{overflow-y:scroll;padding:0 10px 0 0;}.setting_btn_inside{font-size:16px;padding:4px;-moz-user-select:none;cursor:default;}.setting_btn_inside:hover{background:#DDD;}.setting_btn_inside:active{box-shadow:0 0 3px #999 inset;}#setting_reset{position:absolute;top:14px;right:14px;}#setting_save{display:inline-block;position:absolute;right:15px;bottom:10px;}#setting_clear_smiley{display:inline-block;right:22px;float:right;}.setting_sp_btn{font-size:12px;padding:4px;-moz-user-select:none;cursor:default;display:inline-block;position:relative;}.setting_sp_btn.close{background:#DDD;}.setting_sp_btn::before{position:absolute;right:-26px;top:0;content:"";width:26px;height:26px;background:#6B4;-moz-transition:0.3s;}.setting_sp_btn.close::before{background:#C54;}.setting_sp_btn:hover{background:#DDD;}.setting_sp_btn:active{box-shadow:0 0 3px #999 inset;}#setting_sp_q_c{margin:0 0 0 40px !important;}#setting_window .setting_title{font-size:34px;height:42px;line-height:42px;padding:7px 10px;margin:0 0 0 -7px;-moz-user-select:none;cursor:default;display:inline-block;}#setting_window p{font-size:18px;height:42px;line-height:50px;-moz-user-select:none;cursor:default;}#setting_window p.setting_hide{height:10px;line-height:10px;-moz-user-select:none;cursor:default;}#setting_window p.setting_hide.sp{background:#CCC !important;height:1px !important;margin:8px 0 !important;}#setting_window p.setting_hiding_sp{height:1px;line-height:1px;-moz-user-select:none;cursor:default;}#setting_window .setting_input{-moz-appearance:none;border:none;background:#DDD;height:28px;padding:0px 7px !important;width:100px;margin:0 10px 0 0 !important;font-size:14px !important;}#setting_window span{font-size:14px !important;margin:0 10px 0 0 !important;-moz-user-select:none;cursor:default;display:inline-block;}.setting_textarea{-moz-appearance:none !important;border:none;background:#DDD;margin:10px 0 0 0 !important;padding:7px !important;width:550px;height:100px;-moz-box-sizing:border-box;font-size:12px !important;}#tail_select{display:inline-block;height:26px !important;line-height:26px !important;width:450px !important;margin:0px 0 0 40px !important;vertical-align:top !important;text-align:center !important;font-size:12px !Important;-moz-box-sizing:border-box !Important;position:relative !important;cursor:default !important;}#tail_select_text{height:26px;float:left;min-width:100px !important;background:#DDD !important;padding:0 5px !important;-moz-box-sizing:border-box !Important;}#tail_option_box{float:left;position:absolute !important;bottom:30px;left:0;min-width:100px;background:#EEE !important;box-shadow:0 0 3px #666 !important;display:inline-block;}.tail_option{padding:0 8px !important;width:auto !important;font-size:12px !important;height:24px !important;line-height:24px !important;cursor:default !important;}.tail_option:hover{background:#DDD !important;}#tail_type{background:#DDD !important;position:absolute !important;top:0;right:0px;}#tail_type_text{width:80px !important;text-align:center !important;}#tail_type_box{position:absolute !important;width:80px !important;bottom:30px;right:0px;background:#EEE;box-shadow:0 0 3px #666;}.tail_type_option:hover{background:#DDD;}#tail_save{font-size:12px !important;position:absolute;top:0;right:90px;height:26px !important;padding:0 !important;width:86px !important;}#tail_new{font-size:12px !important;-moz-box-sizing:border-box !Important;padding:0 !important;height:26px !important;width:60px !important;position:absolute !important;top:0 !important;right:180px !important;}#tail_delete{font-size:12px !important;-moz-box-sizing:border-box !Important;padding:0 !important;height:26px !important;width:60px !important;position:absolute !important;top:0 !important;right:250px !important;}#tail_data + span{display:block !Important;margin:5px 0 -3px 0 !important;font-size:12px !Important;}#tail_use{display:inline-block !important;background:#EEE;height:30px;width:auto;position:relative !important;cursor:default;}#tail_use_text{display:inline-block !important;background:#EEE;height:30px;width:auto;padding:0 10px;line-height:30px !important;text-align:center !important;box-shadow:0 0 3px #666;}#tail_use_box_out{position:absolute !important;width:300px !important;}#tail_use_box{position:absolute !important;background:#EEE;bottom:35px;left:0;box-shadow:0 0 3px #666;z-index:100;}.tail_use_option{padding:0 10px;line-height:30px !important;}.tail_use_option:hover{background:#DDD;}');

	smiley_open = GM_getValue("smiley_open", 1);
	smiley_height = GM_getValue("smiley_height", 500);
	smiley_width = GM_getValue("smiley_width", 500);
	smiley_delay = GM_getValue("smiley_delay", 240);
	smiley_max = GM_getValue("smiley_max", 20);

	fentie_open = GM_getValue("fentie_open", 1);
	fentie_date = GM_getValue("fentie_date", 30);
	fentie_forbidden = GM_getValue("fentie_forbidden", 1);

	tail_open = GM_getValue("tail_open", 1);
	tail_data = JSON.parse(GM_getValue("tail_data", '{"Default":" !分隔!html"}'));

	if (GM_getValue("tail_adopt", 0) < 2)
	{
		GM_setValue("tail_adopt", 2);

		if (typeof (localStorage['tail_data']) == 'string')
		{
			GM_setValue("tail_data", localStorage['tail_data']);
			tail_data = JSON.parse(localStorage['tail_data']);
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
	}

	for (x in tail_data)
	{
		tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, '"');
	}

	unsafeWindow.tail_data = tail_data;
	for (x in tail_data)
	{
		if (GM_getValue("tail_cur", '') === '')
		{
			GM_setValue("tail_cur", x);
		}
		tail_cur = GM_getValue("tail_cur", '');
		break;
	}
}

load();

//最近使用的表情

var maxCount = smiley_max;
var maxHeight = smiley_height;
var maxWidth = smiley_width;

if (!GM_getValue("tieba_smile_config"))
{
	SmileConfig = ['http://imgsrc.baidu.com/forum/pic/item/8989a544ebf81a4c82fc0a3ad72a6059272da6b6.jpg', 'http://imgsrc.baidu.com/forum/pic/item/5f0e68ed2e738bd42bb054c2a18b87d6257ff9ef.jpg', 'http://imgsrc.baidu.com/forum/pic/item/16a9927eca806538e37b42e097dda144af3482ef.jpg', 'http://imgsrc.baidu.com/forum/pic/item/dcc451da81cb39dbe027d6f6d0160924aa1830ae.jpg', 'http://imgsrc.baidu.com/forum/pic/item/a5be42fbfbedab64aa7b3a14f736afc378311e0d.jpg'];
	GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
}

var SmileConfig = JSON.parse(GM_getValue("tieba_smile_config"));

function saveConfig()
{
	GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
}

function NodeInsertListener(selector, callback, once)
{
	var cssString = " { animation-name: listener{id};animation-duration: 0.001s;} @keyframes listener{id} { from { opacity: 0.99; } to {opacity: 1; } }";

	var id = new Date().getTime();
	GM_addStyle(selector + cssString.replace(/\{id\}/g, id));

	var handler = (function (e)
	{
		if (e.animationName == "listener" + id)
		{
			if (once)
				this.stop();

			callback(e.target);
		}
	}).bind(this);

	this.stop = function ()
	{
		removeEventListener("animationend", handler);
	};
	addEventListener("animationend", handler);
}

function SmileInit()
{
	new NodeInsertListener('.edui-btn-emotion', function ()
	{
		var panel = unsafeWindow.$.eduipopup().clone().appendTo(".edui-dialog-container").attr("style", "z-index: 1; display: none; top: 44px; left: -3px; position: absolute;");
		panel.find(".edui-popup-caret").addClass("up").attr("style", "top: -8px; left: 247px; position: absolute;");

		unsafeWindow._.Module.use("common/component/UeditorEmotion", [{
			container: $('<div class="j_emotion_container emotion_container"></div>')
		}], function (h)
		{
			var content = h.$container.appendTo(panel.find(".edui-popup-body"));
			content.find(".s_layer_tab.j_tab.ueditor_emotion_tab").remove();

			NodeInsertListener("table", function ()
			{
				var table = content.find("table tbody");
				var cell = table.find(".j_emotion").eq(0).clone().removeClass("face").empty().css("cursor", "pointer").click(function ()
				{
					unsafeWindow.test_editor.execCommand("inserthtml", '<img class="BDE_Smiley" onload="EditorUI.resizeImage(this, 560)" src="' + $(this).data("surl") + '">');
					panel.hide();
				}).append($("<img>").css("max-height", "54px").css("max-width", "54px"));
				GM_addStyle(".review { max-height: 60px; max-width: 60px; }")

				table.parent().before($('<div>ctrl + 左键点击删除表情</div>'));

				pushImages = function ()
				{
					table.empty();
					for (var i = 0; i < SmileConfig.length / 10; i++)
						table.append($("<tr>").append($(SmileConfig.slice(10 * i, 10 * (i + 1)).map(function (img)
						{
							var newCell = cell.clone(true).data("surl", img);
							newCell.find("img").attr("src", img);
							return newCell.get(0);
						}))));

					table.find('img').click(function (event)
					{
						if (event.ctrlKey)
						{
							SmileConfig.splice(SmileConfig.indexOf($(this).attr('src')), 1);
							GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));

							$(this).parent().remove();
							event.preventDefault();
							event.stopPropagation();
						}
					});
				}
				pushImages();
			}, true);
		});
		var pushImages = function () { };

		var mousein = false;
		$('.edui-btn-emotion').click(function ()
		{
			panel.hide();
			mousein = false;
		}).add(panel).mouseenter(function ()
		{
			panel.show();
			mousein = true;
		}).mouseleave(function ()
		{
			mousein = false;
			setTimeout(function ()
			{
				if (!mousein) panel.hide();
			}, 300);
		});

		NodeInsertListener("#ueditor_replace img", function (node)
		{
			if (node.width <= maxWidth && node.height <= maxHeight)
			{
				var img = node.src;

				if (img.indexOf('data:image') != -1) return;

				if (img.indexOf('static.tieba.baidu.com/tb/editor/images/face/') != -1)
				{
					var idp = img.lastIndexOf("?t=");
					img = img.slice(0, idp);
				}

				var i = SmileConfig.indexOf(img);
				if (i != -1) SmileConfig.splice(i, 1);
				else if (SmileConfig.length == maxCount) SmileConfig.pop();
				SmileConfig.unshift(img);
				saveConfig();
				pushImages();
			}
		});
	}, true);
}

function checkFather(that, e)
{
	var parent = e.relatedTarget;
	try
	{
		while (parent && parent !== that)
		{
			parent = parent.parentNode;
		}
		return (parent !== that);
	}
	catch (exp) { }
}

//设置窗口
if ($(".nav_left").length !== 0)
{
	$(".nav_left").append('<li id="setting_btn"><a style="cursor:pointer;-moz-user-select:none;">设置</a></li>');
	$("#setting_btn").click(function ()
	{
		open_setting_window();
	});
}
else
{
	$(".nav_list").append('<li id="setting_btn" class="j_tbnav_tab"><a style="cursor:pointer;-moz-user-select:none;">设置</a></li>');
	$("#setting_btn").click(function ()
	{
		open_setting_window();
	});
}

function open_setting_window()
{
	if (_style_setted === 0)
	{
		if (window.innerHeight <= 727)
		{
			GM_addStyle('#setting_window{top:50px;}#setting_out_div{max-height:' + (window.innerHeight - 227) + 'px;}');
		} else
		{
			GM_addStyle('#setting_window{top:' + ((window.innerHeight - 627) / 2) + 'px;}#setting_out_div{max-height:500px;}');
		}
		_style_setted = 1;
	}
	var _tmp = document.createElement("div");
	_tmp.id = "setting_shadow";
	_tmp.innerHTML += '<div id="setting_window"style="top:-100%;"><div id="setting_reset"class="setting_btn_inside">重置</div><div id="setting_save"class="setting_btn_inside">保存</div><div id="setting_close"class="setting_title setting_btn_inside">设置</div><p class="setting_hiding_sp"></p><div id="setting_out_div"><div id="setting_sp_smiley"class="setting_sp_btn">最近使用的表情</div><div class="setting_sp"><p>最近使用的表情仅获取符合以下条件的图片</p><span>图片宽度≤</span><input class="setting_input"type="number"id="smiley_width"></input><span>图片高度≤</span><input class="setting_input"type="number"id="smiley_height"></input><p>最近使用的表情窗口弹出延迟</p><input class="setting_input"type="number"id="smiley_delay"></input><span>延迟时间(毫秒)</span><div id="setting_clear_smiley"class="setting_btn_inside">清空最近表情</div><p class="setting_hide"></p><input class="setting_input"type="number"id="smiley_max"></input><span>最大表情数量</span><p class="setting_hide"></p><p class="setting_hide"><div id="smiley_close_after_click"class="setting_sp_btn">点击表情后关闭窗口</div></div><p class="setting_hide sp"></p><div id="fentie_open"class="setting_sp_btn">坟贴检测</div><div class="setting_sp"><p class="setting_hide"></p><span>超过</span><input class="setting_input"type="number"id="fentie_date"></input><span>天的帖子视为坟贴</span><div id="fentie_forbidden"class="setting_sp_btn">坟贴禁回</div></div><p class="setting_hide sp"></p><div id="tail_open"class="setting_sp_btn">小尾巴</div><div id="tail_select"><div id="tail_select_text"contenteditable="true"></div><div id="tail_option_box"></div><div id="tail_type"><div id="tail_type_text"></div><div id="tail_type_box"><div class="tail_type_option">html</div><div class="tail_type_option">javascript</div></div></div><div id="tail_save"class="setting_btn_inside">保存当前尾巴</div><div id="tail_new"class="setting_btn_inside">新建尾巴</div><div id="tail_delete"class="setting_btn_inside">删除尾巴</div></div><div class="setting_sp"><textarea class="setting_textarea"id="tail_data"></textarea><span>预览</span><div class="setting_textarea"id="tail_data_show"></div><p class="hiding_margin"style="width:1px;height:20px;"></p></div></div></div>';

	document.body.appendChild(_tmp);

	//读取设置
	$("#smiley_height")[0].value = smiley_height;
	$("#smiley_width")[0].value = smiley_width;
	$("#smiley_delay")[0].value = smiley_width;
	$("#smiley_max")[0].value = smiley_max;
	$("#fentie_date")[0].value = fentie_date;

	if (!smiley_open)
	{
		$("#setting_sp_smiley").attr("class", "setting_sp_btn close");
		$("#setting_sp_smiley + div").css("display", "none");
	}

	if (!fentie_open)
	{
		$("#fentie_open").attr("class", "setting_sp_btn close");
		$("#fentie_open + div").css("display", "none");
	}

	if (!fentie_forbidden)
	{
		$("#fentie_forbidden").attr("class", "setting_sp_btn close");
	}

	if (!tail_open)
	{
		$("#tail_open").attr("class", "setting_sp_btn close");
		$("#tail_select,#tail_select + div").css("display", "none");
	}

	//小尾巴
	for (x in tail_data)
	{
		$("#tail_select_text")[0].innerHTML = x;
		$("#tail_select_text").attr("new", "0");
		$("#tail_select_text").attr("oname", x);
		$("#tail_data")[0].value = tail_data[x].split('!分隔!')[0];
		$("#tail_type_text")[0].innerHTML = tail_data[x].split('!分隔!')[1];
		break;
	}

	for (x in tail_data)
	{
		$("#tail_option_box").append('<div class="tail_option">' + x + '</div>');
	}

	$(".tail_option").click(function ()
	{
		$("#tail_select_text")[0].innerHTML = this.innerHTML;
		$("#tail_select_text").attr("new", "0");
		$("#tail_select_text").attr("oname", this.innerHTML);
		$("#tail_data")[0].value = tail_data[this.innerHTML].split('!分隔!')[0];
		$("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split('!分隔!')[1];
		if ($("#tail_type_text")[0].innerHTML == "javascript")
		{
			try
			{
				$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
			}
			catch (e)
			{
				$("#tail_data_show")[0].innerHTML = e;
			}
		} else if ($("#tail_type_text")[0].innerHTML == "html")
		{
			$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
		}
	});

	$(".tail_type_option").click(function ()
	{
		$("#tail_type_text")[0].innerHTML = this.innerHTML;
		if ($("#tail_type_text")[0].innerHTML == "javascript")
		{
			try
			{
				$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
			}
			catch (e)
			{
				$("#tail_data_show")[0].innerHTML = e;
			}
		}
		else if ($("#tail_type_text")[0].innerHTML == "html")
		{
			$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
		}
	});

	$("#tail_data").keyup(function ()
	{
		if ($("#tail_type_text")[0].innerHTML == "javascript")
		{
			try
			{
				$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
			}
			catch (e)
			{
				$("#tail_data_show")[0].innerHTML = e;
			}
		}
		else if ($("#tail_type_text")[0].innerHTML == "html")
		{
			$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
		}
	});

	if ($("#tail_type_text")[0].innerHTML == "javascript")
	{
		try
		{
			$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
		}
		catch (e)
		{
			$("#tail_data_show")[0].innerHTML = e;
		}
	}
	else if ($("#tail_type_text")[0].innerHTML == "html")
	{
		$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
	}

	//动画效果
	_tmp.style.opacity = "0";
	setTimeout(function ()
	{
		$("#setting_shadow")[0].removeAttribute("style");
	}, 10);
	setTimeout(function ()
	{
		$("#setting_window")[0].removeAttribute("style");
	}, 510);

	//按钮
	$("#setting_close").mouseenter(function ()
	{
		this.innerHTML = "关闭";
	});
	$("#setting_close").mouseleave(function ()
	{
		this.innerHTML = "设置";
	});

	$("#setting_close").click(function ()
	{
		load();
		$("#setting_window")[0].style.top = "-600px";
		setTimeout(function ()
		{
			$("#setting_shadow").css("opacity", "0");
		}, 200);
		setTimeout(function ()
		{
			$("#setting_shadow").remove();
		}, 700);
	});

	$("#setting_reset").click(function ()
	{
		if (confirm('确定重置设置吗(会刷新页面)'))
		{
			var keys = GM_listValues();
			for (var i = 0, key = null; key == keys[i]; i++)
			{
				key = keys[i];
				GM_deleteValue(key);
			}

			$("#setting_window")[0].style.top = "-600px";
			setTimeout(function ()
			{
				$("#setting_shadow").css("opacity", "0");
			}, 200);
			setTimeout(function ()
			{
				$("#setting_shadow").remove();
			}, 700);
			window.location.reload();
		}
	});

	$("#setting_sp_smiley").click(function ()
	{
		$("#setting_sp_smiley + div").slideToggle("slow");
		if (smiley_open)
		{
			smiley_open = 0;
			$("#setting_sp_smiley").attr("class", "setting_sp_btn close");
		} else
		{
			smiley_open = 1;
			$("#setting_sp_smiley").attr("class", "setting_sp_btn");
		}
	});

	$("#setting_clear_smiley").click(function ()
	{
		SmileConfig = [];
		GM_setValue("tieba_smile_config", JSON.stringify(SmileConfig));
	});

	$("#fentie_open").click(function ()
	{
		$("#fentie_open + div").slideToggle("slow");
		if (fentie_open)
		{
			fentie_open = 0;
			$("#fentie_open").attr("class", "setting_sp_btn close");
		} else
		{
			fentie_open = 1;
			$("#fentie_open").attr("class", "setting_sp_btn");
		}
	});

	$("#fentie_forbidden").click(function ()
	{
		if (fentie_forbidden)
		{
			fentie_forbidden = 0;
			$("#fentie_forbidden").attr("class", "setting_sp_btn close");
		} else
		{
			fentie_forbidden = 1;
			$("#fentie_forbidden").attr("class", "setting_sp_btn");
		}
	});

	$("#tail_open").click(function ()
	{
		if (tail_open)
		{
			tail_open = 0;
			$("#tail_select,#tail_select + div").toggle("slow");
			$("#tail_option_box").hide(400);
			$("#tail_type_box").hide(400);
			$("#tail_open").attr("class", "setting_sp_btn close");
		} else
		{
			tail_open = 1;
			$("#tail_select,#tail_select + div").slideToggle("slow");
			$("#tail_open").attr("class", "setting_sp_btn");
		}
	});

	$("#tail_select_text + div").css("display", "none");
	$("#tail_select_text").click(function ()
	{
		$("#tail_select_text + div").show(400);
		$(document).bind("click", myfunction = function (e)
		{
			if (e.target.id != "tail_select_text" && e.target.id != "tail_open")
			{
				$("#tail_select_text + div").hide(400);
				$(document).unbind("click", myfunction);
			}
		});
	});

	$("#tail_type_text + div").css("display", "none");
	$("#tail_type_text").click(function ()
	{
		$("#tail_type_text + div").show(400);
		$(document).bind("click", myfunction2 = function (e)
		{
			if (e.target.id != "tail_type_text" && e.target.id != "tail_open")
			{
				$("#tail_type_text + div").hide(400);
				$(document).unbind("click", myfunction2);
			}
		});
	});

	$("#tail_new").click(function ()
	{
		$("#tail_select_text").attr("new", "1");
		$("#tail_select_text").attr("oname", "");
		$("#tail_select_text")[0].textContent = "新尾巴" + Math.random().toString().substr(3, 3);
		$("#tail_data")[0].value = "<br>小尾巴脚本Tieba Enhance:<br>https://userscripts.org/scripts/show/180666";
		$("#tail_type_text")[0].textContent = "html";
	});

	$("#tail_delete").click(function ()
	{
		oname = $("#tail_select_text")[0].getAttribute("oname");
		if ($("#tail_select_text")[0].getAttribute("new") == 1) { } else {
			delete tail_data[oname];
		}
		for (x in tail_data)
		{
			$("#tail_select_text")[0].innerHTML = x;
			$("#tail_select_text").attr("new", "0");
			$("#tail_select_text").attr("oname", x);
			$("#tail_data")[0].value = tail_data[x].split('!分隔!')[0];
			$("#tail_type_text")[0].innerHTML = tail_data[x].split('!分隔!')[1];
			break;
		}
		//save
		GM_setValue("tail_data", JSON.stringify(tail_data));

		//reload
		$("#tail_option_box").empty();
		for (x in tail_data)
		{
			tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, '"');
			$("#tail_option_box").append('<div class="tail_option">' + x + '</div>');
		}
		$(".tail_option").click(function ()
		{
			$("#tail_select_text")[0].innerHTML = this.innerHTML;
			$("#tail_select_text").attr("new", "0");
			$("#tail_select_text").attr("oname", this.innerHTML);
			$("#tail_data")[0].value = tail_data[this.innerHTML].split('!分隔!')[0];
			$("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split('!分隔!')[1];

			if ($("#tail_type_text")[0].innerHTML == "javascript")
			{
				try
				{
					$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
				}
				catch (e)
				{
					$("#tail_data_show")[0].innerHTML = e;
				}
			}
			else if ($("#tail_type_text")[0].innerHTML == "html")
			{
				$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
			}
		});
	});

	$("#tail_save").click(function ()
	{
		name = $("#tail_select_text")[0].innerHTML;
		oname = $("#tail_select_text")[0].getAttribute("oname");

		if ($("#tail_select_text")[0].getAttribute("new") == 1)
		{
			if (tail_data[name])
			{
				alert("该尾巴已存在！");
				return;
			}
			else
			{
				tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
			}
		}
		else
		{
			if (name == oname)
			{
				tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
			} else
			{
				delete tail_data[oname];
				tail_data[name] = $("#tail_data")[0].value + "!分隔!" + $("#tail_type_text")[0].textContent;
			}
		}
		//save
		for (x in tail_data)
		{
			tail_data[x] = tail_data[x].replace(/,/g, "!逗号!").replace(/"/g, "!引号!");
		}
		GM_setValue("tail_data", JSON.stringify(tail_data));

		//reload
		$("#tail_option_box").empty();
		for (x in tail_data)
		{
			tail_data[x] = tail_data[x].replace(/!逗号!/g, ",").replace(/!引号!/g, '"');
			$("#tail_option_box").append('<div class="tail_option">' + x + '</div>');
		}
		$(".tail_option").click(function ()
		{
			$("#tail_select_text")[0].innerHTML = this.innerHTML;
			$("#tail_select_text").attr("new", "0");
			$("#tail_select_text").attr("oname", this.innerHTML);
			$("#tail_data")[0].value = tail_data[this.innerHTML].split('!分隔!')[0];
			$("#tail_type_text")[0].innerHTML = tail_data[this.innerHTML].split('!分隔!')[1];
			if ($("#tail_type_text")[0].innerHTML == "javascript")
			{
				try
				{
					$("#tail_data_show")[0].innerHTML = eval($("#tail_data")[0].value);
				}
				catch (e)
				{
					$("#tail_data_show")[0].innerHTML = e;
				}
			}
			else if ($("#tail_type_text")[0].innerHTML == "html")
			{
				$("#tail_data_show")[0].innerHTML = $("#tail_data")[0].value;
			}
		});
	});

	//保存部分
	$("#setting_save").click(function ()
	{
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
		setTimeout(function ()
		{
			$("#setting_shadow").css("opacity", "0");
		}, 200);
		setTimeout(function ()
		{
			$("#setting_shadow").remove();
		}, 600);

		window.location.reload();
	});
}

//坟贴检测函数

window.StopPost = 0;

function CheckPost()
{
	if ($("#j_core_title_wrap").length && fentie_open)
	{
		var date_str = $('#j_p_postlist ul.p_tail > li:nth-child(2) > span')[0].textContent;

		if (date_str == "1970-01-01 07:00")
		{
			setTimeout(CheckPost, 1000);
			return;
		}

		date_str = date_str.replace(" ", "-").replace(":", "-").split("-");
		var date_time = new Date(date_str[0], date_str[1] - 1, date_str[2], date_str[3], date_str[4]);

		var days = parseInt((new Date() - date_time) / 86400000);

		if (days >= fentie_date)
		{
			var prefix = days;
			if (days >= 365)
			{
				var years = parseInt(days / 365);
				prefix = '' + years + '年' + (days - years * 365);
			}

			var css = '#NotifyTide{width: 100%;text-align: center;color: white;font-size: 28px;vertical-align: middle;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;} #NotifyTide p{background: rgba(255, 119, 119, .5);padding: 25px 0px 25px 0px;text-shadow: red 0 0 5px,red 0 0 5px,red 0 0 7px,red 0 0 7px,red 0 0 10px,red 0 0 10px,red 0 0 15px,red 0 0 15px;}';
			GM_addStyle(css);
			$('#tb_nav').after("<div id='NotifyTide'><p>这是一个" + prefix + "天的坟贴哦~</p></div>");

			if (fentie_forbidden)
			{
				window.StopPost = 1;
			}
		}
	}
	return true;
}

setTimeout(CheckPost, 500);

function ClearLink()
{
	var urls = document.querySelectorAll('a[href^="http://jump.bdimg.com"]');
	for (var i = 0; i < urls.length; i++)
	{
		var a = urls[i];
		var url = a.textContent;
		if (url.indexOf("http") !== 0)
		{
			url = "http://" + url;
		}
		a.href = url;
	}
}

setTimeout(ClearLink, 500);

$('#container').on('click', 'a',
	function (event)
	{
		var link = event.target;
		console.log(link.attr('href').indexOf("http://jump.bdimg.com"));
		if (link.attr('href').indexOf("http://jump.bdimg.com") === 0)
		{
			console.log(link);
			var url = link.text;
			if (url.indexOf("http") !== 0)
			{
				url = "http://" + url;
			}
			link.attr("href", url);
		}

		return true;
	});

//Tail*/

function TailInit()
{
	if (document.querySelector(".ui_btn.ui_btn_m.j_submit.poster_submit"))
	{
		if (smiley_open)
		{
			SmileInit();
		}

		if (!tail_open) return;

		$('.poster_posting_status.j_posting_status').after('<div id="tail_use"><div id="tail_use_text"></div><div id="tail_use_box_out"><div id="tail_use_box"style="display:none;"></div></div></div>');

		$("#tail_use_text").click(function ()
		{
			$("#tail_use_box").slideToggle(400);
		});

		$(document).bind("click", function (e)
		{
			if (e.target.id != "tail_use_text")
			{
				$("#tail_use_box").slideUp(400);
			}
		});

		if (tail_cur == "不使用小尾巴" || tail_cur == "随机小尾巴")
		{
			$("#tail_use_text")[0].innerHTML = tail_cur;
		} else if (typeof (tail_data[tail_cur]) == "undefined")
		{
			tail_cur = tail_data[0];
			GM_setValue("tail_cur", tail_cur);
		} else
		{
			$("#tail_use_text")[0].innerHTML = tail_cur;
		}

		$("#tail_use_box").append('<div class="tail_use_option">不使用小尾巴</div>');
		$("#tail_use_box").append('<div class="tail_use_option">随机小尾巴</div>');

		for (x in tail_data)
		{
			$("#tail_use_box").append('<div class="tail_use_option">' + x + '</div>');
		}

		$(".tail_use_option").click(function ()
		{
			$("#tail_use_text")[0].innerHTML = this.innerHTML;
			tail_cur = this.innerHTML;
			GM_setValue("tail_cur", tail_cur);
		});

		window.AddTail = function (e)
		{
			if (StopPost == 1 && !confirm('这可能是一个坟贴, 确认要回复么?'))
			{
				$("#ueditor_replace").empty();
				return;
			}

			var _tail_cur = tail_cur;

			if (_tail_cur == "不使用小尾巴")
			{
				return;
			}
			if (_tail_cur == "随机小尾巴")
			{
				var max = 0;
				for (xx in tail_data)
				{
					max++;
				}
				var at = parseInt(Math.random() * max + 1);
				var i = 0;

				for (xx in tail_data)
				{
					i++;
					if (i == at)
					{
						_tail_cur = xx;
						break;
					}
				}
			}

			var tailContent;

			if (tail_data[_tail_cur].split("!分隔!")[1] == "html")
			{
				tailContent = tail_data[_tail_cur].split("!分隔!")[0];
			} else if (tail_data[_tail_cur].split("!分隔!")[1] == "javascript")
			{
				tailContent = eval(tail_data[_tail_cur].split("!分隔!")[0]);
			}

			$("#ueditor_replace").append("<br>");
			$("#ueditor_replace").append(tailContent);
		};

		var SendBt = $('a.ui_btn.ui_btn_m.j_submit.poster_submit[title="Ctrl+Enter快捷发表"]')[0];
		SendBt.addEventListener("click", AddTail, true);

		document.onkeydown = function (event)
		{
			if (event.ctrlKey && event.keyCode == 13)
			{
				AddTail();
			}
		};
	}
	else
	{
		setTimeout(TailInit, 500);
	}
}

if (window == window.top && window.document.title != "")
{
	setTimeout(TailInit, 120);
}