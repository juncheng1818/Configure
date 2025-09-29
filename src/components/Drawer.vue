<template>
    <div>
        <n-drawer v-model:show="active" :width="500" :placement="placement">
            <n-drawer-content :title="'属性'">
                <n-form ref="formRef" label-width="80" inline :model="formValue" :rules="rules">
                    <n-flex>
                        <n-form-item v-for="(value, name, index) in formValue" :label="name" path="x">
                            <n-input :disabled="name == 'id' || name == 'name'"
                                :type="name == 'id' || name == 'name' || name == 'text' || name == 'stroke' || name == 'fill' || name == 'mainLine-stroke' || name == 'animatedLine-stroke' || name == 'anchor-fill' ? 'text' : 'number'"
                                v-model:value="formValue[name]" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item>
                            <n-button type="primary" attr-type="button" @click="handleValidateClick">
                                确定
                            </n-button>
                        </n-form-item>
                    </n-flex>
                </n-form>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup lang="js">

import { ref, defineEmits } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, NFlex, NColorPicker } from 'naive-ui'
const active = ref(false)
const placement = ref('right')

const formValue = ref({
})

const properties = ['id', 'name', 'x', 'y', 'width', 'height', 'radius', 'radiusX', 'radiusY', 'angle', 'rotation', 'innerRadius', 'outerRadius', 'fill', 'zIndex', 'text', 'fontSize', 'stroke', 'strokeWidth', 'cornerRadius']

const formRef = ref(null)
const emit = defineEmits(['update-css'])

const handleValidateClick = (e) => {
    formRef.value.validate((errors) => {
        if (!errors) {
            emit('update-css', formValue.value);
            active.value = false
        } else {
            console.log('Validate failed:', errors)
        }
    })
}

const rules = ref({})

const showDrawer = (stage, selectId) => {
    var selectNode = stage.findOne(`#${selectId}`)
    if (selectId.includes('connect-line')) {
        let timestamp = selectId.split('-')[2]
        let group = stage.findOne(`#connect-line-group-${timestamp}`)
        let mainLine = stage.findOne(`#connect-line-${timestamp}`)
        let animatedLine = stage.findOne(`#connect-line-animated-${timestamp}`)
        
        // 安全地获取锚点信息
        let anchorFill = '#18a058'; // 默认颜色
        if (selectId.includes('connect-line-anchor')) {
            // 如果是锚点，直接获取其属性
            let anchor = stage.findOne(`#${selectId}`)
            if (anchor && anchor.fill) {
                anchorFill = anchor.fill();
            }
        } else {
            // 如果是连线组件，获取第一个锚点的颜色作为默认值
            let anchors = group ? group.find('.connect-line-anchor') : [];
            if (anchors && anchors.length > 0 && anchors[0].fill) {
                anchorFill = anchors[0].fill();
            }
        }
        
        formValue.value = {
            'id': selectId,
            'name': 'connect-line',

            'x': group ? group.x() : 0,
            'y': group ? group.y() : 0,

            'mainLine-stroke': mainLine ? mainLine.stroke() : 'lightblue',
            'mainLine-strokeWidth': mainLine ? mainLine.strokeWidth() : 7,

            'animatedLine-stroke': animatedLine ? animatedLine.stroke() : '#18a058',
            'animatedLine-strokeWidth': animatedLine ? animatedLine.strokeWidth() : 3,

            'anchor-fill': anchorFill,

            'FlowSpeed': group ? group.getFrameDuration() : 22
        }
    } else {
        var css = selectNode.getAttrs()
        getProperties(css)
    }
    active.value = true
}

function getProperties(cssList) {
    console.log('表单要循环出来的数据', cssList)
    formValue.value = {}
    for (var item in cssList) {
        if (properties.includes(item)) {
            formValue.value[item] = cssList[item]
        }
    }
}

defineExpose({ showDrawer })

</script>

<style scoped lang="scss"></style>