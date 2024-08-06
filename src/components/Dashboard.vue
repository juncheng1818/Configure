<template>
    <div id="dashboard" @mousedown="addComponent" ref="dashboard_ref">
        <!-- <component v-for="item in dashboardComponent.getComponentList()" :is="item.componentName" :transform="item.transform" :resizable="item.resizable" :id="item.id" :top="item.top" :left="item.left" ref="component_ref"></component> -->
    </div>
    <contextMenu @update-css="_updateCss"  ref="contextMenu_ref" />
</template>

<script setup lang="js">

import { ref, shallowRef, reactive, onMounted, nextTick } from 'vue'

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
const selectId = ref(null)

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
    })

})

//更新css
function _updateCss(css) {
    var selectNode = stage.findOne(`#${selectId.value}`)
    //改变背景色
    selectNode.setAttrs(
        {
            x: parseInt(css.left),
            y: parseInt(css.top),
            width: parseInt(css.width),
            height: parseInt(css.height),
            fill: css.backgroundColor,
            zIndex: parseInt(css.zIndex),
            stroke: css.backgroundColor,
            //圆角
            cornerRadius:  40,
        }
    )
    
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

        stage.on('contextmenu', function (e) {
            e.evt.preventDefault()
            if (e.target !== stage) {//不是点击舞台
                selectId.value = e.target.attrs.id
                contextMenu_ref.value.showMenu(e.evt.clientX, e.evt.clientY)
                var selectNode = stage.findOne(`#${selectId.value}`)
                console.log(selectNode)
                var css = selectNode.getAttrs()
                console.log(css)
            }
        })

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