#GM script for Firefox

原创 & 修改的GM脚本

个人主页: http://lkytal.github.io/

微博： http://weibo.com/u/3836876207

## 安装链接

点击下面的链接安装GM脚本

* [Popup Search](https://git.oschina.net/coldfire/GM/raw/master/popsearch.user.js)
* [Text to link](https://git.oschina.net/coldfire/GM/raw/master/linkMix.user.js)
* [Tieba enhance](https://git.oschina.net/coldfire/GM/raw/master/tieba_enhance.user.js)
* [Scroll with mouse plus](https://git.oschina.net/coldfire/GM/raw/master/scroll.user.js)
* [Select like Opera](https://git.oschina.net/coldfire/GM/raw/master/select.user.js)
* [Search Image with google & baidu](https://git.oschina.net/coldfire/GM/raw/master/img.user.js)
* [Discuz新标签打开](https://git.oschina.net/coldfire/GM/raw/master/discuz_in_tab.user.js)

## 部分文件说明

### popupsearch.user.js

在选中的文字上弹出搜索/翻译等快捷操作按钮

Popup search/translate(etc) button for selected texts

![Function](http://lkytal.qiniudn.com/t.png)

GM的"用户脚本设置"下的"Popup Search设置"打开选项选择需要的项目

![Set](http://lkytal.qiniudn.com/set.png)

Update Log:

* 2.8.5 : Translate sync
* 2.8.4 : cleanup
* 2.8.2 : better css style
* 2.8.1 : Multiply tranlate address
* 2.8.0 : More translation methods
* 2.7.5 : Exclude test page
* 2.7.4 : Fix up
* 2.7.3 : UI improve
* 2.7.2 : Update Method change
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

* 5.9.7 : Fix eval
* 5.9.5 : Fix tail trigger
* 5.9.5 : fix tail box may not shown
* 5.9.4 : Html code cleanup
* 5.9.3 : Fix for new navtab
* 5.9.2 : clearLink fix
* 5.9.0 : New backend
* 5.8.7 : fix up
* 5.8.6 : coffee script
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
