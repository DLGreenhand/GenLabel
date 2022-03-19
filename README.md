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

## Example

### 单页批量自动刷新&截图

- 原始图

<img src="example/gui-images-example.jpg" width = "195" height = "422" alt="gui-image-example" />

- 标注图

<img src="example/gui-images-gnd-example.jpg" width = "195" height = "422" alt="gui-image-gndexample" />

- label


```plain
0 0.16923076923076924 0.0832808797393365 0.1282051282051282 0.02819534952606635
1 0.41025641025641024 0.08323459715639811 0.2717948717948718 0.04739336492890995
2 0.6692307692307692 0.08192017180094786 0.1641025641025641 0.0974896327014218
3 0.8435897435897436 0.08384552725118484 0.10256410256410256 0.023696682464454975
4 0.2358974358974359 0.211483634478673 0.16923076923076924 0.12372260071090048
5 0.48333333333333334 0.24914840047393366 0.24358974358974358 0.037914691943127965
6 0.7474358974358974 0.25862707345971564 0.20256410256410257 0.018957345971563982
7 0.2423076923076923 0.36455864928909953 0.1641025641025641 0.037914691943127965
8 0.6025641025641025 0.32843046504739337 0.47435897435897434 0.07225636848341233
9 0.5 0.4119520142180095 0.19743589743589743 0.018957345971563982
10 0.5 0.4593453791469194 0.7256410256410256 0.037914691943127965
11 0.3935897435897436 0.5162174170616114 0.2564102564102564 0.037914691943127965
12 0.6487179487179487 0.5162174170616114 0.1717948717948718 0.018957345971563982
13 0.5205128205128206 0.5683501184834123 0.8974358974358975 0.02843601895734597
14 0.5 0.6194368335308057 0.26666666666666666 0.02534434241706161
15 0.5 0.6700236966824644 0.617948717948718 0.037914691943127965
16 0.41410256410256413 0.7268957345971564 0.27692307692307694 0.037914691943127965
17 0.658974358974359 0.7268957345971564 0.13076923076923078 0.03317535545023697
18 0.5 0.9259293542654028 0.8564102564102564 0.322237855450237
19 0.3141025641025641 1.2338381220379147 0.10256410256410256 0.04739336492890995
20 0.4371794871794872 1.2338381220379147 0.06153846153846154 0.018957345971563982
21 0.6230769230769231 1.1723563388625593 0.2282051282051282 0.13270142180094788
```

- classes

`label`的第一个字段`num`对应下面`classes`的`index`，实现`label`与组件名的映射。

```js
["Text","Button","Icon","MenuButton","Image","SplitButton","BreadCrumb","Pagination","Tab","CheckBox","Input","NumPicker","Radio","Range","Rating","Search","Select","Switch","Transfer","Avatar","Badge","Collapse"]
```