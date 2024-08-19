<template>
    <n-spin :show="showSpin" :description="'正在添加'">
        <div id="dashboard" @mousedown="addComponent" ref="dashboard_ref">
        </div>
    </n-spin>
    <contextMenu @update-css="_updateCss" @delete-component="_deleteComponent" ref="contextMenu_ref" />
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

const selectId = ref(null)

import emitter from '../mitt';

const showSpin = ref(false)

onUnmounted(() => {
    emitter.off('save')
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
                contextMenu_ref.value.showMenu(e.evt.clientX, e.evt.clientY, stage, selectId.value,layer)
            }
        })

    })

    emitter.on('save', (event) => {
        console.log('save')
        console.log(stage.toObject())
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
        selectNode.setAttrs({ ...css })
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
    let iconName = iconChoice.getIconName()
    let iconTitle = iconChoice.getIconTitle()
    if (iconName) {
        showSpin.value = true
        const x = event.clientX - dashboardRect.value.left;
        const y = event.clientY - dashboardRect.value.top;

        if (iconTitle === '常用') {
            const { graphics } = useGraphics(x, y, dashboardRect.value.width, dashboardRect.value.height)
            layer.add(graphics[iconName]);
            layer.draw();
        }

        if (iconTitle === '图表') {
            const { charts } = useCharts(x, y, dashboardRect.value.width, dashboardRect.value.height, iconName)
            layer.add(charts['rect']);
            layer.draw();
        }

        if (iconTitle === '连线') {
            useConnectLine(x, y, dashboardRect.value.width, dashboardRect.value.height, layer, stage)
        }

        if(iconTitle === '时间'){
            const { clock } = useClock(x, y, dashboardRect.value.width, dashboardRect.value.height,layer,stage)
            layer.add(clock[iconName]);
            layer.draw();
            setInterval(clock[iconName].updateClockText(),1000) 
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
    height: calc(100vh - 50px);
    width: calc(100vw - 280px);
    position: relative;
}
</style>