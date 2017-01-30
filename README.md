#GM script for Firefox

[![Join the chat at https://gitter.im/lkytal/GM](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lkytal/GM?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
* [Search Image with Google & Baidu](https://git.oschina.net/coldfire/GM/raw/master/img.user.js)
* [Discuz新标签打开](https://git.oschina.net/coldfire/GM/raw/master/discuz_in_tab.user.js)

## 部分文件说明

### popupsearch.user.js

在选中的文字上弹出搜索/翻译等快捷操作按钮

Popup search/translate(etc) button for selected texts

![Function](http://lkytal.qiniudn.com/t.png)

GM的"用户脚本设置"下的"Popup Search设置"打开选项选择需要的项目

![Set](https://dn-lkytal.qbox.me/pset1.png)
![Set](https://dn-lkytal.qbox.me/pset2.png)

Update Log:

* 4.0.8 : Retry when tranlate timeout
* 4.0.7 : False popup in textbox in chrome
* 4.0.6 : Fix userEngine Error
* 4.0.5 : Back to google translation
* 4.0.4 : Fixed open as link
* 4.0.3 : Add douban engine
* 4.0.2 : Fixed open as link and style in v2ex
* 4.0.1 : Better performance
* 4.0.0 : New setting UI with many new engines
* 3.5.0 : Setting enhance
* 3.4.0 : Fix Unhidden problem
* 3.3.3 : Better position locating
* 3.3.1 : update jquery
* 3.3.0 : Position problem in chrome
* 3.2.9 : Update to jquery v3
* 3.2.8 : Fix multi tabs
* 3.2.7 : Update to jQuery 3.1.0
* 3.2.6 : Auto copying in chrome
* 3.2.5 : Translation fixup for large texts
* 3.2.4 : Multiline fixup
* 3.2.3 : fix popup position
* 3.2.2 : Multiline fixup
* 3.2.1 : fix translation
* 3.2.0 : transform to Youdao
* 3.1.7 : Ip fix
* 3.1.6 : Ip Updated
* 3.1.5 : no jquery conflicts
* 3.1.4 : fix Background mode for chrome
* 3.1.3 : Background mode
* 3.1.2 : fix translation
* 3.1.0 : iframe support
* 3.0.5 : taobao fix
* 3.0.4 : mouseup event
* 3.0.3 : css fix
* 3.0.2 : new setting box
* 3.0.0 : UI redesigned
* 2.9.7 : Google Page
* 2.9.5 : Setting window
* 2.9.1 : In site search fix
* 2.9.0 : In site search
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

* 2.7.0 : Exclude 163.com
* 2.6.9 : exclude rule
* 2.6.8 : exclude *www.google.*
* 2.6.7 : Fix for zhihu
* 2.6.5 : Meta update
* 2.6.4 : Ext tag
* 2.6.3 : '/' as end char
* 2.6.1 : observer
* 2.5.1 : Fix
* 2.5.0 : 修复了一个低级错误导致的http前缀重复...
* 2.4.4 : 分段加载提高效率
* 2.4.3 : Fix RegExp
* 2.4.2 : New Mode to replace link, better performance
* 2.4.1 : Update regexp, "use strict" mode to enhance performance
* 2.4.0 : Fix scan error on ending chapter
* 2.3.9 : 更新meta内容
* 2.3.8 : 迁移到Greasefork
* 2.3.7 : 更新正则表达式
* 2.3.6 : 更新正则表达式
* 2.3.5 : 恢复对微博的支持
* 2.3.4 : 修复偶尔不能识别https的问题
* 2.3.3 : 排除微博
* 2.3.2 : Bug fix
* 2.3.1 : Bug fix
* 2.3.0 : 大幅修改了选择器代码
* 2.2.5 : 排除code标签
* 2.2.4 : 新增部分域名后缀
* 2.2.3 : 优化正则表达式
* 2.2.2 : 修复因为延迟可能错过某些链接的问题
* 2.2.1 : 修正正则表达式
* 2.2.0 : 改用CoffeeScript生成
* 2.1.4 : 修复识别错误
* 2.1.3 : Little Fix
* 2.1.2 : 混合分析以提高效率
* 2.1.1 : 改变延迟参数
* 2.1.0 : 彻底重写了代码... 应该几乎不会有什么卡顿了
* 2.0.9 : 降低卡顿
* 2.0.8 : 修复bug
* 2.0.7 : 优化正则表达式
* 2.0.6 : 提高执行效率
* 2.0.5 : 修复中文识别
* 2.0.4 : 修复自动翻页

### Tieba_Enhance.user.js

百度贴吧增强. 贴吧小尾巴+最近表情+坟贴检测功能
暂时在chrome下工作尚有瑕疵,请等待更新.

设置按钮:

![Set](http://lkytal.qiniudn.com/setbtn.png)

__修改小尾巴之后记得点击"保存当前尾巴"按钮!__

设置窗口

![Win](http://lkytal.qiniudn.com/win.jpg)

Update Log:

* 6.1.1 : Random Tail
* 6.1.0 : Fixed all known issues
* 6.0.5 : Soft checking
* 6.0.3 : Code merge
* 6.0.2 : Cleanup
* 6.0.1 : Update for date checking
* 6.0.0 : Remove recent ico
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
