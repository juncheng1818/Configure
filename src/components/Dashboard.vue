<template>
    <div id="dashboard" @mousedown="addComponent" ref="dashboard_ref">
    </div>
    <contextMenu @update-css="_updateCss" @delete-component="_deleteComponent" ref="contextMenu_ref" />
    
    <!-- 缩放控制面板 -->
    <div class="zoom-controls">
        <div class="zoom-info">
            <span>{{ currentScale }}%</span>
        </div>
        <div class="zoom-buttons">
            <button @click="zoomIn" title="放大 (Ctrl+滚轮)">+</button>
            <button @click="zoomOut" title="缩小 (Ctrl+滚轮)">-</button>
            <button @click="resetZoom" title="重置缩放和位置">⌂</button>
        </div>
    </div>
</template>

<script setup lang="js">
import * as echarts from 'echarts';
import { ref, shallowRef, reactive, onMounted, nextTick, onUnmounted } from 'vue'

import contextMenu from './ContextMenu.vue'
const contextMenu_ref = ref(null)

import { useMessage, NSpin } from 'naive-ui'
const message = useMessage()

import { iconChoiceStore, leftIconListStore } from '../store'
const iconChoice = iconChoiceStore()
const leftIconList = leftIconListStore()

const dashboard_ref = ref(null)

import { dashboardComponentStore } from '../store'
const dashboardComponent = dashboardComponentStore()

var stage = null
var layer = null
const dashboardRect = ref(null)

import { useGraphics } from '../hocks/useGraphics.js'
import { useCharts } from '../hocks/useCharts.js'
import { useConnectLine } from '../hocks/useConnectLine.js'
import { useClock } from '../hocks/useClock.js'
import { useHeatingSystem } from '../hocks/useHeatingSystem.js'
import { updateEChartsContainer } from '../echarts/index.js'

const selectId = ref(null)

import emitter from '../mitt';

const showSpin = ref(false)

// Dashboard交互相关变量
const dashboardScale = ref(1)
const dashboardPosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const lastPointerPosition = ref({ x: 0, y: 0 })
const currentScale = ref(100) // 当前缩放比例，用于响应式显示

// 缩放相关常量
const scaleBy = 1.1
const minScale = 0.1
const maxScale = 5

// 滚轮处理函数
const handleWheel = (e) => {
    e.evt.preventDefault()
    
    // 检查是否按住Ctrl键
    if (e.evt.ctrlKey) {
        // Ctrl + 滚轮：缩放
        handleZoom(e)
    } else {
        // 单独滚轮：上下移动
        handleScroll(e)
    }
}

// 缩放处理函数
const handleZoom = (e) => {
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    }
    
    const direction = e.evt.deltaY > 0 ? -1 : 1
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy
    
    // 限制缩放范围
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale))
    
    stage.scale({ x: clampedScale, y: clampedScale })
    
    const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
    }
    
    stage.position(newPos)
    stage.batchDraw()
    
    // 更新响应式缩放比例
    currentScale.value = Math.round(clampedScale * 100)
    
    // 更新所有ECharts容器的位置和缩放
    updateAllEChartsPositions()
}

// 滚动处理函数
const handleScroll = (e) => {
    const scrollSpeed = 50 // 滚动速度
    const deltaY = e.evt.deltaY
    
    // 计算新的位置
    const newY = stage.y() + deltaY * scrollSpeed / 100
    
    stage.position({
        x: stage.x(),
        y: newY
    })
    
    stage.batchDraw()
    
    // 更新所有ECharts容器的位置
    updateAllEChartsPositions()
}

// 拖拽移动处理函数
const handleMouseDown = (e) => {
    // 只有在点击空白区域且没有选择组件时才允许拖拽
    if (e.target === stage && !iconChoice.getIconName()) {
        isDragging.value = true
        lastPointerPosition.value = stage.getPointerPosition()
        stage.container().style.cursor = 'grabbing'
    }
}

const handleMouseMove = (e) => {
    if (!isDragging.value) return
    
    e.evt.preventDefault()
    const pos = stage.getPointerPosition()
    const dx = pos.x - lastPointerPosition.value.x
    const dy = pos.y - lastPointerPosition.value.y
    
    stage.position({
        x: stage.x() + dx,
        y: stage.y() + dy
    })
    
    lastPointerPosition.value = pos
    stage.batchDraw()
    
    // 更新所有ECharts容器的位置
    updateAllEChartsPositions()
}

