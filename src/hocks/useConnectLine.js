export function useConnectLine(x, y, width, height, layer, stage) {
    const timestamp = Date.now();
    
    // 默认配置
    const defaultConfig = {
        frameDuration: 22,
        mainLineStroke: 'lightblue',
        mainLineWidth: 7,
        animatedLineStroke: '#18a058',
        animatedLineWidth: 3,
        anchorRadius: 5,
        anchorFill: '#18a058',
        dashPattern: [10, 10],
        opacity: 0.6
    };

    // 创建一个组来包含所有元素
    const group = new Konva.Group({
        name: 'connect-line-group',
        id: `connect-line-group-${timestamp}`,
        draggable: true,
        x: x,
        y: y,
        listening: true,
    });

    // 设置自定义属性
    group.setAttr('customAttrs', {
        animation: null,
        frameDuration: defaultConfig.frameDuration,
        config: defaultConfig
    });

    // 默认连线点
    const defaultLinePoints = [0, 0, 50, 0, 100, 0, 150, 0, 200, 0];

    // 创建主线
    const mainLine = new Konva.Line({
        name: 'connect-line',
        id: `connect-line-${timestamp}`,
        points: defaultLinePoints,
        stroke: defaultConfig.mainLineStroke,
        strokeWidth: defaultConfig.mainLineWidth,
        lineCap: 'round',
        lineJoin: 'round',
        listening: true,
        draggable: false,
    });

    // 创建动画线
    const animatedLine = new Konva.Line({
        name: 'connect-line-animated',
        id: `connect-line-animated-${timestamp}`,
        points: defaultLinePoints,
        stroke: defaultConfig.animatedLineStroke,
        strokeWidth: defaultConfig.animatedLineWidth,
        lineCap: 'round',
        lineJoin: 'round',
        dash: defaultConfig.dashPattern,
        opacity: defaultConfig.opacity,
        listening: false,
        draggable: false,
    });

    group.add(mainLine);
    group.add(animatedLine);

    // 动画管理类
    class AnimationManager {
        constructor(group, animatedLine, layer) {
            this.group = group;
            this.animatedLine = animatedLine;
            this.layer = layer;
        }

        createAnimation() {
            try {
                const customAttrs = this.group.getAttr('customAttrs') || {};
                
                // 停止现有动画
                if (customAttrs.animation) {
                    customAttrs.animation.stop();
                }

                // 检查必要的对象是否存在
                if (!this.animatedLine || !this.layer) {
                    console.warn('动画对象不存在，跳过动画创建');
                    return;
                }

                // 创建新动画
                customAttrs.animation = new Konva.Animation((frame) => {
                    if (this.animatedLine && frame) {
                        const dashOffset = -frame.time / customAttrs.frameDuration;
                        this.animatedLine.dashOffset(dashOffset);
                    }
                }, this.layer);

                customAttrs.animation.start();
                this.group.setAttr('customAttrs', customAttrs);
            } catch (error) {
                console.warn('创建动画时出错:', error);
            }
        }

        changeFlowSpeed(newSpeed) {
            const customAttrs = this.group.getAttr('customAttrs') || {};
            customAttrs.frameDuration = Math.max(1, newSpeed); // 确保速度至少为1
            this.group.setAttr('customAttrs', customAttrs);
            this.createAnimation();
        }

        stopAnimation() {
            try {
                const customAttrs = this.group.getAttr('customAttrs') || {};
                if (customAttrs.animation) {
                    customAttrs.animation.stop();
                    customAttrs.animation = null;
                    this.group.setAttr('customAttrs', customAttrs);
                }
            } catch (error) {
                console.warn('停止动画时出错:', error);
            }
        }

        startAnimation() {
            this.createAnimation();
        }

        isRunning() {
            const customAttrs = this.group.getAttr('customAttrs') || {};
            return customAttrs.animation ? customAttrs.animation.isRunning() : false;
        }
    }

    // 创建动画管理器
    const animationManager = new AnimationManager(group, animatedLine, layer);
    
    // 初始创建动画
    animationManager.createAnimation();

    // 将方法绑定到group
    group.changeFlowSpeed = (newSpeed) => animationManager.changeFlowSpeed(newSpeed);
    group.getAnimation = () => animationManager;
    group.getFrameDuration = () => {
        const customAttrs = group.getAttr('customAttrs') || {};
        return customAttrs.frameDuration;
    };

    // 锚点管理类
    class AnchorManager {
        constructor(group, mainLine, animatedLine, layer, timestamp, config) {
            this.group = group;
            this.mainLine = mainLine;
            this.animatedLine = animatedLine;
            this.layer = layer;
            this.timestamp = timestamp;
            this.config = config;
            this.anchors = [];
            this.savedAnchors = [];
        }

        addAnchor(x, y) {
            const anchor = new Konva.Circle({
                name: 'connect-line-anchor',
                id: `connect-line-anchor-${this.timestamp}-${Date.now()}`,
                x: x,
                y: y,
                radius: this.config.anchorRadius,
                fill: this.config.anchorFill,
                draggable: true,
                listening: true,
            });

            this.group.add(anchor);

            // 绑定事件
            anchor.on('dragmove', (e) => {
                this.updateLine();
                e.cancelBubble = true;
            });

            anchor.on('dblclick', (e) => {
                e.cancelBubble = true;
                this.removeAnchor(anchor);
            });

            this.anchors.push(anchor);
            return anchor;
        }

        removeAnchor(anchor) {
            this.anchors = this.anchors.filter(a => a !== anchor);
            anchor.destroy();
            this.updateLine();
            this.layer.draw();
        }

        updateLine() {
            const points = [];
            this.anchors.forEach(anchor => {
                points.push(anchor.x());
                points.push(anchor.y());
            });
            
            if (points.length > 0) {
                this.mainLine.points(points);
                this.animatedLine.points(points);
            }
        }

        saveAnchors() {
            this.savedAnchors = this.anchors.map(anchor => ({
                x: anchor.x(),
                y: anchor.y()
            }));
        }

        restoreAnchors() {
            this.savedAnchors.forEach(pos => {
                this.addAnchor(pos.x, pos.y);
            });
            this.updateLine();
        }

        clearAnchors() {
            this.anchors.forEach(anchor => anchor.destroy());
            this.anchors = [];
        }

        initializeFromPoints(points) {
            for (let i = 0; i < points.length; i += 2) {
                this.addAnchor(points[i], points[i + 1]);
            }
        }
    }

    // 创建锚点管理器
    const anchorManager = new AnchorManager(group, mainLine, animatedLine, layer, timestamp, defaultConfig);

    // 初始化锚点
    anchorManager.initializeFromPoints(defaultLinePoints);

    // 事件处理器类
    class EventHandler {
        constructor(stage, layer, group, mainLine, anchorManager) {
            this.stage = stage;
            this.layer = layer;
            this.group = group;
            this.mainLine = mainLine;
            this.anchorManager = anchorManager;
            this.setupEvents();
        }

        setupEvents() {
            // 画布点击事件 - 隐藏锚点
            this.stage.on('click', (e) => {
                if (e.target === this.stage) {
                    this.anchorManager.saveAnchors();
                    this.anchorManager.clearAnchors();
                    this.layer.draw();
                }
            });

            // 主线点击事件 - 显示锚点
            this.mainLine.on('click', (e) => {
                e.cancelBubble = true;
                if (this.anchorManager.anchors.length === 0) {
                    this.anchorManager.restoreAnchors();
                    this.layer.draw();
                }
            });

            // 组点击事件 - 防止事件冒泡
            this.group.on('click', (e) => {
                e.cancelBubble = true;
            });

            // 双击添加锚点
            this.group.on('dblclick', (e) => {
                const pos = this.group.getRelativePointerPosition();
                if (pos) {
                    this.addAnchorAtPosition(pos.x, pos.y);
                    this.layer.draw();
                }
                e.cancelBubble = true;
            });
        }

        addAnchorAtPosition(x, y) {
            const newAnchor = this.anchorManager.addAnchor(x, y);
            
            // 将新锚点插入到适当位置（按x坐标排序）
            const anchors = this.anchorManager.anchors;
            const sortedAnchors = anchors.sort((a, b) => a.x() - b.x());
            
            // 重新设置anchors数组
            this.anchorManager.anchors = sortedAnchors;
            this.anchorManager.updateLine();
        }

        destroy() {
            try {
                // 安全地移除事件监听器
                if (this.stage && this.stage.off) {
                    this.stage.off('click');
                }
                if (this.mainLine && this.mainLine.off) {
                    this.mainLine.off('click');
                }
                if (this.group && this.group.off) {
                    this.group.off('click');
                    this.group.off('dblclick');
                }
            } catch (error) {
                console.warn('清理事件监听器时出错:', error);
            }
        }
    }

    // 创建事件处理器
    const eventHandler = new EventHandler(stage, layer, group, mainLine, anchorManager);


    // 添加组到图层
    layer.add(group);
    layer.draw();

    // 返回API对象
    return {
        group,
        timestamp,
        animationManager,
        anchorManager,
        eventHandler,
        // 便捷方法
        changeFlowSpeed: (speed) => animationManager.changeFlowSpeed(speed),
        stopAnimation: () => animationManager.stopAnimation(),
        startAnimation: () => animationManager.startAnimation(),
        isAnimationRunning: () => animationManager.isRunning(),
        // 清理方法
        destroy: () => {
            animationManager.stopAnimation();
            anchorManager.clearAnchors();
            eventHandler.destroy();
            group.destroy();
        }
    };
}
