import * as echarts from 'echarts';

export function echartsPieImageUrl(x, y, width, height) {
    // 创建一个新的div元素作为ECharts的容器
    const chartDiv = document.createElement('div');
    chartDiv.style.width = 200 + 'px';
    chartDiv.style.height = 200 + 'px';
    chartDiv.style.position = 'absolute';
    chartDiv.style.top = '0px';
    document.body.appendChild(chartDiv);

    // 初始化ECharts实例并生成饼图
    const myChart = echarts.init(chartDiv);

    const option = {
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: '搜索引擎' },
                    { value: 735, name: '直接访问' },
                    { value: 580, name: '邮件营销' },
                    { value: 484, name: '联盟广告' },
                    { value: 300, name: '视频广告' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用以上的配置项显示图表
    myChart.setOption(option);

    // 生成图表的图片数据 URL
    const imageURL = myChart.getDataURL({
        type: 'png',  // 图片格式：png, jpeg, svg
        pixelRatio: 2, // 图像的分辨率
        // backgroundColor: '#ddd' // 背景颜色
    });

    // 移除用于生成图表的div元素
    document.body.removeChild(chartDiv);

    return imageURL;

}
