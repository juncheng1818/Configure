export function useConnectLine(x, y, width, height, layer, stage) {
    // 创建一个组来包含所有元素
    const group = new Konva.Group({
        draggable: true,
        x: x,
        y: y
    });
    layer.add(group);

    // 创建主线并初始化五个点
    const mainLine = new Konva.Line({
        points: [50, 50, 150, 100, 250, 200, 350, 300, 450, 400],
        stroke: 'lightblue',
        strokeWidth: 6,
        lineCap: 'round',
        lineJoin: 'round',
        listening: true,  // 确保主线在任何时候都监听事件
    });

    group.add(mainLine);

    // 创建动画线，禁用事件监听
    const animatedLine = new Konva.Line({
        points: mainLine.points(),
        stroke: 'blue',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [10, 10],
        opacity: 0.6,
        listening: false, // 禁用动画线的事件监听
    });

    group.add(animatedLine);

    // 创建动画
    const anim = new Konva.Animation(function (frame) {
        const dashOffset = -frame.time / 22; // 调整这个值可以改变流动速度，越小越快
        animatedLine.dashOffset(dashOffset);
    }, layer);

    anim.start();

    // 保存锚点位置
    let savedAnchors = [];

    // 添加锚点函数
    function addAnchor(x, y) {
        const anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 5,
            fill: 'red',
            draggable: true
        });

        group.add(anchor);

        anchor.on('dragmove', function(e) {
            updateLine();
            e.cancelBubble = true; // 防止事件冒泡到组
        });

        // 双击删除锚点
        anchor.on('dblclick', function (e) {
            e.cancelBubble = true; // 防止事件冒泡到组
            anchors = anchors.filter(a => a !== anchor);
            anchor.destroy();
            updateLine();
            layer.draw();
        });

        return anchor;
    }

    // 更新线的点
    function updateLine() {
        const points = [];
        anchors.forEach(anchor => {
            points.push(anchor.x());
            points.push(anchor.y());
        });
        if (points.length > 0) {
            mainLine.points(points);
            animatedLine.points(points);
        }
    }

    // 初始化锚点
    let anchors = mainLine.points().reduce((acc, _, i, arr) => {
        if (i % 2 === 0) {
            acc.push(addAnchor(arr[i], arr[i + 1]));
        }
        return acc;
    }, []);

    // 处理画布点击事件，消除锚点
    stage.on('click', function (e) {
        if (e.target === stage) {
            // 点击画布时移除所有锚点并保存位置
            if (anchors.length > 0) {
                savedAnchors = anchors.map(anchor => ({
                    x: anchor.x(),
                    y: anchor.y()
                }));
                anchors.forEach(anchor => anchor.destroy());
                anchors = [];
            }
            layer.draw();
        }
    });

    // 处理线条点击事件，恢复锚点
    mainLine.on('click', function (e) {
        e.cancelBubble = true;  // 防止事件传播到画布
        // 恢复锚点显示逻辑
        if (anchors.length === 0) {
            savedAnchors.forEach(pos => {
                anchors.push(addAnchor(pos.x, pos.y));
            });
            updateLine();
            layer.draw();
        }
    });

    layer.draw();

    return group; // 返回组，以便外部可以进行进一步的操作
}