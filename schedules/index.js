const later = require('later');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
let statisticsForTask = {};

class Task {
    // parseText 时间点
    // task func 任务函数
    // name 任务名字 英文
    // desc 描述
    // enable
    constructor(config, context) {
        this.parseText = config.parseText;
        this.context = context;
        this.task = config.task;
        this.name = config.name;
        this.desc = config.task;
        this.enable = config.enable;

        statisticsForTask[this.name] = {
            name: this.name,
            desc: this.desc,
            enable: this.enable,
            parseText: this.parseText,
            runtimes: 0,
            errors: []
        };
        if (this.enable) {
            this.start().then(function (data) {

            }).catch(function (e) {
                statisticsForTask[this.name].errors.push({
                    msg: e.message,
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                })
            });
        }
    }

    async start() {

        later.setInterval(async () => {
                statisticsForTask[this.name].runtimes++;
                await this.task(this.context);
            },
        later.parse.text(this.parseText))

    }

    taskStatistic() {
        return statisticsForTask;
    }
}


let tasks = {};

async function installAndRun(context) {
    const filePath = path.join(__dirname, '.')
    const files = fs.readdirSync(filePath)
    for (let file of files) {
        if (file === 'index.js') continue;
        let doc = require(`./${file}`);
        if (doc) {
            let task = new Task(doc, context);
            tasks[doc.name] = {
                task: task,
                config: doc
            };
        }
    }
}

exports.tasks = tasks;
exports.Task = Task;
exports.statisticsForTask = statisticsForTask;
exports.installAndRun = installAndRun;
