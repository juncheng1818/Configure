<template>
    <div id="dashboard" @mousedown="addComponent" ref="dashboard_ref">
        <!-- <component v-for="item in dashboardComponent.getComponentList()" :is="item.componentName" :transform="item.transform" :resizable="item.resizable" :id="item.id" :top="item.top" :left="item.left" ref="component_ref"></component> -->
    </div>
    <contextMenu @update-css="_updateCss" @delete-component="_deleteComponent" ref="contextMenu_ref" />
</template>

<script setup lang="js">

import { ref, shallowRef, reactive, onMounted, nextTick, onUnmounted } from 'vue'

import contextMenu from './ContextMenu.vue'
const contextMenu_ref = ref(null)

import { useMessage } from 'naive-ui'
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

const selectId = ref(null)

import emitter from '../mitt';

onUnmounted(() => {
    emitter.off('save')
})

onMounted(() => {
    iconChoice.clearIconName()
    leftIconList.clearIconFalse()
    nextTick(() => {
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
                var selectNode = stage.findOne(`#${selectId.value}`)
                var css = selectNode.getAttrs()
                contextMenu_ref.value.showMenu(e.evt.clientX, e.evt.clientY, css)
            }
        })

        useCharts(100, 100, 400, 400, (charts) => {
            console.log(charts.pie)
            layer.add(charts.pie);
            layer.batchDraw(); // 绘制图层
        });
    })


    emitter.on('save', (event) => {
        console.log('save')
        console.log(stage.toObject())
    })


})

//更新css
function _updateCss(css) {
    var selectNode = stage.findOne(`#${selectId.value}`)
    //改变背景色
    // selectNode.setAttrs(
    //     {
    //         x: parseInt(css.x),
    //         y: parseInt(css.y),
    //         width: parseInt(css.width),
    //         height: parseInt(css.height),
    //         fill: css.fill,
    //         zIndex: parseInt(css.zIndex),
    //         stroke: css.stroke,
    //         strokeWidth: parseInt(css.strokeWidth),
    //         cornerRadius: parseInt(css.cornerRadius),
    //     }
    // )

    selectNode.setAttrs({ ...css })

}

function _deleteComponent() {
    //删除组件同时删除transformer
    var selectNode = stage.findOne(`#${selectId.value}`)
    stage.find('Transformer').forEach(tr => tr.destroy());
    selectNode.destroy();
    layer.draw();
    selectId.value = null
}

const addComponent = (event) => {
    let iconName = iconChoice.getIconName()
    if (iconName) {
        const x = event.clientX - dashboardRect.value.left;
        const y = event.clientY - dashboardRect.value.top;

        const { graphics } = useGraphics(x, y, dashboardRect.value.width, dashboardRect.value.height)

        layer.add(graphics[iconName]);
        layer.draw();

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
        message.success('组件添加成功')
    } else {
        // message.warning('请选择组件')
    }
}

</script>

<style scoped lang="scss">
#dashboard {
    height: calc(100vh - 50px);
    flex: 1;
    position: relative;
}
</style>