let DEFAULT_INTERVAL = 1000/60

// 初始化状态
let STATE_INITIAL = 0 
// 开始状态
let STATE_START = 1
// 停止状态
let STATE_STOP = 2

let init = false

let requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL)
            }
})()

let cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function (id) {
                return window.clearTimeout(id)
            }
})()

function Animation() {
    this.state = STATE_INITIAL
    this.initData = { // 初始数据默认值
        targetParam: { // 动画目标初始参数对象
            startX: 50,
            startY: 50,
            radius: 25,
            sAngle: 0,
            eAngle: 2 * Math.PI,
            counterclockwise: false,
            targetType: "arc", // 动画目标类型
            fillStyle: "blue", // 填充颜色
            imageUrl: "https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v7.3/XML/goldCoin.png",
            width: 50,
            height: 50,
            lastLineToList: []
        },
        motionParam: { // 运动参数默认值           
            task: [ // 任务总计
                {moveX: 0, moveY: 0,  vx: 0, vy: 0}
            ],
            repeatCurrentTask: 0, // 该任务重复次数
            repeatAllTasksFinish: 0, // 总任务完成后的重复次数
            continuity: "start", // 是下一任务连接的开始方式。分为起点开始 "start"；自定义起点开始 "custom"；上一任务结束点开始 "previous"。（前两个也就是不连续,最后一个任务可以不用设置）
            timeDelay: 0, // 一个任务完成后，下个任务开始的延时时间
        },
        taskIndex: 0, // 当前任务队列索引值
        frames: 0, // 当前动画帧数
        endTask: false, // 该任务是否已完成
        endTaskTotal: false, // 全部任务是否已完成
    }
}

/**
 * 是否拖尾效果
 * @param  rgba  拖尾，透明度设置
 */
