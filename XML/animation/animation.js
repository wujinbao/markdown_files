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
    this.fillStyle = "blue"
    this.targetParam = {} // 动画目标初始参数对象
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
 * 超出画布范围处理
 * @param  targetType  动画目标类型
 * @param  targetParam  动画目标参数对象
 */
Animation.prototype.range = function (targetType, targetParam) {
    // 超出画布范围时需反弹移动，把移动速度取相反数即可
    if (targetType == "arc") {
        if (targetParam.startY + this.vy > canvas.height - targetParam.radius || targetParam.startY + this.vy < targetParam.radius) {
            this.vy = -this.vy
        }
        if (targetParam.startX + this.vx > canvas.width - targetParam.radius || targetParam.startX + this.vx < targetParam.radius) {
            this.vx = -this.vx
        }
    } else if (targetType == "rect" || targetType == "image") {
        if (targetParam.startY + this.vy > canvas.height - targetParam.height || targetParam.startY + this.vy < 0) {
            this.vy = -this.vy
        }
        if (targetParam.startX + this.vx > canvas.width - targetParam.width || targetParam.startX + this.vx < 0) {
            this.vx = -this.vx
        } 
    } else if (targetType == "polygon") {
        if (targetParam.startY > canvas.height || targetParam.startY < 0) {
            this.vy = -this.vy
        } else {
            for (let i=0; i<targetParam.lineToList.length; i++) {
                let item = targetParam.lineToList[i]
                if (item[1] > canvas.height || item[1] < 0) {
                    this.vy = -this.vy
                    return this
                }
            }
        }
        if (targetParam.startX > canvas.width || targetParam.startX < 0) {
            this.vx = -this.vx
        } else {
            for (let i=0; i<targetParam.lineToList.length; i++) {
                let item = targetParam.lineToList[i]
                if (item[0] > canvas.width || item[0] < 0) {
                    this.vx = -this.vx
                    return this
                }
            }
        }
    }

    return this
}

/**
 * 绘制动画目标
 * @param  targetType  动画目标类型
 * @param  targetParam  动画目标参数对象
 * @param  fillStyle  动画目标填充颜色   
 */
Animation.prototype.target = function (targetType, targetParam, fillStyle) {
    let me = this

    // 动画目标初始参数对象
    if (me.state === STATE_INITIAL) {
        if (targetType == "polygon") {
            me.targetParam.startX = targetParam.startX
            me.targetParam.startY = targetParam.startY
            me.targetParam.lineToList = []
            for (let i=0; i<targetParam.lineToList.length; i++) {
                let item = targetParam.lineToList[i]
                me.targetParam.lineToList[i] = [item[0], item[1]]
            }
        } else {
            let keys = Object.keys(targetParam)
            for (let i=0; i<keys.length; i++) {
                me.targetParam[keys[i]] = targetParam[keys[i]]
            }
        }
    }

    context.beginPath()

    if (targetType == "arc") {
        context.arc(targetParam.startX, targetParam.startY, targetParam.radius, targetParam.sAngle, targetParam.eAngle, targetParam.counterclockwise)
    } else if (targetType == "rect") {
        context.rect(targetParam.startX, targetParam.startY, targetParam.width, targetParam.height)
    } else if (targetType == "image") {
        let img = new Image() // 创建一个 Image 对象
        img.src = targetParam.imageUrl // 为 Image 对象指定图片源
        img.onload = function(){ // 等到图片加载进来之后
            me.clean()
            context.drawImage(img, targetParam.startX, targetParam.startY, targetParam.width, targetParam.height) // 五参数的情况，图片大小由后两个参数控制
        }
        return me
    } else if (targetType == "polygon") {
        context.moveTo(targetParam.startX, targetParam.startY)
        for (let i=0; i<targetParam.lineToList.length; i++) {
            let item = targetParam.lineToList[i]
            context.lineTo(item[0], item[1])
        }
        context.closePath()
    }

    context.fillStyle = fillStyle || me.fillStyle
    context.fill()

    return me
}

/**
 * 动画目标轨迹
 * @param  vx  动画目标横向移动速度
 * @param  vy  动画目标纵向移动速度
 * @param  targetParam  动画目标参数对象
 */
Animation.prototype.track = function (vx, vy, targetParam) {
    if (this.vy == -vy) {
        this.vy = -vy
    } else {
        this.vy = vy
    }

    if (this.vx == -vx) {
        this.vx = -vx
    } else {
        this.vx = vx
    }

    targetParam.startX += this.vx
    targetParam.startY += this.vy
    if (targetParam.lineToList) {
        for (let i=0; i<targetParam.lineToList.length; i++) {
            let item = targetParam.lineToList[i]
            item[0] += this.vx
            item[1] += this.vy
        }
    }

    return this
}

/**
 * 开始动画
 * @param  callback  动画重复的回调函数
 */
Animation.prototype.start = function (callback) {
    if (this.state === STATE_START) {
        cancelAnimationFrame(requestID)
    }
    this.state = STATE_START
    requestID = requestAnimationFrame(callback)

    return this
}

/**
 * 暂停动画
 * @param  requestID  清除 requestAnimationFrame 的 ID
 */
Animation.prototype.pause = function (requestID) {
    if (this.state === STATE_START) {
        this.state === STATE_STOP
        cancelAnimationFrame(requestID)
    }

    return this
}

/**
 * 停止动画
 * @param  requestID  清除 requestAnimationFrame 的 ID
  * @param  targetType  动画目标类型
 * @param  targetParam  动画目标参数对象
 */
Animation.prototype.stop = function (requestID, targetType, targetParam) {
    // 数据恢复到初始状态
    targetParam.startX = this.targetParam.startX
    targetParam.startY = this.targetParam.startY
    this.vx = vx
    this.vy = vy

    if (targetType == "polygon") {
        for (let i=0; i<targetParam.lineToList.length; i++) {
            targetParam.lineToList[i][0] = this.targetParam.lineToList[i][0]
            targetParam.lineToList[i][1] = this.targetParam.lineToList[i][1]
        }
    }

    this.pause(requestID).clean().target(targetType, this.targetParam)

    return this
}