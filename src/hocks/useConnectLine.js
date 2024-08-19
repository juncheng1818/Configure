export function useConnectLine(x, y, width, height, layer, stage) {
    let timestamp = Date.now();

    // 创建一个组来包含所有元素
    const group = new Konva.Group({
        name: 'connect-line-group',
        id: `connect-line-group-${timestamp}`,
        draggable: true, // 启用group的拖拽
        x: x,
        y: y,
        // 阻止 Transformer 触发的关键属性
        listening: true,  // 确保组响应事件
    });

    // 使用 Konva 的 setAttr 方法来设置自定义属性
    group.setAttr('customAttrs', {
        animation: null,
        frameDuration: 22
    });

    const linePoints = [
        0, 0,      // 相对于 group 的 (0, 0)
        50, 0,    // 相对于 group 的 (50, 0)
        100, 0,    // 相对于 group 的 (100, 0)
        150, 0,    // 相对于 group 的 (150, 0)
        200, 0     // 相对于 group 的 (200, 0)
    ];

    // 创建主线并初始化五个点
    const mainLine = new Konva.Line({
        name: 'connect-line',
        id: `connect-line-${timestamp}`,
        points: linePoints,
        stroke: 'lightblue',
        strokeWidth: 7,
        lineCap: 'round',
        lineJoin: 'round',
        listening: true,  // 确保主线响应事件
        draggable: false, // 禁用单独拖拽
    });

    group.add(mainLine);

    // 创建动画线，禁用事件监听
    const animatedLine = new Konva.Line({
        name: 'connect-line-animated',
        id: `connect-line-animated-${timestamp}`,
        points: mainLine.points(),
        stroke: '#18a058',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [10, 10],
        opacity: 0.6,
        listening: false, // 确保动画线响应事件
        draggable: false, // 禁用单独拖拽
    });

    group.add(animatedLine);

    // 创建动画的函数
    function createAnimation() {
        const customAttrs = group.getAttr('customAttrs') || {};
        if (customAttrs.animation) {
            customAttrs.animation.stop();
        }

        customAttrs.animation = new Konva.Animation(function (frame) {
            const dashOffset = -frame.time / customAttrs.frameDuration;
            animatedLine.dashOffset(dashOffset);
        }, layer);

        customAttrs.animation.start();
        group.setAttr('customAttrs', customAttrs);
    }

    // 初始创建动画
    createAnimation();

    // 添加一个用于改变流速的函数
    function changeFlowSpeed(newSpeed) {
        const customAttrs = group.getAttr('customAttrs') || {};
        customAttrs.frameDuration = newSpeed;
        group.setAttr('customAttrs', customAttrs);
        createAnimation();
    }

    // 将 changeFlowSpeed 函数添加为 group 的方法
    group.changeFlowSpeed = changeFlowSpeed;

    // 添加一个方法来安全地获取 animation
    group.getAnimation = function () {
        const customAttrs = this.getAttr('customAttrs');
        return customAttrs ? customAttrs.animation : null;
    };

    group.getFrameDuration = function () {
        const customAttrs = this.getAttr('customAttrs') || {};
        return customAttrs.frameDuration;
    };

    // 保存锚点位置
    let savedAnchors = [];

    // 添加锚点函数
    function addAnchor(x, y) {
        const anchor = new Konva.Circle({
            name: 'connect-line-anchor',
            id: `connect-line-anchor-${timestamp}`,
            x: x,
            y: y,
            radius: 5,
            fill: '#18a058',
            draggable: true,
            listening: true, // 确保锚点响应事件
        });

        group.add(anchor);

        anchor.on('dragmove', function (e) {
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

    // 防止事件冒泡到组
    group.on('click', function (e) {
        e.cancelBubble = true;  // 防止事件冒泡并触发Transformer
    });

    // 双击添加锚点
    group.on('dblclick', function (e) {
        // 获取相对于group的鼠标位置
        const pos = group.getRelativePointerPosition();
        // 创建新的锚点（红点）
        const newAnchor = addAnchor(pos.x, pos.y);
        // 将新锚点插入到anchors数组中的适当位置
        let insertIndex = 0;
        for (let i = 0; i < anchors.length - 1; i++) {
            const anchor1 = anchors[i];
            const anchor2 = anchors[i + 1];
            if (pos.x >= anchor1.x() && pos.x <= anchor2.x()) {
                insertIndex = i + 1;
                break;
            }
        }
        anchors.splice(insertIndex, 0, newAnchor);
        updateLine();
        layer.draw();
        e.cancelBubble = true;
    });


    layer.add(group);
    layer.draw();

    return {
        group, timestamp
    };
}
