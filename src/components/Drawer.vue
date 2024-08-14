<template>
    <div>
        <n-drawer v-model:show="active" :width="500" :placement="placement">
            <n-drawer-content :title="'属性'">
                <n-form ref="formRef" label-width="80" inline :model="formValue" :rules="rules">
                    <n-flex>
                        <n-form-item v-for="(value, name, index) in formValue" :label="name" path="x">
                            <n-input :disabled="name == 'id' || name == 'name'" v-model:value="formValue[name]"
                                placeholder="请输入" />
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

const showDrawer = (cssList) => {
    getProperties(cssList)
    active.value = true
}

function getProperties(cssList) {
    formValue.value = {}
    for (var item in cssList) {
        if (properties.includes(item)) {
            formValue.value[item] = cssList[item]
        }
    }
    console.log('表单要循环出来的数据', formValue.value)
}

defineExpose({ showDrawer })

</script>

<style scoped lang="scss"></style>