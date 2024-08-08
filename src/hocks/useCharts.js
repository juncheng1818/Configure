import { echartsPieImageUrl } from '../echarts/pie.js';

// 定义一个自定义的 hook 函数
export function useCharts(x, y, width, height, callback) {
    const imageObj = new Image();
    imageObj.src = echartsPieImageUrl(x, y, width, height);

    imageObj.onload = function () {
        const pie = new Konva.Image({
            x: x || 50,
            y: y || 50,
            image: imageObj,
            width: width || 300,
            height: height || 300,
            draggable: true,
        });

        var charts = {
            pie: pie,
        };

        callback(charts); // 调用回调函数并传递charts对象
    };

    imageObj.onerror = function () {
        console.error('Failed to load image');
    };
}