const handleMouseUp = (e) => {
    if (isDragging.value) {
        isDragging.value = false
        stage.container().style.cursor = 'grab'
    }
}

// 存储所有创建的图表实例
const chartInstances = ref([])

// 更新所有ECharts容器的位置
const updateAllEChartsPositions = () => {
    if (!stage) return
    
    // 调用所有图表实例的updatePosition方法
    // 这样确保使用统一的更新机制
    chartInstances.value.forEach(chartInstance => {
        if (chartInstance && chartInstance.updatePosition) {
            chartInstance.updatePosition()
        }
    })
}

// 缩放控制函数
const zoomIn = () => {
    const oldScale = stage.scaleX()
    const newScale = Math.min(maxScale, oldScale * scaleBy)
    stage.scale({ x: newScale, y: newScale })
    stage.batchDraw()
    
    // 更新响应式缩放比例
    currentScale.value = Math.round(newScale * 100)
    
    // 更新所有ECharts容器的位置和缩放
    updateAllEChartsPositions()
}

const zoomOut = () => {
    const oldScale = stage.scaleX()
    const newScale = Math.max(minScale, oldScale / scaleBy)
    stage.scale({ x: newScale, y: newScale })
    stage.batchDraw()
    
    // 更新响应式缩放比例
    currentScale.value = Math.round(newScale * 100)
    
    // 更新所有ECharts容器的位置和缩放
    updateAllEChartsPositions()
}

const resetZoom = () => {
    stage.scale({ x: 1, y: 1 })
    stage.position({ x: 0, y: 0 })
    stage.batchDraw()
    
    // 更新响应式缩放比例
    currentScale.value = 100
    
    // 更新所有ECharts容器的位置和缩放
    updateAllEChartsPositions()
}

onUnmounted(() => {
    emitter.off('save')
    emitter.off('upload')
    emitter.off('preview')
    emitter.off('changeWidthAndHeight')
    
    // 清理事件监听器
    if (stage) {
        stage.off('wheel', handleWheel)
        stage.off('mousedown touchstart', handleMouseDown)
        stage.off('mousemove touchmove', handleMouseMove)
        stage.off('mouseup touchend', handleMouseUp)
    }
})

onMounted(() => {
    iconChoice.clearIconName()
    leftIconList.clearIconFalse()
    nextTick(async () => {
        dashboardRect.value = dashboard_ref.value.getBoundingClientRect();
        stage = new Konva.Stage({
            container: 'dashboard',
            width: dashboardRect.value.width,
            height: dashboardRect.value.height
        });

        layer = new Konva.Layer();
        stage.add(layer);

        //右击点击事件
        stage.on('contextmenu', function (e) {
            e.evt.preventDefault()
            if (e.target !== stage) {//不是点击舞台
                selectId.value = e.target.attrs.id
                // var selectNode = stage.findOne(`#${selectId.value}`)
                // var css = selectNode.getAttrs()
                if (selectId.value.includes('connect-line-anchor')) {
                    return
                }
                contextMenu_ref.value.showMenu(e.evt.clientX, e.evt.clientY, stage, selectId.value, layer)
            }
        })

        // 滚轮缩放事件
        stage.on('wheel', handleWheel)
        
        // 拖拽移动事件
        stage.on('mousedown touchstart', handleMouseDown)
        stage.on('mousemove touchmove', handleMouseMove)
        stage.on('mouseup touchend', handleMouseUp)

    })

    emitter.on('save', (event) => {
    })

    emitter.on('preview', (event) => {
    })

    emitter.on('changeWidthAndHeight', (event) => {
    })
})

//更新css
function _updateCss(css) {
    var selectNode = stage.findOne(`#${selectId.value}`)
    if (selectId.value.includes('connect-line')) {
        let timestamp = selectId.value.split('-')[2]
        let group = stage.findOne(`#connect-line-group-${timestamp}`)
        let mainLine = stage.findOne(`#connect-line-${timestamp}`)
        let animatedLine = stage.findOne(`#connect-line-animated-${timestamp}`)
        let anchor = stage.findOne(`#connect-line-anchor-${timestamp}`)

        group.setAttrs({ x: Number(css.x), y: Number(css.y) })
        mainLine.setAttrs({ stroke: css['mainLine-stroke'], strokeWidth: css['mainLine-strokeWidth'] })
        animatedLine.setAttrs({ stroke: css['animatedLine-stroke'], strokeWidth: css['animatedLine-strokeWidth'] })
        anchor.setAttrs({ fill: css['anchor-fill'] })

        let animation = group.getAnimation();

        if (animation) {
            group.changeFlowSpeed(Number(css['FlowSpeed']));
            animation.stop();
            animation.start();
        }

    } else {
        selectNode.setAttrs({...css})
        layer.draw();
    }

}

