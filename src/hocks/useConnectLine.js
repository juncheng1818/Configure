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

            anchor.on('dragend', (e) => {
                // 拖拽结束后，自动保存锚点位置
                this.saveAnchors();
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
            
            // 确保连线始终有有效的点
            if (points.length >= 4) {
                this.mainLine.points(points);
                this.animatedLine.points(points);
            } else if (points.length === 2) {
                // 如果只有一个锚点，创建一条短线段
                const x = points[0];
                const y = points[1];
                const shortLine = [x, y, x + 50, y];
                this.mainLine.points(shortLine);
                this.animatedLine.points(shortLine);
            } else {
                // 如果没有锚点，保持默认连线
                const defaultPoints = [0, 0, 50, 0, 100, 0, 150, 0, 200, 0];
                this.mainLine.points(defaultPoints);
                this.animatedLine.points(defaultPoints);
            }
        }

        saveAnchors() {
            this.savedAnchors = this.anchors.map(anchor => ({
                x: anchor.x(),
                y: anchor.y()
            }));
            console.log('保存锚点位置:', this.savedAnchors);
        }

        restoreAnchors() {
            console.log('恢复锚点位置:', this.savedAnchors);
            this.savedAnchors.forEach(pos => {
                this.addAnchor(pos.x, pos.y);
            });
            this.updateLine();
        }

        clearAnchors() {
            // 在清除锚点之前，先保存当前的连线形状
            const currentPoints = this.mainLine.points();
            this.anchors.forEach(anchor => anchor.destroy());
            this.anchors = [];
            // 保持当前的连线形状，不重置为默认状态
            this.mainLine.points(currentPoints);
            this.animatedLine.points(currentPoints);
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
                    // 只有在有锚点显示时才保存锚点位置
                    if (this.anchorManager.anchors.length > 0) {
                        this.anchorManager.saveAnchors();
                    }
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
                e.cancelBubble = true;
                
                // 获取当前锚点数量（包括恢复的锚点）
                const currentAnchors = this.group.find('.connect-line-anchor');
                console.log('双击连线，当前锚点数量:', currentAnchors.length);
                
                // 如果当前没有锚点，先恢复保存的锚点
                if (currentAnchors.length === 0) {
                    console.log('没有锚点，尝试恢复保存的锚点');
                    this.anchorManager.restoreAnchors();
                }
                
                // 确保至少有默认的锚点
                if (this.group.find('.connect-line-anchor').length === 0) {
                    console.log('恢复失败，初始化默认锚点');
                    this.anchorManager.initializeFromPoints([0, 0, 50, 0, 100, 0, 150, 0, 200, 0]);
                }
                
                const pos = this.group.getRelativePointerPosition();
                if (pos) {
                    console.log('添加新锚点位置:', pos.x, pos.y);
                    this.addAnchorAtPosition(pos.x, pos.y);
                    this.layer.draw();
                }
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

// 连线组件配置管理类
export class ConnectLineConfigManager {
    constructor(stage, layer) {
        this.stage = stage;
        this.layer = layer;
    }

    // 收集所有连线组件的配置数据
    collectConnectLineConfigs() {
        const connectLineData = {};
        const allGroups = this.stage.find('Group').filter(group => group && group.id());
        
        allGroups.forEach(group => {
            if (group.id() && group.id().includes('connect-line-group-')) {
                const customAttrs = group.getAttr('customAttrs') || {};
                const animationManager = group.getAnimation ? group.getAnimation() : null;
                let isRunning = false;
                
                if (animationManager && typeof animationManager.isRunning === 'function') {
                    isRunning = animationManager.isRunning();
                } else if (animationManager) {
                    const customAttrs = group.getAttr('customAttrs') || {};
                    isRunning = customAttrs.animation ? customAttrs.animation.isRunning() : false;
                }
                
                // 收集锚点位置信息（按连线顺序）
                const mainLine = group.findOne('.connect-line');
                const linePoints = mainLine ? mainLine.points() : [];
                const anchorPositions = [];
                
                // 将连线的点转换为锚点位置
                for (let i = 0; i < linePoints.length; i += 2) {
                    anchorPositions.push({
                        x: linePoints[i],
                        y: linePoints[i + 1]
                    });
                }
                
                console.log('保存连线配置:', {
                    groupId: group.id(),
                    anchorCount: anchorPositions.length,
                    linePoints: linePoints,
                    anchorPositions: anchorPositions
                });
                
                connectLineData[group.id()] = {
                    frameDuration: customAttrs.frameDuration || 22,
                    animationRunning: isRunning,
                    anchorPositions: anchorPositions,
                    linePoints: linePoints
                };
            }
        });
        
        return connectLineData;
    }

    // 暂停所有连线动画
    pauseAllAnimations() {
        const allGroups = this.stage.find('Group').filter(group => group && group.id());
        
        allGroups.forEach(group => {
            if (group.getAnimation && typeof group.getAnimation === 'function') {
                const animationManager = group.getAnimation();
                if (animationManager && animationManager.stopAnimation) {
                    animationManager.stopAnimation();
                }
            }
        });
    }

    // 恢复所有连线动画
    resumeAllAnimations() {
        const allGroups = this.stage.find('Group').filter(group => group && group.id());
        
        allGroups.forEach(group => {
            if (group.getAnimation && typeof group.getAnimation === 'function') {
                const animationManager = group.getAnimation();
                if (animationManager && animationManager.startAnimation) {
                    animationManager.startAnimation();
                }
            }
        });
    }

    // 恢复单个连线组件的动画状态
    restoreConnectLineAnimation(groupId, connectLineInfo) {
        const group = this.stage.findOne(`#${groupId}`);
        if (!group) {
            console.log('未找到Group:', groupId);
            return;
        }

        // 重新绑定事件监听器
        this._rebindEvents(group);

        // 恢复锚点位置（连线会根据锚点自动生成）
        if (connectLineInfo.anchorPositions && connectLineInfo.anchorPositions.length > 0) {
            this._restoreAnchors(group, connectLineInfo.anchorPositions);
        }

        // 获取动画管理器
        const animationManager = group.getAnimation ? group.getAnimation() : null;
        
        if (!animationManager) {
            console.log('动画管理器不存在，尝试重新创建');
            this._recreateAnimationManager(group, connectLineInfo);
            return;
        }

        // 设置动画参数
        const customAttrs = group.getAttr('customAttrs') || {};
        customAttrs.frameDuration = connectLineInfo.frameDuration || 22;
        group.setAttr('customAttrs', customAttrs);

        // 重新绑定getFrameDuration方法
        group.getFrameDuration = () => {
            const customAttrs = group.getAttr('customAttrs') || {};
            return customAttrs.frameDuration;
        };

        // 恢复动画状态
        if (connectLineInfo.animationRunning) {
            animationManager.startAnimation();
            console.log('启动动画');
        } else {
            animationManager.stopAnimation();
            console.log('停止动画');
        }
    }

    // 重新创建动画管理器（当从配置恢复时）
    _recreateAnimationManager(group, connectLineInfo) {
        const allLines = group.find('Line').filter(line => line && line.id());
        const animatedLine = allLines.find(line => 
            line.id() && line.id().includes('connect-line-animated-')
        );
        
        if (animatedLine) {
            console.log('找到动画线，重新创建动画管理器');
            
            // 设置动画参数
            const customAttrs = group.getAttr('customAttrs') || {};
            customAttrs.frameDuration = connectLineInfo.frameDuration || 22;
            group.setAttr('customAttrs', customAttrs);
            
            // 创建便捷方法对象（模拟useConnectLine.js返回的API）
            const connectLineAPI = {
                startAnimation: () => {
                    try {
                        const customAttrs = group.getAttr('customAttrs') || {};
                        
                        // 停止现有动画
                        if (customAttrs.animation) {
                            customAttrs.animation.stop();
                        }

                        // 检查必要的对象是否存在
                        if (!animatedLine || !this.layer) {
                            console.warn('动画对象不存在，跳过动画创建');
                            return;
                        }

                        // 创建新动画
                        customAttrs.animation = new Konva.Animation((frame) => {
                            if (animatedLine && frame) {
                                const dashOffset = -frame.time / customAttrs.frameDuration;
                                animatedLine.dashOffset(dashOffset);
                            }
                        }, this.layer);

                        customAttrs.animation.start();
                        group.setAttr('customAttrs', customAttrs);
                    } catch (error) {
                        console.warn('创建动画时出错:', error);
                    }
                },
                stopAnimation: () => {
                    try {
                        const customAttrs = group.getAttr('customAttrs') || {};
                        if (customAttrs.animation) {
                            customAttrs.animation.stop();
                            customAttrs.animation = null;
                            group.setAttr('customAttrs', customAttrs);
                        }
                    } catch (error) {
                        console.warn('停止动画时出错:', error);
                    }
                },
                isAnimationRunning: () => {
                    const customAttrs = group.getAttr('customAttrs') || {};
                    return customAttrs.animation ? customAttrs.animation.isRunning() : false;
                }
            };
            
            // 将便捷方法绑定到group
            group.getAnimation = () => connectLineAPI;
            
            // 重新绑定getFrameDuration方法
            group.getFrameDuration = () => {
                const customAttrs = group.getAttr('customAttrs') || {};
                return customAttrs.frameDuration;
            };
            
            // 恢复动画状态
            connectLineAPI.startAnimation();
            console.log('重新启动动画');
        }
    }

    // 批量恢复连线动画状态
    restoreAllConnectLineAnimations(connectLineData) {
        if (!connectLineData) return;
        
        Object.keys(connectLineData).forEach(groupId => {
            const connectLineInfo = connectLineData[groupId];
            console.log('恢复连线动画:', connectLineInfo);
            this.restoreConnectLineAnimation(groupId, connectLineInfo);
        });
    }

    // 恢复连线形状
    _restoreLineShape(group, linePoints) {
        console.log('恢复连线形状:', linePoints);
        
        const mainLine = group.findOne('.connect-line');
        const animatedLine = group.findOne('.connect-line-animated');
        
        if (mainLine && animatedLine && linePoints.length > 0) {
            mainLine.points(linePoints);
            animatedLine.points(linePoints);
            console.log('连线形状已恢复');
        }
    }

    // 恢复锚点位置
    _restoreAnchors(group, anchorPositions) {
        console.log('恢复锚点位置:', anchorPositions);
        
        // 清除现有锚点
        const existingAnchors = group.find('.connect-line-anchor');
        existingAnchors.forEach(anchor => anchor.destroy());
        
        // 获取连线和图层
        const mainLine = group.findOne('.connect-line');
        const animatedLine = group.findOne('.connect-line-animated');
        
        if (!mainLine || !animatedLine) {
            console.error('未找到连线元素');
            return;
        }
        
        // 创建新的锚点管理器（使用原始的AnchorManager逻辑）
        const timestamp = Date.now();
        const defaultConfig = {
            anchorRadius: 5,
            anchorFill: '#18a058'
        };
        
        const anchorManager = {
            anchors: [],
            mainLine: mainLine,
            animatedLine: animatedLine,
            layer: this.layer,
            config: defaultConfig,
            
            addAnchor: function(x, y) {
                const anchor = new Konva.Circle({
                    name: 'connect-line-anchor',
                    id: `connect-line-anchor-${timestamp}-${Date.now()}`,
                    x: x,
                    y: y,
                    radius: this.config.anchorRadius,
                    fill: this.config.anchorFill,
                    draggable: true,
                    listening: true,
                });

                group.add(anchor);

                // 绑定事件（使用原始的绑定方式）
                anchor.on('dragmove', (e) => {
                    this.updateLine();
                    e.cancelBubble = true;
                });

                anchor.on('dragend', (e) => {
                    this.saveAnchors();
                    e.cancelBubble = true;
                });

                anchor.on('dblclick', (e) => {
                    e.cancelBubble = true;
                    this.removeAnchor(anchor);
                });

                this.anchors.push(anchor);
                return anchor;
            },
            
            updateLine: function() {
                const points = [];
                this.anchors.forEach(anchor => {
                    points.push(anchor.x());
                    points.push(anchor.y());
                });
                
                console.log('更新连线，锚点数量:', this.anchors.length, '连线点:', points);
                
                // 确保连线始终有有效的点
                if (points.length >= 4) {
                    this.mainLine.points(points);
                    this.animatedLine.points(points);
                } else if (points.length === 2) {
                    // 如果只有一个锚点，创建一条短线段
                    const x = points[0];
                    const y = points[1];
                    const shortLine = [x, y, x + 50, y];
                    this.mainLine.points(shortLine);
                    this.animatedLine.points(shortLine);
                } else {
                    // 如果没有锚点，保持默认连线
                    const defaultPoints = [0, 0, 50, 0, 100, 0, 150, 0, 200, 0];
                    this.mainLine.points(defaultPoints);
                    this.animatedLine.points(defaultPoints);
                }
            },
            
            saveAnchors: function() {
                // 按照连线的实际顺序保存锚点位置
                const linePoints = this.mainLine.points();
                const anchorPositions = [];
                
                // 将连线的点转换为锚点位置
                for (let i = 0; i < linePoints.length; i += 2) {
                    anchorPositions.push({
                        x: linePoints[i],
                        y: linePoints[i + 1]
                    });
                }
                
                console.log('保存锚点位置（按连线顺序）:', anchorPositions);
                
                const customAttrs = group.getAttr('customAttrs') || {};
                customAttrs.savedAnchors = anchorPositions;
                group.setAttr('customAttrs', customAttrs);
            },
            
            removeAnchor: function(anchor) {
                this.anchors = this.anchors.filter(a => a !== anchor);
                anchor.destroy();
                this.updateLine();
                this.layer.draw();
            },
            
            clearAnchors: function() {
                this.anchors.forEach(anchor => anchor.destroy());
                this.anchors = [];
                const currentPoints = this.mainLine.points();
                this.mainLine.points(currentPoints);
                this.animatedLine.points(currentPoints);
            },
            
            restoreAnchors: function() {
                const customAttrs = group.getAttr('customAttrs') || {};
                const savedAnchors = customAttrs.savedAnchors || [];
                savedAnchors.forEach(pos => {
                    this.addAnchor(pos.x, pos.y);
                });
                this.updateLine();
            }
        };
        
        // 将锚点管理器绑定到组
        group.getAnchorManager = () => anchorManager;
        
        // 创建锚点（按保存时的顺序）
        anchorPositions.forEach((pos, index) => {
            console.log(`创建锚点 ${index}:`, pos.x, pos.y);
            anchorManager.addAnchor(pos.x, pos.y);
        });
        
        // 确保锚点按照连线的顺序排列
        anchorManager.anchors = anchorManager.anchors.sort((a, b) => {
            // 按照在anchorPositions中的顺序排序
            const indexA = anchorPositions.findIndex(pos => pos.x === a.x() && pos.y === a.y());
            const indexB = anchorPositions.findIndex(pos => pos.x === b.x() && pos.y === b.y());
            return indexA - indexB;
        });
        
        // 更新连线
        anchorManager.updateLine();
    }

    // 从锚点更新连线
    _updateLineFromAnchors(group) {
        // 获取锚点管理器
        const anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
        let anchors = [];
        
        if (anchorManager && anchorManager.anchors) {
            // 使用锚点管理器的锚点数组（保持原有顺序）
            anchors = anchorManager.anchors;
        } else {
            // 回退到查找锚点
            anchors = group.find('.connect-line-anchor');
        }
        
        // 保持锚点的原有顺序，不进行排序
        const points = [];
        anchors.forEach(anchor => {
            points.push(anchor.x());
            points.push(anchor.y());
        });
        
        console.log('更新连线，锚点数量:', anchors.length, '连线点:', points);
        
        const mainLine = group.findOne('.connect-line');
        const animatedLine = group.findOne('.connect-line-animated');
        
        if (mainLine && animatedLine) {
            if (points.length >= 4) {
                mainLine.points(points);
                animatedLine.points(points);
                console.log('连线已更新，points:', points);
            } else if (points.length === 2) {
                const x = points[0];
                const y = points[1];
                const shortLine = [x, y, x + 50, y];
                mainLine.points(shortLine);
                animatedLine.points(shortLine);
                console.log('短连线已更新');
            }
        } else {
            console.error('未找到连线元素:', { mainLine, animatedLine });
        }
    }

    // 保存锚点到组
    _saveAnchorsToGroup(group) {
        const anchors = group.find('.connect-line-anchor');
        const anchorPositions = anchors.map(anchor => ({
            x: anchor.x(),
            y: anchor.y()
        }));
        
        // 将锚点位置保存到组的自定义属性中
        const customAttrs = group.getAttr('customAttrs') || {};
        customAttrs.anchorPositions = anchorPositions;
        group.setAttr('customAttrs', customAttrs);
    }

    // 从组中移除锚点
    _removeAnchorFromGroup(group, anchor) {
        // 从锚点管理器中移除
        const anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
        if (anchorManager && anchorManager.anchors) {
            anchorManager.anchors = anchorManager.anchors.filter(a => a !== anchor);
        }
        
        anchor.destroy();
        this._updateLineFromAnchors(group);
        this._saveAnchorsToGroup(group);
    }

    // 重新绑定事件监听器
    _rebindEvents(group) {
        console.log('重新绑定连线组件事件');
        
        // 移除现有的事件监听器
        group.off('click');
        group.off('dblclick');
        
        // 获取主线
        const mainLine = group.findOne('.connect-line');
        if (mainLine) {
            mainLine.off('click');
        }
        
        // 重新绑定stage点击事件（用于隐藏锚点）
        this.stage.off('click');
        this.stage.on('click', (e) => {
            if (e.target === this.stage) {
                // 检查所有连线组件，隐藏它们的锚点
                const connectLineGroups = this.stage.find('.connect-line-group');
                connectLineGroups.forEach(connectGroup => {
                    const anchorManager = connectGroup.getAnchorManager ? connectGroup.getAnchorManager() : null;
                    if (anchorManager && anchorManager.anchors.length > 0) {
                        anchorManager.saveAnchors();
                        anchorManager.clearAnchors();
                    }
                });
                this.layer.draw();
            }
        });
        
        // 重新绑定组点击事件
        group.on('click', (e) => {
            e.cancelBubble = true;
        });

        // 重新绑定主线点击事件
        if (mainLine) {
            mainLine.on('click', (e) => {
                e.cancelBubble = true;
                const currentAnchors = group.find('.connect-line-anchor');
                console.log('点击连线，当前锚点数量:', currentAnchors.length);
                if (currentAnchors.length === 0) {
                    // 获取或创建锚点管理器
                    let anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
                    if (!anchorManager) {
                        anchorManager = this._createAnchorManager(group);
                    }
                    anchorManager.restoreAnchors();
                    this.layer.draw();
                }
            });
        }

        // 重新绑定双击事件
        group.on('dblclick', (e) => {
            e.cancelBubble = true;
            
            // 获取当前锚点数量（包括恢复的锚点）
            const currentAnchors = group.find('.connect-line-anchor');
            console.log('双击连线，当前锚点数量:', currentAnchors.length);
            
            // 如果当前没有锚点，先恢复保存的锚点
            if (currentAnchors.length === 0) {
                console.log('没有锚点，尝试恢复保存的锚点');
                let anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
                if (!anchorManager) {
                    anchorManager = this._createAnchorManager(group);
                }
                anchorManager.restoreAnchors();
            }
            
            // 确保至少有默认的锚点
            if (group.find('.connect-line-anchor').length === 0) {
                console.log('恢复失败，初始化默认锚点');
                let anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
                if (!anchorManager) {
                    anchorManager = this._createAnchorManager(group);
                }
                anchorManager.initializeFromPoints([0, 0, 50, 0, 100, 0, 150, 0, 200, 0]);
            }
            
            const pos = group.getRelativePointerPosition();
            if (pos) {
                console.log('添加新锚点位置:', pos.x, pos.y);
                this._addAnchorAtPosition(group, pos.x, pos.y);
                this.layer.draw();
            }
        });
    }

    // 创建锚点管理器
    _createAnchorManager(group) {
        const self = this; // 保存this引用
        const anchorManager = {
            anchors: [],
            addAnchor: (x, y) => {
                const anchor = new Konva.Circle({
                    name: 'connect-line-anchor',
                    id: `connect-line-anchor-${Date.now()}-${Math.random()}`,
                    x: x,
                    y: y,
                    radius: 5,
                    fill: '#18a058',
                    draggable: true,
                    listening: true,
                });
                group.add(anchor);
                anchorManager.anchors.push(anchor);
                
                // 绑定锚点事件
                anchor.on('dragmove', (e) => {
                    console.log('锚点拖拽中，更新连线（新创建）');
                    self._updateLineFromAnchors(group);
                    e.cancelBubble = true;
                });

                anchor.on('dragend', (e) => {
                    self._saveAnchorsToGroup(group);
                    e.cancelBubble = true;
                });

                anchor.on('dblclick', (e) => {
                    e.cancelBubble = true;
                    self._removeAnchorFromGroup(group, anchor);
                });
                
                return anchor;
            },
            updateLine: () => self._updateLineFromAnchors(group),
            restoreAnchors: () => {
                const customAttrs = group.getAttr('customAttrs') || {};
                const savedAnchors = customAttrs.savedAnchors || [];
                savedAnchors.forEach(pos => {
                    anchorManager.addAnchor(pos.x, pos.y);
                });
                anchorManager.updateLine();
            },
            saveAnchors: () => {
                const anchorPositions = anchorManager.anchors.map(anchor => ({
                    x: anchor.x(),
                    y: anchor.y()
                }));
                const customAttrs = group.getAttr('customAttrs') || {};
                customAttrs.savedAnchors = anchorPositions;
                group.setAttr('customAttrs', customAttrs);
            },
            clearAnchors: () => {
                anchorManager.anchors.forEach(anchor => anchor.destroy());
                anchorManager.anchors = [];
                const currentPoints = group.findOne('.connect-line').points();
                group.findOne('.connect-line').points(currentPoints);
                group.findOne('.connect-line-animated').points(currentPoints);
            },
            initializeFromPoints: (points) => {
                for (let i = 0; i < points.length; i += 2) {
                    anchorManager.addAnchor(points[i], points[i + 1]);
                }
            }
        };
        
        group.getAnchorManager = () => anchorManager;
        return anchorManager;
    }

    // 添加锚点到指定位置
    _addAnchorAtPosition(group, x, y) {
        let anchorManager = group.getAnchorManager ? group.getAnchorManager() : null;
        if (!anchorManager) {
            anchorManager = this._createAnchorManager(group);
        }
        
        // 获取当前连线的点
        const mainLine = group.findOne('.connect-line');
        const currentPoints = mainLine ? mainLine.points() : [];
        
        // 找到插入位置（基于距离连线的最近点）
        let insertIndex = currentPoints.length; // 默认插入到末尾
        let minDistance = Infinity;
        
        // 遍历连线的每个线段，找到距离新点最近的线段
        for (let i = 0; i < currentPoints.length - 2; i += 2) {
            const x1 = currentPoints[i];
            const y1 = currentPoints[i + 1];
            const x2 = currentPoints[i + 2];
            const y2 = currentPoints[i + 3];
            
            // 计算点到线段的距离
            const distance = this._pointToLineDistance(x, y, x1, y1, x2, y2);
            
            if (distance < minDistance) {
                minDistance = distance;
                // 插入到当前线段的结束位置
                insertIndex = i + 2;
            }
        }
        
        // 插入新点到连线中
        const newPoints = [...currentPoints];
        newPoints.splice(insertIndex, 0, x, y);
        
        // 更新连线
        const animatedLine = group.findOne('.connect-line-animated');
        if (mainLine && animatedLine) {
            mainLine.points(newPoints);
            animatedLine.points(newPoints);
        }
        
        // 创建新锚点
        const newAnchor = anchorManager.addAnchor(x, y);
        
        // 将新锚点插入到适当位置（按照在连线中的位置）
        const anchors = anchorManager.anchors;
        const newAnchors = [];
        
        // 按照连线点的顺序重新排列锚点
        for (let i = 0; i < newPoints.length; i += 2) {
            const pointX = newPoints[i];
            const pointY = newPoints[i + 1];
            
            // 找到对应的锚点
            const correspondingAnchor = anchors.find(anchor => 
                Math.abs(anchor.x() - pointX) < 1 && Math.abs(anchor.y() - pointY) < 1
            );
            
            if (correspondingAnchor) {
                newAnchors.push(correspondingAnchor);
            }
        }
        
        // 重新设置anchors数组（按照连线顺序）
        anchorManager.anchors = newAnchors;
        
        console.log('添加锚点成功，新连线形状:', newPoints);
    }

    // 计算点到线段的距离
    _pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            // 线段退化为点
            return Math.sqrt(A * A + B * B);
        }
        
        let param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
}