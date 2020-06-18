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

target 方法是绘制动画目标。参数 targetType 是动画目标类型，值分别有 "arc"、"rect"、"image"、"polygon"；参数 targetParam 是动画目标对象，对象的所有 key 如下表：

动画目标类型为 "arc" 时；

key | 说明
:---: | :---:
startX | 圆的中心的 x 坐标
startY | 圆的中心的 y 坐标
radius | 圆的半径
sAngle | 起始角，以弧度计
eAngle | 结束角，以弧度计
counterclockwise | 逆时针还是顺时针绘图。False = 顺时针，true = 逆时针

动画目标类型为 "rect" 时；

key | 说明
:---: | :---:
startX | 矩形左上角的 x 坐标
startY | 矩形左上角的 y 坐标
radius | 矩形的宽度
sAngle | 矩形的高度

动画目标类型为 "image" 时；

key | 说明
:---: | :---:
imageUrl | 图片路径
startX | 在画布上放置图像的 x 坐标位置
startY | 在画布上放置图像的 y 坐标位置
radius | 图像的宽度
sAngle | 图像的高度

动画目标类型为 "polygon" 时；

key | 说明
:---: | :---:
startX | 多边形起始的 x 坐标位置
startY | 多边形起始的 y 坐标位置
lineToList | 多边形其他顶点坐标数组，它是二次数组类型。比如三角形的其他两个顶点坐标为 [[x1, y1], [x2, y2]]

#### 语法格式

    animation.target(targetType, targetParam)
    
- #### 3.3 track 方法

track 方法是动画目标轨迹。参数 vx 是动画目标横向移动速度；参数 vy 是动画目标纵向移动速度；参数 targetParam 是动画目标对象；参数 taskIndex 是任务队列索引值。

#### 语法格式

    animation.track(vx, vy, targetParam, taskIndex)
    
- #### 3.4 range 方法

range 方法是超出画布范围处理。参数 targetType 是动画目标类型；参数 targetParam 是动画目标对象。

#### 语法格式

    animation.range(targetType, targetParam)
    
- #### 3.5 customRange 方法

customRange 方法是自定义范围处理，通过设置动画帧数来实现。参数 frames 是动画帧数，限制运动范围；参数 taskIndex 是任务队列索引值；参数 repeatTask 是任务重复次数，未设置次数时则为无限循环。

#### 语法格式

    animation.customRange(frames, taskIndex, repeatTask)
    
- #### 3.6 start 方法

start 方法是动画开始。参数 callback 是动画重复的回调函数；参数 taskTotal 是任务总数。

#### 语法格式

    animation.start(callback, taskTotal)
    
- #### 3.7 pause 方法

pause 方法是动画暂停；参数 requestID 是清除 requestAnimationFrame 的 ID。

#### 语法格式

    animation.pause(requestID)
    
- #### 3.8 stop 方法

stop 方法是动画停止；参数 requestID 是清除 requestAnimationFrame 的 ID，参数 targetType 是动画目标类型，参数 targetParam 是动画目标对象

#### 语法格式

    animation.pause(requestID, targetType, targetParam)
    
#### 4. animation 动画库实例演示

- #### 4.1 基本的链式调用

#### 实例

    <!DOCTYPE html>
    <html lang="zh">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>基本的链式调用</title>
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <button onclick="start()">开始</button>
            <button onclick="pause()">暂停</button>
            <button onclick="stop()">停止</button>
            <!-- 获取 animation 动画库 -->
            <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.5/XML/animation/animation.js"></script>
        </body>

        <script>
            let canvas = document.getElementById("canvas")
            let context = canvas.getContext("2d")
            canvas.width = 500 // 画布宽度
            canvas.height = 300 // 画布高度

            let animation = new Animation() // 创建 animation 动画库
            let rgba = "rgba(255, 255, 255, 0.3)" // 透明度设置，即拖尾效果程度
            let targetType = "arc" // 动画目标类型
            let targetParam = { // 动画目标对象
                startX: 50,
                startY: 50,
                radius: 25,
                sAngle: 0,
                eAngle: 2 * Math.PI,
                counterclockwise: false
            }
            let vx = 5 // 动画目标横向移动速度
            let vy = 2 // 动画目标纵向移动速度

            function runAnimation() {
                // 链式方式调用
                animation.clean(rgba).target(targetType, targetParam).track(vx, vy, targetParam).range(targetType, targetParam).start(runAnimation)
            }

            function start() {
                runAnimation()  // 动画开始
            }

            function pause() {
                animation.pause(requestID) // 动画暂停
            }

            function stop() {
                animation.stop(requestID, targetType, targetParam) // 动画停止
            }

            animation.target(targetType, targetParam) // 绘制动画目标
        </script>
    </html>
    
- #### 4.2 多任务的链式调用

#### 实例

    <!DOCTYPE html>
    <html lang="zh">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>多任务的链式调用</title>
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <!-- 获取 animation 动画库 -->
            <script src="https://cdn.jsdelivr.net/gh/wujinbao/markdown_files@v8.5/XML/animation/animation.js"></script>
        </body>

        <script>
            let canvas = document.getElementById("canvas")
            let context = canvas.getContext("2d")
            canvas.width = 500 // 画布宽度
            canvas.height = 300 // 画布高度

            let animation = new Animation() // 创建 animation 动画库
            let rgba = "rgba(255, 255, 255, 0.3)" // 透明度设置，即拖尾效果程度
            let targetType = "arc" // 动画目标类型
            let targetParam = { // 动画目标对象
                startX: 50,
                startY: 50,
                radius: 25,
                sAngle: 0,
                eAngle: 2 * Math.PI,
                counterclockwise: false
            }
            let vx = 5 // 动画目标横向移动速度
            let vy = 5 // 动画目标纵向移动速度          
            let frames = 30 // 动画帧数，限制运动范围
            let repeatTask = 6 // 设置任务的重复次数
            let taskTotal = 3 // 任务总数

            function runAnimation() {
                // 多任务的链式方式调用
                animation.clean(rgba).target(targetType, targetParam).track(vx, vy, targetParam, 0).customRange(frames, 0, repeatTask).track(5, 0, targetParam, 1).customRange(40, 1, 4).track(0, 5, targetParam, 2).customRange(20, 2, 8).start(runAnimation, taskTotal)
            }

            runAnimation() // 执行动画
        </script>
    </html>
    
### 小结

animation 动画库之后有其他动画效果的更新可随时关注下面 git 网址链接：

[animation 动画库 git 链接：https://github.com/wujinbao/markdown_files/tree/master/XML/animation](https://github.com/wujinbao/markdown_files/tree/master/XML/animation)

