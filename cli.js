//#!/usr/bin/env node
if (!module.parent) {

    var chaining = require('./lib/chaining').chaining;
    var colors = require('./lib/colors').colors;
    var argv = process.argv;
    var firstArgv = argv[2];

    var readline = require('readline'),
        rl = readline.createInterface(process.stdin, process.stdout);
    /**
     * 显示帮助内容
     */
    function help() {
        console.log('\n');
        console.log(colors.OKBLUE + '---------------Chaining帮助----------------' + colors.ENDC);
        console.log(colors.OKBLUE + '| ' + colors.ENDC + colors.OKGREEN + 'deploy' + colors.ENDC + ':需要编译重启系统,请在对话框中直接输入: deploy 或者下次直接使用 " clouding deploy " ! ');
        console.log(colors.OKBLUE + '| ' + colors.ENDC + colors.OKGREEN + 'deploy 系统名' + colors.ENDC + ':需要编译重启指定系统,请在对话框中直接输入: deploy 系统名 比如: deploy cashier 或者下次直接使用 " clouding deploy cashier" !');
        console.log(colors.OKBLUE + '---------------Chaining帮助----------------' + colors.ENDC);
        console.log('\n');
        rl.prompt();
    }

    switch (firstArgv) {
        case '-h':
        case '--help':
        case 'help':
            rl.setPrompt('Cloud Coding > ');
            help();

            rl.on('line',function (line) {
                switch (line.trim()) {
                    //退出
                    case 'exit':
                        console.log(colors.OKBLUE + 'Have a great day!' + colors.ENDC);
                        process.exit(0);
                        break;
                    //如果不输入东西,啥也不做
                    case '':
                        break;
                    case 'help':
                        help();
                        break;
                    //编译指定系统
                    case 'deploy':
                        break;
                    default:
                        console.log('无法识别的命令,请看一下帮助');
                        help();
                        break;
                }
                rl.prompt();
            }).on('close', function () {
                    console.log('Have a great day!');
                    process.exit(0);
                });
            break;
    /**
     * 默认直接启动系统
     */
        default :
            chaining();
            break;
    }
}