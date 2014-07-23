GM script for Firefox
========================

修改、原创、自用的GM脚本

个人主页: http://coldfire.qiniudn.com/

## 文件说明

### popupsearch.user.js

在选中的文字上弹出搜索/翻译等快捷操作按钮

Popup search/translate(etc) button for selected texts

![Function](http://lkytal.qiniudn.com/t.png)

GM的"用户脚本设置"下的"Popup Search设置"打开选项选择需要的项目

![Set](http://lkytal.qiniudn.com/set.png)

Also in (http://userscripts.org:8080/scripts/show/187031)

Update Log:

* 2.7.1 : Meta info added
* 2.7.0 : Switch to git
* 2.6.8 : New setting window
* 2.6.7 : New style code
* 2.6.6 : Clean up codes
* 2.6.5 : Update translation
* 2.6.4 : promote css
* 2.6.3 : 完全重写了翻译功能, 稳定 + 快捷
* 2.6.2 : Add failsafe translation
* 2.6.1 : Fix Popup size
* 2.6.0 : Update Jquery

### linkMix.user.js

相比于大部分文字链接化的脚步,加入了如下改善:

1. 识别大部分不以http开头的链接
2. 不会把相连的中文错误识别为链接的一部分
3. 支持Autopage, Superpreload等

注意 : 为了提高执行速度, 去除了对邮箱地址和ftp链接的识别

Advances:

1. Support links that does not start with “http”
2. Support Autopage, Superpreload(etc)
3. Support Unicode characters

Notice: Will NOT handle email address and ftp links in order to speed up execution.

### Tieba_Enhance.user.js

百度贴吧增强. 贴吧小尾巴+最近表情+坟贴检测功能
暂时在chrome下工作尚有瑕疵,请等待更新.

设置按钮:

![Set](http://lkytal.qiniudn.com/setbtn.png)

__修改小尾巴之后记得点击"保存当前尾巴"按钮!__

设置窗口

![Win](http://lkytal.qiniudn.com/win.jpg)

Update Log:

* 5.8.5 : Fix recent img
* 5.8.4 : Fix jquery
* 5.8.2 : Clear tieba link function
* 5.8.1 : Minified storage
* 5.8.0 : Switch to git
* 5.7.8 : Update to suite new tieba
* 5.7.7 : Meta info added
* 5.7.6 : 修复样式
* 5.7.5 : Clear Link
* 5.7.4 : 新的提醒样式
* 5.7.3 : 时间兼容处理延迟
* 5.7.2 : 新版的时间兼容处理
* 5.7.1 : 新版的时间处理
* 5.7.0 : little fix
