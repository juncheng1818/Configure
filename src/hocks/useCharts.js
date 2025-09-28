import { createEChartsContainer, setEChartsOptions, updateEChartsContainer } from '../echarts/index.js';
// 定义一个自定义的 hook 函数
export function useCharts(x, y, width, height, chartType, stage = null, layer = null) {
    let timestamp = Date.now();
    let rectHeight, rectWidth;
    
    if(chartType === 'pie'){
        rectHeight = 160;
        rectWidth = 160;
    }else if(chartType === 'line'){
        rectHeight = 180;
        rectWidth = 300;
    }else if(chartType === 'bar'){
        rectHeight = 180;
        rectWidth = 300;
    }else if(chartType === 'gauge'){
        rectHeight = 180;
        rectWidth = 180;
    }else{
        rectHeight = 180;
        rectWidth = 180;
    }
    
    // 创建Konva矩形作为ECharts的容器
    const rect = new Konva.Rect({
        name: 'echarts-rect',
        id: `echarts-rect-${timestamp}`,
        x: x,
        y: y,
        width: rectWidth,
        height: rectHeight,
        stroke: 'transparent',
        strokeWidth: 0,
        draggable: true,
        dragBoundFunc: function (pos) {
            return pos;
        },
    });

    // 创建ECharts容器
    const dashboard = document.getElementById('dashboard');
    const { echartsContainer, myChart } = createEChartsContainer(dashboard, timestamp);

    // 设置ECharts容器的初始位置和大小
    echartsContainer.style.left = x + 'px';
    echartsContainer.style.top = y + 'px';
    echartsContainer.style.width = rectWidth + 'px';
    echartsContainer.style.height = rectHeight + 'px';
    echartsContainer.style.position = 'absolute';
    echartsContainer.style.pointerEvents = 'none'; // 不允许直接交互，通过Konva控制
    echartsContainer.style.zIndex = '10';

    // 初始化ECharts
    setEChartsOptions(myChart, chartType);
    myChart.resize();

    // 创建Transformer用于控制点
    const transformer = new Konva.Transformer({
        id: `transformer-${timestamp}`,
        nodes: [rect],
        enabledAnchors: ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'],
        boundBoxFunc: (oldBox, newBox) => {
            // 限制最小大小
            if (newBox.width < 100 || newBox.height < 100) {
                return oldBox;
            }
            return newBox;
        }
    });

    // 添加rect到layer
    if (layer) {
        layer.add(rect);
        layer.add(transformer);
        layer.draw();
    }

    // 更新ECharts容器位置的函数
    const updatePosition = () => {
        // 使用echarts/index.js中的updateEChartsContainer函数
        updateEChartsContainer(rect, echartsContainer, myChart, stage);
    };

    // 监听rect的变换事件（当rect自身被拖拽或变换时）
    rect.on('dragmove', updatePosition);
    rect.on('transform', updatePosition);

    // 监听Stage变换事件（当Stage被滚动、缩放、拖拽时）
    if (stage) {
        // 监听Stage的变换事件
        stage.on('wheel', updatePosition);
        stage.on('mousedown', updatePosition);
        stage.on('mousemove', updatePosition);
        stage.on('mouseup', updatePosition);
        
        // 监听Stage的位置和缩放变化
        stage.on('dragmove', updatePosition);
        stage.on('transform', updatePosition);
        
        // 监听Stage的拖拽事件
        stage.on('dragstart', updatePosition);
        stage.on('dragend', updatePosition);
    }

    return {
        charts: {
            rect: rect,
            transformer: transformer,
            echartsContainer: echartsContainer,
            myChart: myChart,
            timestamp: timestamp,
            updatePosition: updatePosition
        }
    };
}
