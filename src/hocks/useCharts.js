import { createEChartsContainer, setEChartsOptions, updateEChartsContainer } from '../echarts/index.js';
// 定义一个自定义的 hook 函数
export function useCharts(x, y, width, height,chartType) {
    let timestamp = Date.now();
    let rectHeight,rectWidth;
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
    
    var rect = new Konva.Rect({
        name: 'rect-pie',
        id: `rect-pie-${timestamp}`,
        x: x,
        y: y,
        width: rectWidth,
        height: rectHeight,
        fill: '#ffffff',
        draggable: true,
        dragBoundFunc: function (pos) {
            const newWidth = rect.width() * rect.scaleX();
            const newHeight = rect.height() * rect.scaleY();

            var newX = pos.x <= 0 ? 0 : pos.x;
            var newY = pos.y <= 0 ? 0 : pos.y;

            if (newX + newWidth > width) {
                newX = width - newWidth;
            }

            if (newY + newHeight > height) {
                newY = height - newHeight;
            }

            return {
                x: newX,
                y: newY
            }
        },
    });

    //查找面板
    const dashboard = document.getElementById('dashboard');
    const { echartsContainer, myChart } = createEChartsContainer(dashboard,timestamp);

    setEChartsOptions(myChart,chartType);

    rect.on('dragmove', () => updateEChartsContainer(rect, echartsContainer, myChart));
    rect.on('transform', () => updateEChartsContainer(rect, echartsContainer, myChart));

    updateEChartsContainer(rect, echartsContainer, myChart);

    return {
        charts: {
            rect: rect,
            echartsContainer: echartsContainer,
            myChart: myChart
        }
    };
}