Animation.prototype.clean = function (rgba) {
    if (!rgba) {
        context.clearRect(0, 0, canvas.width, canvas.height)
    } else {
        context.fillStyle = rgba
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
    return this
}

/**
 * 绘制动画目标
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype.target = function (targetParam, motionParam) {
    let me = this

    if (motionParam === undefined) { // 未传参数可选参数时，使用默认初始值
        motionParam = me.initData.motionParam
    }

    if (targetParam === undefined) { // 未传参数可选参数时，使用默认初始值
        targetParam = me.initData.targetParam
    }

    // 动画目标初始参数对象
    if (me.state === STATE_INITIAL) {
        if (targetParam.targetType === "polygon") {
            me.initData.targetParam.startX = targetParam.startX
            me.initData.targetParam.startY = targetParam.startY
            me.initData.targetParam.targetType = targetParam.targetType
            me.initData.targetParam.fillStyle = targetParam.fillStyle
            me.initData.targetParam.lineToList = []
            for (let i=0; i<targetParam.lineToList.length; i++) {
                let item = targetParam.lineToList[i]
                me.initData.targetParam.lineToList[i] = [item[0], item[1]]
            }
        } else {
            let keys = Object.keys(targetParam)
            for (let i=0; i<keys.length; i++) {
                me.initData.targetParam[keys[i]] = targetParam[keys[i]]
            }
        }
    }

    // 处理参数 targetParam 对象中有些 key 没传时使用默认值
    let keys = Object.keys(me.initData.targetParam)
    for (let i=0; i<keys.length; i++) {
        if (targetParam[keys[i]] === undefined) {
            targetParam[keys[i]] = me.initData.targetParam[keys[i]]
        }
    }

    context.beginPath() // 绘制开始

    // 动画类型处理
    if (targetParam.targetType === "arc") {
        context.arc(targetParam.startX, targetParam.startY, targetParam.radius, targetParam.sAngle, targetParam.eAngle, targetParam.counterclockwise)
    } else if (targetParam.targetType === "rect") {
        context.rect(targetParam.startX, targetParam.startY, targetParam.width, targetParam.height)
    } else if (targetParam.targetType === "image") {
        let img = new Image() // 创建一个 Image 对象
        img.src = targetParam.imageUrl // 为 Image 对象指定图片源
        img.onload = function(){ // 等到图片加载进来之后
            me.clean()
            context.drawImage(img, targetParam.startX, targetParam.startY, targetParam.width, targetParam.height) // 五参数的情况，图片大小由后两个参数控制
        }
        return me._track(targetParam, motionParam)
    } else if (targetParam.targetType === "polygon") {
        context.moveTo(targetParam.startX, targetParam.startY)
        for (let i=0; i<targetParam.lineToList.length; i++) {
            let item = targetParam.lineToList[i]
            context.lineTo(item[0], item[1])
        }
        context.closePath()
    }

    context.fillStyle = targetParam.fillStyle || me.initData.targetParam.fillStyle
    context.fill()

    return me._track(targetParam, motionParam)
}

/**
 * 开始动画
 * @param  callback  动画重复的回调函数
 */
Animation.prototype.start = function (callback) {
    if (this.initData.endTaskTotal) { 
        this.initData.endTaskTotal = false
        this.initData.motionParam.endTask = false

        return this
    }

    if (this.state === STATE_START) {
        cancelAnimationFrame(requestID)
    }
    this.state = STATE_START

    if (this.initData.motionParam.endTask) {
        this.initData.motionParam.endTask = false

        setTimeout(function(){
            requestID = requestAnimationFrame(callback)
        }, this.initData.motionParam.timeDelay)
    } else {
        requestID = requestAnimationFrame(callback)
    }

    return this
}

/**
 * 停止动画
 * @param  requestID  清除 requestAnimationFrame 的 ID
 */
Animation.prototype.stop = function (requestID) {
    if (this.state === STATE_START) {
        this.state === STATE_STOP
        cancelAnimationFrame(requestID)
    }

    return this
}

/**
 * 重置动画
 * @param  requestID  清除 requestAnimationFrame 的 ID
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype.reset = function (requestID, targetParam, motionParam) {
    this._recover(targetParam, motionParam)

    this.initData.frames = 0
    this.initData.motionParam.repeatCurrentTask = 0
    this.initData.taskIndex = 0
    this.initData.endTaskTotal = false

    this.stop(requestID).clean().target(this.initData.targetParam)

    return this
}

/**
 * 动画目标轨迹
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._track = function (targetParam, motionParam) {
    let taskIndex = this.initData.taskIndex
    let task = motionParam.task[taskIndex]
    let moveX = task.moveX || this.initData.motionParam.task[0].moveX
    let moveY = task.moveY || this.initData.motionParam.task[0].moveY
    let vx = task.vx || this.initData.motionParam.task[0].vx
    let vy = task.vy || this.initData.motionParam.task[0].vy
    let frames = this.initData.frames

    targetParam.startX += moveX + vx * frames
    targetParam.startY += moveY + vy * frames

    let lineToList = targetParam.lineToList

    // 动画为多边形的处理
    if (targetParam.targetType === "polygon") {
        for (let i=0; i<lineToList.length; i++) {
            let item = lineToList[i]

            item[0] += moveX + vx * frames
            item[1] += moveY + vy * frames
        }
    }

    return this._range(targetParam, motionParam)
}

/**
 * 动画运动范围处理
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._range = function (targetParam, motionParam) {
    let taskIndex = this.initData.taskIndex
    let task = motionParam.task[taskIndex]

    // 通过设置动画帧数 frames 来控制范围
    if (task.frames !== undefined && this.initData.frames === task.frames || this.initData.frames === -1) {
        // 双向、单向模式处理
        this._way(targetParam, motionParam)  
    } else if (task.frames == undefined) { // 没设置动画帧数时，默认范围为画布
        this._exceedCanvasRange(targetParam, motionParam)
    }

    this.initData.frames++

    return this
}

/**
 * 双向、单向模式处理
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._way = function (targetParam, motionParam) {
    let taskIndex = this.initData.taskIndex
    let task = motionParam.task[taskIndex]

    if (task.way === undefined || task.way === "twoWay") {
        task.moveX = -task.moveX || this.initData.motionParam.task[0].moveX
        task.moveY = -task.moveY || this.initData.motionParam.task[0].moveY

        if (task.frames) {
            if (this.initData.frames === -1) {
                this.initData.frames = 0
            } else {
                this.initData.frames = -task.frames - 1
            }
        }

        this.initData.motionParam.repeatCurrentTask += 1/2
    } else if (task.way === "oneWay") {
        this.initData.frames = 0
        this.initData.motionParam.repeatCurrentTask++
        if (this.initData.motionParam.repeatCurrentTask !== task.repeatCurrentTask) {
            if (taskIndex === 0) {
                this._recover(targetParam)
            } else {
                this.initData.motionParam.continuity = motionParam.task[taskIndex - 1].continuity
                if (this.initData.motionParam.continuity === undefined || this.initData.motionParam.continuity === "start") {
                    this._recover(targetParam)
                } else if (this.initData.motionParam.continuity === "previous" || this.initData.motionParam.continuity === "custom") {
                    if (this.initData.targetParam.lastStartX !== undefined && this.initData.targetParam.lastStartY !== undefined) {
                        targetParam.startX = this.initData.targetParam.lastStartX
                        targetParam.startY = this.initData.targetParam.lastStartY

                        if (targetParam.targetType === "polygon") {
                            for (let i=0; i<targetParam.lineToList.length; i++) {
                                targetParam.lineToList[i][0] = this.initData.targetParam.lastLineToList[i][0]
                                targetParam.lineToList[i][1] = this.initData.targetParam.lastLineToList[i][1]
                            }
                        }
                    } else {
                        this._recover(targetParam)
                    }                 
                }
            }
        }
    }

    return this._repeatCurrentTask(targetParam, motionParam) // 当前任务完成后的重复处理
}

/**
 * 当前任务完成后的重复处理
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._repeatCurrentTask = function (targetParam, motionParam) {
    let taskIndex = this.initData.taskIndex
    let task = motionParam.task[taskIndex]

    if (this.initData.motionParam.repeatCurrentTask === task.repeatCurrentTask) {
        this.initData.motionParam.timeDelay = motionParam.delayPerTask || task.timeDelay || 0
        this.initData.motionParam.repeatCurrentTask = 0
        this.initData.motionParam.endTask = true
        this.stop(requestID)

        if (task.continuity === "previous") { // 接着上一任务位置开始
            this._previousTaskEndPoint(targetParam)
        } else if (task.continuity === "custom") { // 不连续，自定义起点位置重新开始
            if (task.startX !== undefined && task.startY !== undefined) {
                // 动画为多边形的处理
                if (targetParam.targetType === "polygon") {
                    let X = task.startX - this.initData.targetParam.startX
                    let Y = task.startY - this.initData.targetParam.startY
                    for (let i=0; i<targetParam.lineToList.length; i++) {
                        targetParam.lineToList[i][0] = this.initData.targetParam.lineToList[i][0] + X
                        targetParam.lineToList[i][1] = this.initData.targetParam.lineToList[i][1] + Y                 
                    }
                }

                targetParam.startX = task.startX
                targetParam.startY = task.startY
            } else if (task.startX !== undefined && task.startY === undefined) {
                // 动画为多边形的处理
                if (targetParam.targetType === "polygon") {
                    let X = task.startX - this.initData.targetParam.startX
                    for (let i=0; i<targetParam.lineToList.length; i++) {
                        targetParam.lineToList[i][0] = this.initData.targetParam.lineToList[i][0] + X
                    }
                }

                targetParam.startX = task.startX
            } else if (task.startX === undefined && task.startY !== undefined) {
                // 动画为多边形的处理
                if (targetParam.targetType === "polygon") {
                    let Y = task.startY - this.initData.targetParam.startY
                    for (let i=0; i<targetParam.lineToList.length; i++) {
                        targetParam.lineToList[i][1] = this.initData.targetParam.lineToList[i][1] + Y
                    }
                }

                targetParam.startY = task.startY
            }

            this._previousTaskEndPoint(targetParam)
        }

        this.initData.taskIndex++

        // 全部任务完成后的重复处理
        this._repeatAllTasksFinish(targetParam, motionParam)     
    }
}

/**
 * 全部任务完成后的重复处理
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._repeatAllTasksFinish = function (targetParam, motionParam) {
    if (this.initData.taskIndex >= motionParam.task.length) {
        this.initData.taskIndex = 0
        this.initData.motionParam.repeatAllTasksFinish++
                
        this._recover(targetParam)

        // 全部任务完成后重复处理
        if (this.initData.motionParam.repeatAllTasksFinish === motionParam.repeatAllTasksFinish) {
            this.initData.motionParam.repeatAllTasksFinish = 0
            this.initData.endTaskTotal = true
        }
    }
}

/**
 * 超出画布范围处理
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._exceedCanvasRange = function (targetParam, motionParam) {
    let taskIndex = this.initData.taskIndex
    let task = motionParam.task[taskIndex]

    // 超出画布范围时反弹
    if (targetParam.targetType == "arc") {
        if (task.way === undefined || task.way === "twoWay") {
            if (targetParam.startY > canvas.height - targetParam.radius || targetParam.startY < targetParam.radius || targetParam.startX > canvas.width - targetParam.radius || targetParam.startX < targetParam.radius) {
                this._way(targetParam, motionParam)
            }
        } else if (task.way === "oneWay") {
            if (targetParam.startY > canvas.height + targetParam.radius || targetParam.startY < 0 || targetParam.startX > canvas.width + targetParam.radius || targetParam.startX < 0) {
                // 双向、单向模式处理
                this._way(targetParam, motionParam)
            }
        }
    } 
}

/**
 * 恢复数据为初始值
 * @param  targetParam  动画目标参数对象
 * @param  motionParam  运动参数默认值
 */
Animation.prototype._recover = function (targetParam, motionParam) {
    // 恢复动画初始值
    targetParam.startX = this.initData.targetParam.startX
    targetParam.startY = this.initData.targetParam.startY

    // 动画为多边形的处理
    if (targetParam.targetType === "polygon") {
        for (let i=0; i<targetParam.lineToList.length; i++) {
            targetParam.lineToList[i][0] = this.initData.targetParam.lineToList[i][0]
            targetParam.lineToList[i][1] = this.initData.targetParam.lineToList[i][1]
        }
    }

    // 双向模式时，重置动画时保证移动方向为初始值(即返回没完成时重置动画)
    if (!Number.isInteger(this.initData.motionParam.repeatCurrentTask)) {
        let taskIndex = this.initData.taskIndex
        let task = motionParam.task[taskIndex]

        task.moveX = -task.moveX || this.initData.motionParam.task[0].moveX
        task.moveY = -task.moveY || this.initData.motionParam.task[0].moveY
    }
}

/**
 * 保存上一任务结束点位置
 * @param  targetParam  动画目标参数对象
 */
Animation.prototype._previousTaskEndPoint = function (targetParam) {
    this.initData.targetParam.lastStartX = targetParam.startX
    this.initData.targetParam.lastStartY = targetParam.startY

    // 动画为多边形的处理
    if (targetParam.targetType === "polygon") {
        for (let i=0; i<targetParam.lineToList.length; i++) {
            let item = targetParam.lineToList[i]
            this.initData.targetParam.lastLineToList[i] = [item[0], item[1]]                 
        }
    }
}