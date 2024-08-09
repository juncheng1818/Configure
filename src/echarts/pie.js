import * as echarts from 'echarts';

export function echartsPieImageUrl() {
    return new Promise((resolve, reject) => {
        try {
            // 创建一个新的div元素作为ECharts的容器
            const chartDiv = document.createElement('div');
            chartDiv.style.width = 200 + 'px';
            chartDiv.style.height = 200 + 'px';
            chartDiv.style.display = 'none';
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
                    }
                ]
            };

            // 使用以上的配置项显示图表
            myChart.setOption(option);

            // 当图表渲染完成时触发
            myChart.on('finished', function () {
                // 生成图表的图片数据 URL
                const imageURL = myChart.getDataURL({
                    type: 'png',  // 图片格式：png, jpeg, svg
                    pixelRatio: 2, // 图像的分辨率
                    backgroundColor: '#fff' // 背景颜色
                });

                // 创建Image对象并设置src
                const imageObj = new Image();
                imageObj.src = imageURL;

                // 图片加载完毕后解析Promise并返回Image对象
                imageObj.onload = function() {
                    // 移除用于生成图表的div元素
                    // document.body.removeChild(chartDiv);
                    resolve({imageObj,chartDiv,myChart});
                };
            });

        } catch (error) {
            reject(error);
        }
    });
}
