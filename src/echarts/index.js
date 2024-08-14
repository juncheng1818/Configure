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

export function updateEChartsContainer(rect, echartsContainer, myChart) {
    const rectPos = rect.getAbsolutePosition();
    const rectRotation = rect.rotation();
    const rectScaleX = rect.scaleX();
    const rectScaleY = rect.scaleY();

    const relativeLeft = rectPos.x;
    const relativeTop = rectPos.y;

    echartsContainer.style.left = relativeLeft + 'px';
    echartsContainer.style.top = relativeTop + 'px';

    echartsContainer.style.width = rect.width() * rectScaleX + 'px';
    echartsContainer.style.height = rect.height() * rectScaleY + 'px';

    echartsContainer.style.transform = `rotate(${rectRotation}deg)`;
    echartsContainer.style.transformOrigin = 'top left';

    myChart.resize();

    const fontSize = Math.max(8, Math.min(rect.width() * rectScaleX / 20, rect.height() * rectScaleY / 20));
    myChart.setOption({
        series: [{
            label: {
                fontSize: fontSize
            }
        }]
    });
}