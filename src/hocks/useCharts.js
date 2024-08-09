import { echartsPieImageUrl } from '../echarts/pie.js';

// 定义一个自定义的 hook 函数
export async function useCharts(x, y, width, height) {

    const { imageObj, chartDiv, myChart } = await echartsPieImageUrl();
    const pie = new Konva.Image({
        x: x,
        y: y,
        image: imageObj,
        width: width,
        height: height,
        draggable: true,
    });
    var charts = {
        'pie': { pie, chartDiv, myChart ,imageObj},
    };
    return {
        charts
    };
}
