# animation 动画库

## 前言

animation 动画库是设计好的一些动画效果，使用起来更加方便简单。

### 使用说明

#### 1. 获取 animation 动画库

    <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.4/XML/animation/animation.js"></script>
    
#### 2. 创建 animation 动画库

    let animation = new Animation()
    
#### 3. animation 动画库的基本方法

- #### 3.1 clean 方法

clean 方法是拖尾效果，参数 rgba 是透明度设置，也就是拖尾效果程度。不带参数即不需要拖尾效果。

#### 语法格式

    animation.clean(rgba)
    
- #### 3.2 target 方法

target 方法是动画目标，一共有两个参数对象。 targetParam 是动画目标对象；motionParam 是运动参数对象。

- #### 参数 targetParam 对象的所有 key 如下表：

##### 动画目标类型为圆弧时

key | 说明
:---: | :---
startX | 圆的中心的 x 坐标
startY | 圆的中心的 y 坐标
radius | 圆的半径
sAngle | 起始角，以弧度计
eAngle | 结束角，以弧度计
counterclockwise | 逆时针还是顺时针绘图。False = 顺时针，true = 逆时针
targetType | 动画目标类型 targetType = "arc"
fillStyle | 填充颜色

##### 动画目标类型为 "rect" 时

key | 说明
:---: | :---:
startX | 矩形左上角的 x 坐标
startY | 矩形左上角的 y 坐标
radius | 矩形的宽度
sAngle | 矩形的高度
targetType | 动画目标类型 targetType = "rect"
fillStyle | 填充颜色

##### 动画目标类型为 "image" 时

key | 说明
:---: | :---
imageUrl | 图片路径
startX | 在画布上放置图像的 x 坐标位置
startY | 在画布上放置图像的 y 坐标位置
radius | 图像的宽度
sAngle | 图像的高度
targetType | 动画目标类型 targetType = "image"
fillStyle | 填充颜色

##### 动画目标类型为 "polygon" 时

key | 说明
:---: | :---
startX | 多边形起始的 x 坐标位置
startY | 多边形起始的 y 坐标位置
lineToList | 多边形其他顶点坐标数组，它是二次数组类型。比如三角形的其他两个顶点坐标为 [[x1, y1], [x2, y2]]
targetType | 动画目标类型 targetType = "polygon"
fillStyle | 填充颜色

- #### 参数 motionParam 对象的所有 key 如下：

##### 当 key 的值为 task 是任务数组，数组里面是对象，所有 key 如下表：

key | 说明
:---: | :---
moveX、moveY | 分别是动画横向、纵向移动距离（即初始速度）
vx、vy | 分别是动画横向、纵向加减速度（加速度为正数，减速度为负数），减速度时需注意设置的减速度不能大于初始速度（如 moveX 必须大于 vx * frames；moveY 必须大于 vy * frames）
frames | 动画帧数（即运动时间，每帧为 1000/60 ms）
repeatCurrentTask | 当前动画任务重复次数
way | 方向模式，默认值为 "twoWay" 是双向模式；"oneWay" 是单向模式
continuity | 下一任务连接的开始方式。分为起点开始 "start"；自定义起点开始 "custom"；上一任务结束点开始 "previous"。（前两个也就是不连续,最后一个任务可以不用设置）
startX、startY | 分别是下一任务不连续时，自定义动画起点坐标（即 continuity 为 true 时设置才起作用）
timeDelay | 一个任务完成后，下个任务开始的延时时间，单位为 ms

##### 当 key 的值为 repeatAllTasksFinish 是全部任务完成后的重复所有任务次数，默认为无限循环；当 key 的值为 delayPerTask 是每一个任务完成后，下个任务开始的延时时间，设置为统一的延时时间，单位为 ms。

#### 语法格式

    animation.target(targetParam, motionParam)
    
- #### 3.3 start 方法

start 方法是动画开始。参数 callback 是动画重复的回调函数。

#### 语法格式

    animation.start(callback)
    
- #### 3.4 stop 方法

stop 方法是动画暂停；参数 requestID 是清除 requestAnimationFrame 的 ID。

