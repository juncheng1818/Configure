
**[English](README_EN.md), [中文](README.md).**

# 组态看板项目
### 自由拖动、组合，适用于工厂自定义看板或大屏
### JS框架：[Vite](https://vitejs.dev/) + [Vue3](https://vuejs.org/)
### UI框架：[Naive ui](https://www.naiveui.com/)
### 图形框架：[Konva](https://konvajs.org/) + [Echarts](https://echarts.apache.org/)

### 简要说明

为什么要用konva？
刚做的时候缩放功能是监听鼠标用重新渲染dom的宽高方法，后来发现组件卡顿，性能是个问题。于是网上找了这个框架。

echarts图表暂时想到的办法就是，先从konva添加一个矩形，根据矩形的X,Y从而添加相应的图表，拖拽和缩放也是监听矩形状态来更新图表
echarts可配置，文件在echarts--->options.js文件中
左侧列表图标渲染暂时用阿里矢量图的Symbol方法，在index.html可修改链接，配置在store.js中

### 更新日志
- 2024.07.26 初始项目，左侧列表渲染添加矩形
* 2024.07.29 添加主面板拖动组件，右击菜单属性功能修改组件css功能
+ 2024.07.30 添加组件删除功能，添加组件resize，rotate功能
- 2024.08.01 添加渲染圆形、椭圆
* 2024.08.09 完善常用图形、添加echarts饼图
+ 2024.08.14 完善和添加图形，线性、仪表、柱状图、饼图