function _deleteComponent() {
    //删除组件同时删除transformer
    var selectNode = stage.findOne(`#${selectId.value}`)
    stage.find('Transformer').forEach(tr => tr.destroy());
    selectNode.destroy();
    layer.draw();

    // echarts删除
    let e = document.getElementById(`echarts-container-${selectNode.getAttr('id').split('-')[2]}`)
    if (e) {
        echarts.dispose(e)
        //删除dom
        e.remove()
    }

    // 删除连接线,先确定是不是连接线
    if (selectId.value.includes('connect-line')) {
        let connectLineId = selectId.value.split('-')[2]
        stage.findOne(`#connect-line-group-${connectLineId}`).destroy()
        layer.draw();
    }

    selectId.value = null
}

const addComponent = async (event) => {
    // 如果正在拖拽，不添加组件
    if (isDragging.value) return
    
    let iconName = iconChoice.getIconName()
    let iconTitle = iconChoice.getIconTitle()
    if (iconName) {
        showSpin.value = true
        
        // 计算相对于stage的坐标
        const stagePos = stage.getPointerPosition()
        const x = stagePos.x
        const y = stagePos.y

        if (iconTitle === '常用') {
            const { graphics } = useGraphics(x, y, dashboardRect.value.width, dashboardRect.value.height)
            layer.add(graphics[iconName]);
            layer.draw();
        }

        if (iconTitle === '图表') {
            const { charts } = useCharts(x, y, dashboardRect.value.width, dashboardRect.value.height, iconName, stage, layer)
            // 存储图表实例以便后续更新位置
            chartInstances.value.push(charts)
        }

        if (iconTitle === '连线') {
            useConnectLine(x, y, dashboardRect.value.width, dashboardRect.value.height, layer, stage)
        }

        if (iconTitle === '时间') {
            const { clock } = useClock(x, y, dashboardRect.value.width, dashboardRect.value.height, layer, stage)
            layer.add(clock[iconName]);
            setInterval(clock[iconName].updateClock.bind(clock[iconName]), 1000)
            layer.draw();
        }

        if(iconTitle === '采暖系统'){
            const { customImage } = useHeatingSystem(x, y, dashboardRect.value.width, dashboardRect.value.height, layer, stage, iconName)
            layer.add(customImage);
            layer.draw();
        }

        // 监听舞台点击事件，处理 Transformer
        stage.on('click tap', function (e) {
            e.evt.preventDefault();
            // 如果点击空白区域，移除所有 Transformer
            if (e.target === stage) {
                stage.find('Transformer').forEach(tr => tr.destroy());
                layer.draw();
                return;
            }

            // 移除旧的 Transformer
            if (stage.find('Transformer').length > 0) {
                stage.find('Transformer').forEach(tr => tr.destroy());
            }

            // 创建新的 Transformer
            const tr = new Konva.Transformer();
            layer.add(tr);
            tr.nodes([e.target]);
            layer.draw();
        });

        iconChoice.clearIconName()
        leftIconList.clearIconFalse()

        showSpin.value = false
        message.success('组件添加成功')
    } else {
        // message.warning('请选择组件')
    }
}

</script>

<style scoped lang="scss">
#dashboard {
    flex-grow: 1;
    overflow: auto; /* 出现滚动条 */
    box-sizing: border-box;
    background-color: #f0f0f0;
    background-image:
        linear-gradient(#e5e5e5 1px, transparent 1px),
        linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
    background-size: 20px 20px;
    position: relative;
    cursor: grab;
}

#dashboard:active {
    cursor: grabbing;
}

/* 自定义滚动条样式 */
#dashboard::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

#dashboard::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

#dashboard::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

#dashboard::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 缩放控制面板样式 */
.zoom-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
}

.zoom-info {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 50px;
    text-align: center;
}

.zoom-buttons {
    display: flex;
    gap: 5px;
}

.zoom-buttons button {
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.zoom-buttons button:hover {
    background: #f0f0f0;
    border-color: #999;
}

.zoom-buttons button:active {
    background: #e0e0e0;
}

</style>