#### 语法格式

    animation.pause(requestID)
    
- #### 3.5 reset 方法

reset 方法是动画恢复原位；参数 requestID 是清除 requestAnimationFrame 的 ID，参数 targetParam 是动画目标，参数 motionParam 是运动对象

#### 语法格式

    animation.pause(requestID, targetParam, motionParam)
    
#### 4. animation 动画的调用方式

animation 动画的调用方式是通过链式来调用，先调用 clean 方法来设置是否拖尾效果，然后调用 target 方法来设置动画目标、运动方式、重复次数等功能，最后调用 start 方法来执行动画。

#### 语法格式

    animation.clean(rgba).target(targetParam, motionParam).start(callback)
    
#### 5. animation 动画库实例演示

- #### 5.1 匀速运动

匀速运动是最基础的动画。只需设置 moveX、moveY 即可实现，然后设置动画帧数 frames 的值来控制运动范围（不设置时范围为画布的大小决定）。可以加上当前动画的重复次数 repeatCurrentTask （不设置默认为无限循环）；只有一个动画任务时，还需设置全部任务完成后的重复所有任务次数 repeatAllTasksFinish （不然默认也是无限循环）；方向模式 way (默认为双向模式)。

#### 实例

    <!DOCTYPE html>
    <html lang="zh">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>匀速运动</title>
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <!-- 获取 animation 动画库 -->
            <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation.js"></script>
        </body>

        <script>
            let canvas = document.getElementById("canvas")
            let context = canvas.getContext("2d")
            canvas.width = 800 // 画布宽度
            canvas.height = 400 // 画布高度

            let animation = new Animation() // 创建 animation 动画库
            let rgba = "rgba(255, 255, 255, 0.3)" // 透明度设置，即拖尾效果程度
            
            // 动画目标对象
            let targetParam = {
                startX: 50, // 圆的中心的 x 坐标
                startY: 50, // 圆的中心的 y 坐标
                radius: 25, // 圆的半径
                sAngle: 0, // 起始角，以弧度计
                eAngle: 2 * Math.PI, // 结束角，以弧度计
                counterclockwise: false, // 顺时针绘制
                targetType: "arc", // 动画目标类型为圆弧
                fillStyle: "red", // 填充颜色
            }

            /**
            * 运动参数对象
            * @key  moveX、moveY  分别是动画横向、纵向移动距离（即初始速度）
            * @key  frames  是动画帧数（即运动时间，每帧为 1000/60 ms）
            */
            let motionParam = {
        	    task: [
                    {moveX: 4, moveY: 1, frames: 100, repeatCurrentTask: 1}
                ],
                repeatAllTasksFinish: 1
            }

            function runAnimation() {
                animation.clean(rgba).target(targetParam, motionParam).start(runAnimation)
            }
            
            runAnimation()
        </script>
    </html>
    
#### 运行结果图：

![animation 动画的匀速运动](https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation-uniformMotion.gif)

- #### 5.2 加减速运动

加减速运动是在匀速运动的基础上，去设置 vx、vy 即可实现（设为正数是加速度，设为负数是减速度）。 

#### 实例

    <!DOCTYPE html>
    <html lang="zh">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>加减速运动</title>
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <!-- 获取 animation 动画库 -->
            <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation.js"></script>
        </body>

        <script>
            let canvas = document.getElementById("canvas")
            let context = canvas.getContext("2d")
            canvas.width = 800 // 画布宽度
            canvas.height = 400 // 画布高度

            let animation = new Animation() // 创建 animation 动画库
            let rgba = "rgba(255, 255, 255, 0.3)" // 透明度设置，即拖尾效果程度
            
            // 动画目标对象
            let targetParam = {
                startX: 50, // 圆的中心的 x 坐标
                startY: 50, // 圆的中心的 y 坐标
                radius: 25, // 圆的半径
                sAngle: 0, // 起始角，以弧度计
                eAngle: 2 * Math.PI, // 结束角，以弧度计
                counterclockwise: false, // 顺时针绘制
                targetType: "arc", // 动画目标类型为圆弧
                fillStyle: "red", // 填充颜色
            }

            /**
            * 运动参数对象
            * @key  moveX、moveY  分别是动画横向、纵向移动距离（即初始速度）
            * @key  frames  是动画帧数（即运动时间，每帧为 1000/60 ms）
            */
            let motionParam = {
        	    task: [
                    {moveX: 4, moveY: 1, vx: 0.2, vy: 0.1, frames: 40, repeatCurrentTask: 1}
                ],
                repeatAllTasksFinish: 1
            }

            function runAnimation() {
                animation.clean(rgba).target(targetParam, motionParam).start(runAnimation)
            }
            
            runAnimation()
        </script>
    </html>
    
