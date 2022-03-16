# 介绍
本项目的功能是通过无头浏览器爬取目标页面（my-app SPA页面）上的组件信息并完成页面和组件的截图，同时通过命令行的输入控制截图的页数。
```shell
├── example/           // 存储浏览器页面截图的文件夹
├── exa/               // 存储框出组件的页面截图的文件夹
├── example_text/      // 存储页面组件信息（json对象）的文件夹
├── example.cjs        // 获得页面截图、组件信息的主要程序 
├── package.json       // 项目使用依赖的记录信息
```

# 环境
1.需要安装nodejs（7.6.0版本以上）
2.需要安装puppeteer包完成无头浏览器的操作

# 使用
1.在项目跟目录下使用以下命令完成项目初始化
```shell
cnpm install
cnpm init -y
```
2.使用以下命令安装puppeteer
```shell
cnpm install puppeteer --save-dev
```
3.在项目根目录下使用以下命令开始生成截图和组件信息
```shell
node example.cjs {num}
```
num为一个整数，代表生成截图的页数
