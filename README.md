chaining
========
chaining 是一个nodejs实现的文件同步工具，主要的特性是：当文件被修改时，文件将自动同步给服务器。

## How to Install

## 配置
1. 配置文件配置

在需要同步的目录中，增加`chaining.js`，文件格式如下：

``` js
exports.config = {
    /* 配置是否只进行同步操作,默认为true*/
    "rsyncOnly":true,
    /* 服务器 */
    "Server":"liuqin@10.211.55.5",
    /* 需要同步的目录 */
    "SRC":".",
    /* 服务器上对应的目录 */
    "DEST":"/home/liuqin/workspace/63.node"
}
````
2. 启动配置项配置：
。。。

## 原理说明
主要两部分内容：

1. [rsync](http://zh.wikipedia.org/wiki/Rsync)
2. [fs.watchFile](http://nodejs.org/docs/latest/api/fs.html#fs_fs_watchfile_filename_options_listener)

根据配置文件的配置，使用`fs.watchFile`观察文件变更，同步至服务器的指定目录。

