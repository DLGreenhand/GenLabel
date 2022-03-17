# Dataset Toolbox

## Intro
现支持两个功能：

1. 批量网页（定时）自动截图
2. 单页批量自动刷新&截图

## Usage

- 安装依赖

nodejs > 7.6.0

```shell
$ cnpm install
```

- 编译

```shell
$ cnpm run build
```

- 使用功能

```shell
# 批量网站（定时）自动截图
$ cnpm run mkd -- bs 

# 单页批量自动刷新&截图
$ cnpm run mkd -- gui 
```

- 查阅参数

```shell
# 查看参数列表
$ cnpm run mkd -- -h 
```

```plain
usage: dataset-utils.js [-h] [-v] {bs,gui} ...

Dataset Toolbox

positional arguments:
  {bs,gui}       Dataset Tools
    bs           batch screenshot
    gui          generate UI component labels

optional arguments:
  -h, --help     show this help message and exit
  -v, --version  show program's version number and exit
```

```shell
# 批量网站（定时）自动截图 参数列表
$ cnpm run mkd -- bs -h 
```

```plain
usage: dataset-utils.js bs [-h] [-csv CSVPATH] [-sp SAVEPATH] [-p PAGES] [-t TIMES]
                           [-i INTERVAL]

optional arguments:
  -h, --help            show this help message and exit
  -csv CSVPATH, --csvPath CSVPATH
                        csv file path of urls
  -sp SAVEPATH, --savePath SAVEPATH
                        dir path to save screenshots
  -p PAGES, --pages PAGES
                        num of pages to open at once in puppeteer browser
  -t TIMES, --times TIMES
                        screenshot times
  -i INTERVAL, --interval INTERVAL
                        intervals to screenshot (ms)
```

```shell
# 单页批量自动刷新&截图 参数列表
$ cnpm run mkd -- gui -h 
```

```plain
usage: dataset-utils.js gui [-h] [-url URL] [-sp SAVEPATH] [-p PAGES] [-t TIMES]

optional arguments:
  -h, --help            show this help message and exit
  -url URL, --url URL   url to generate ui component labels
  -sp SAVEPATH, --savePath SAVEPATH
                        dir path to save screenshots
  -p PAGES, --pages PAGES
                        num of pages to open at once in puppeteer browser
  -t TIMES, --times TIMES
                        screenshot times
```