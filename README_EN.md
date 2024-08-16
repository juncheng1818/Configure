**Read this in other languages: [English](README_EN.md), [中文](README.md).**

# Configuration Dashboard Project
### Free dragging and combination, suitable for factory custom dashboards or large screens
### JS Framework：[Vite](https://vitejs.dev/) + [Vue3](https://vuejs.org/)
### UI Framework：[Naive ui](https://www.naiveui.com/)
### Graphics framework: [Konva](https://konvajs.org/) + [Echarts](https://echarts.apache.org/)

### description

Why use konva?
When I first made it, the zoom function was to monitor the mouse and use the width and height method of re-rendering the dom. Later I found that the component was stuck and performance was a problem. So I found this framework online.

The temporary way to think of the echarts chart is to first add a rectangle from konva, and then add the corresponding chart according to the X and Y of the rectangle. Dragging and zooming also monitor the status of the rectangle to update the chart.
echarts is configurable and the file is in the echarts--->options.js file
The left list icon rendering temporarily uses the Symbol method of Alibaba vector graphics. The link can be modified in index.html and configured in store.js.

### Changelog
- 2024.07.26 Initial project, added rectangle to render in the left list
* 2024.07.29 Added main panel drag component, right-click menu to modify component CSS properties
+ 2024.07.30 Added component delete function, added component resize and rotate function
- 2024.08.01 Added rendering circles and ellipses
* 2024.08.09 Improve common graphics and add echarts pie chart
+ 2024.08.14 Improve and add graphics, linear, gauge, bar chart, pie chart
- 2024.08.16 Add connecting line