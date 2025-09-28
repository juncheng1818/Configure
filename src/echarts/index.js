import * as echarts from 'echarts';
import { pieOptions,lineOptions,barOptions ,gaugeOptions} from './options.js';

export function createEChartsContainer(dashboard,timestamp) {

    const echartsContainer = document.createElement('div');
    //添加id
    echartsContainer.id = `echarts-container-${timestamp}`;
    echartsContainer.style.position = 'absolute';
    echartsContainer.style.pointerEvents = 'none'; // Allow click-through
    dashboard.appendChild(echartsContainer);

    const myChart = echarts.init(echartsContainer);
    return { echartsContainer, myChart };
}

export function setEChartsOptions(myChart,chartType) {
    if(chartType === 'pie'){
        myChart.setOption(pieOptions);
    }else if(chartType === 'line'){
        myChart.setOption(lineOptions);
    }else if(chartType === 'bar'){
        myChart.setOption(barOptions);
    }else if(chartType === 'gauge'){
        myChart.setOption(gaugeOptions);
    }else{
        myChart.setOption(pieOptions);
    }

}

export function updateEChartsContainer(rect, echartsContainer, myChart, stage = null) {
    // 获取rect的基本属性
    const rectWidth = rect.width();
    const rectHeight = rect.height();
    const rectRotation = rect.rotation();
    const rectScaleX = rect.scaleX();
    const rectScaleY = rect.scaleY();

    let finalX = 0;
    let finalY = 0;
    let finalWidth = rectWidth * rectScaleX;
    let finalHeight = rectHeight * rectScaleY;
    let totalRotation = rectRotation;

    // 如果提供了Stage，需要考虑Stage的变换
    if (stage) {
        const stagePos = stage.position();
        const stageScale = stage.scaleX();
        const stageRotation = stage.rotation();

        // 获取rect在Stage中的位置（相对于Stage的坐标）
        const rectX = rect.x();
        const rectY = rect.y();

        // 计算最终位置（Stage位置 + rect在Stage中的位置 * Stage缩放）
        finalX = stagePos.x + rectX * stageScale;
        finalY = stagePos.y + rectY * stageScale;

        // 计算最终大小（rect大小 * rect缩放 * Stage缩放）
        finalWidth = rectWidth * rectScaleX * stageScale;
        finalHeight = rectHeight * rectScaleY * stageScale;

        // 计算总旋转（rect旋转 + Stage旋转）
        totalRotation = rectRotation + stageRotation;
    } else {
        // 如果没有Stage，使用rect的绝对位置
        const rectAbsolutePos = rect.getAbsolutePosition();
        finalX = rectAbsolutePos.x;
        finalY = rectAbsolutePos.y;
    }

    // 应用变换到ECharts容器
    echartsContainer.style.position = 'absolute';
    echartsContainer.style.left = finalX + 'px';
    echartsContainer.style.top = finalY + 'px';
    echartsContainer.style.width = finalWidth + 'px';
    echartsContainer.style.height = finalHeight + 'px';
    echartsContainer.style.transform = `rotate(${totalRotation}deg)`;
    echartsContainer.style.transformOrigin = 'top left';
    echartsContainer.style.pointerEvents = 'none';
    echartsContainer.style.zIndex = '10';

    // 重新调整ECharts大小
    myChart.resize();

    // 根据容器大小调整字体大小
    const fontSize = Math.max(8, Math.min(finalWidth / 20, finalHeight / 20));
    myChart.setOption({
        series: [{
            label: {
                fontSize: fontSize
            }
        }]
    });
}