#### 运行结果图：

![animation 动画的加减速运动](https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation-accelerationAndDecelerationMotion.gif)

- #### 5.3 多任务动画运动

多任务动画运动就是在任务数组 task 里添加就可以实现一个任务完成后接下一个任务执行运动了。多任务动画运动可以设置下一任务连接的开始方式 continuity；也可以设置 startX、startY  来实现自定义下一任务的起点位置（但需 continuity 为 "custom" 时设置才起作用）；还可以设置一个任务完成后，下个任务开始的延时时间 timeDelay；如果每一个任务完成后，下个任务开始的延时时间，设置为统一的延时时间 delayPerTask，则不须在每个任务中设置 timeDelay。

#### 实例

    <!DOCTYPE html>
    <html lang="zh">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>多任务动画运动</title>
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <!-- 获取 animation 动画库 -->
            <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation.js"></script>
        </body>

        <script>
            let canvas = document.getElementById("canvas")
            let context = canvas.getContext("2d")
            canvas.width = 800 // 画布宽度
            canvas.height = 400 // 画布高度

            let animation = new Animation() // 创建 animation 动画库
            let rgba = "rgba(255, 255, 255, 0.3)" // 透明度设置，即拖尾效果程度
            
            // 动画目标对象
            let targetParam = {
                startX: 50, // 圆的中心的 x 坐标
                startY: 50, // 圆的中心的 y 坐标
                radius: 25, // 圆的半径
                sAngle: 0, // 起始角，以弧度计
                eAngle: 2 * Math.PI, // 结束角，以弧度计
                counterclockwise: false, // 顺时针绘制
                targetType: "arc", // 动画目标类型为圆弧
                fillStyle: "red", // 填充颜色
            }

            /**
            * 运动参数对象
            * @key  moveX、moveY  分别是动画横向、纵向移动距离（即初始速度）
            * @key  frames  是动画帧数（即运动时间，每帧为 1000/60 ms）
            */
            let motionParam = {
        	    task: [
                    {moveX: 2, moveY: 6, vx: 0.01, vy: -0.06, frames: 200, repeatCurrentTask: 1, timeDelay: 500},
                {moveX: 8, moveY: 1, vx: -0.1, vy: 0.01, frames: 160, repeatCurrentTask: 2, way: "oneWay", continuity: "custom", startX: 700, startY: 50, timeDelay: 1000},
                {moveX: -8, moveY: 0, vx: -0.2, frames: 40, repeatCurrentTask: 2, way: "oneWay", continuity: "previous", timeDelay: 1500},
                {moveX: 0, moveY: 5, vy: 0.1, frames: 40, repeatCurrentTask: 2, way: "oneWay", continuity: "previous", timeDelay: 2000},
                {moveX: 7, moveY: -5, frames: 60, repeatCurrentTask: 3, way: "oneWay", continuity: "previous"}
                ],
                repeatAllTasksFinish: 1
            }

            function runAnimation() {
                animation.clean(rgba).target(targetParam, motionParam).start(runAnimation)
            }
            
            runAnimation()
        </script>
    </html>
    
#### 运行结果图：

![animation 动画的多任务运动](https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.6/XML/animation/animation-multitasking.gif)
    
### 小结

animation 动画库之后有其他动画效果的更新可随时关注下面 git 网址链接：

[animation 动画库 git 链接：https://github.com/wujinbao/markdown_files/tree/master/XML/animation](https://github.com/wujinbao/markdown_files/tree/master/XML/animation)

