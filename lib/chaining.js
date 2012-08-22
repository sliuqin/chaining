//#!/usr/bin/env node
/*
 * User: liuqin
 * Date: 7/31/12
 * Time: 4:35 PM
 *
 */
var fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');
var forEachAsync = require('forEachAsync');
var colors = require('./colors').colors;
var config = {};

function findAllWatchFiles(path, callback) {
    fs.stat(path, function (err, stats) {
        if (err) {
            console.error(colors.FAIL + 'Error retrieving stats for file: ' + path + colors.ENDC);
        } else {
            if (stats.isDirectory()) {
                fs.readdir(path, function (err, fileNames) {
                    if (err) {
                        console.error(colors.FAIL + 'Error reading path: ' + path + colors.ENDC);
                    }
                    else {
                        fileNames.forEach(function (fileName) {
                            findAllWatchFiles(path + '/' + fileName, callback);
                        });
                    }
                });
            } else {
                callback(path);
            }
        }
    })
}

/**
 * 同步文件夹
 * @param config
 */
function doSync(config) {

    rsync = spawn('rsync', ['-avp', '-e', 'ssh', config.SRC, config.Server + ':' + config.DEST]);
    rsync.stdout.on('data', function (data) {
        console.log('' + data);
    });

    rsync.stderr.on('data', function (data) {
        console.error(colors.FAIL + 'stderr: ' + data + colors.ENDC);
    });

    rsync.on('exit', function (code) {
        if (code == 0) {
            console.log(colors.OKBLUE + new Date + colors.ENDC + ':' + colors.OKGREEN + '同步完成' + colors.ENDC);
        }
        else if (code == 1) {
            console.log(colors.OKBLUE + new Date + colors.ENDC + ':' + colors.OKGREEN + '同步完成' + colors.ENDC);
        }
    });
    // send SIGHUP to process
    //rsync.kill('SIGHUP');
}

/**
 * 设置文件变更时，同步文件夹
 */
function watchFiles(next) {

    findAllWatchFiles(config.SRC, function (_path) {
        _path.match(/\.js|\.vm|\.css|\.htm|\.html|\.less|\.xml$/g) && fs.watchFile(_path, function (curr, prev) {
            if (curr.mtime.getTime() != prev.mtime.getTime()) {
                doSync(config);
            }
        });
    });
    next();
}
/**
 * 读取配置文件,请参照：README.md
 */
function getConfig(def_config) {

    def_config = def_config || {
        //默认只进行同步操作.
        rsyncOnly:true
    };
    var cwd = process.cwd();
    var config;

    try {
        var _config_file = path.join(cwd, 'chaining.js');
        config = require(_config_file).config;
        //合并配置文件
        for (var o in def_config) {
            if (typeof config[o] == 'undefined') {
                config[o] = def_config[o];
            }
        }
        return config;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}
function makeServerDir(next) {

    /**
     * 创建服务器工作目录
     */
    var mkdir = spawn('ssh', [config.Server, 'mkdir', '-p', config.DEST]);
    mkdir.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    mkdir.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        next()
    });

    mkdir.on('exit', function (code) {
        console.log(new Date + ' :child process exited with code ' + code);
        next()
    });

}
function chaining(def_config) {
    config = getConfig(def_config);
    //根据不同的配置,设置不同的actions,作为执行的标准.
    var actions = [];
    if (config.rsyncOnly) {
        actions = [makeServerDir, watchFiles]
    }

    forEachAsync(actions,function (next, fn) {
        fn(next);
    }).then(function () {
            //全部处理完成，先同步文件夹
            doSync(config);
        });
}
exports.chaining = chaining;
