# GM scripts for Firefox and Chrome

原创 & 修改的GM脚本 / GM scripts written or adapted by me

个人主页 / Personal Home Page : [https://lkytal.github.io/](https://lkytal.github.io/)

## 安装链接 / Install links

点击下面的链接安装GM脚本 / Click links below to install

* [Popup Search](https://git.oschina.net/coldfire/GM/raw/master/popsearch.user.js)
* [Text to link](https://git.oschina.net/coldfire/GM/raw/master/linkMix.user.js)
* [Tieba enhance](https://git.oschina.net/coldfire/GM/raw/master/tieba_enhance.user.js)
* [Scroll with mouse plus](https://git.oschina.net/coldfire/GM/raw/master/scroll.user.js)
* [Select like Opera](https://git.oschina.net/coldfire/GM/raw/master/select.user.js)
* [Search Image with Google & Baidu](https://git.oschina.net/coldfire/GM/raw/master/img.user.js)
* [Discuz in new tab](https://git.oschina.net/coldfire/GM/raw/master/discuz_in_tab.user.js)

## 更新日志 / ChangeLog

See [CHANGELOG.md](CHANGELOG.md)

## 脚本说明 / Details

### PopupSearch.user.js

在选中的文字上弹出搜索/翻译等快捷操作按钮

Popup search/translate(etc) button for selected texts

![Function](http://lkytal.qiniudn.com/t.png)

GM 的"用户脚本设置"下的"Popup Search设置"打开选项选择需要的项目

![Set](http://lkytal.qiniudn.com/pset1.png)
![Set](http://lkytal.qiniudn.com/pset2.png)

### linkMix.user.js

#### 相比于大部分文字链接化的脚步,加入了如下改善

1. 识别大部分不以http开头的链接
1. 不会把相连的中文错误识别为链接的一部分
1. 支持AutoPage, SuperPreload等

注意: 为了提高执行速度, 去除了对邮箱地址和ftp链接的识别

#### Advances

1. Support links that do not start with “http”
1. Support AutoPage, SuperPreload (etc)
1. Support Unicode characters

Notice: Will NOT handle email address and ftp links in order to speed up execution.

### Select like Opera

#### Now support both Firefox and Chrome / 支持 Firefox 和 Chrome

Allow you to select texts within any links. / 使你可以自由的选择链接中的文本.

This script is adapted from "Select like Boss" extension, version of 2014.10.14.

### Scroll with Mouse Plus

Allow you to scroll the page by moving your mouse.

### Tieba_Enhance.user.js

百度贴吧增强. 贴吧小尾巴+最近表情+坟贴检测功能
暂时在chrome下工作尚有瑕疵,请等待更新.

设置按钮:

![Set](http://lkytal.qiniudn.com/setbtn.png)

__修改小尾巴之后记得点击"保存当前尾巴"按钮!__

设置窗口

![Win](http://lkytal.qiniudn.com/win.jpg)
