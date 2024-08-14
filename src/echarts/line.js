import * as echarts from 'echarts';

export function createKonvaWithECharts(layer) {
    // 创建一个HTML div元素
    const chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.width = '400px';
    chartContainer.style.height = '300px';
    document.body.appendChild(chartContainer);

    const group = new Konva.Group({
        x: 50,
        y: 50
    });
    layer.add(group);

    const chart = echarts.init(chartContainer);
    chart.setOption({
        tooltip: {
            trigger: 'item'
        },
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
            }
        ]
    });

    layer.batchDraw();

    // 更新HTML元素位置的函数
    function updateChartPosition() {
        const transform = group.getAbsoluteTransform();
        const pos = transform.point({ x: 0, y: 0 });

        chartContainer.style.left = pos.x + 'px';
        chartContainer.style.top = pos.y + 'px';
    }

    // 初始更新位置
    updateChartPosition();

    // 监听Konva事件
    group.on('dragmove', updateChartPosition);

    group.draggable(true)
}

