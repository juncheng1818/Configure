<template>
    <div>
        <n-drawer v-model:show="active" :width="500" :placement="placement">
            <n-drawer-content :title="'属性'">
                <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules">
                    <n-flex>
                        <n-form-item label="X坐标" path="left">
                            <n-input v-model:value="formValue.left" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item label="Y坐标" path="top">
                            <n-input v-model:value="formValue.top" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item label="宽" path="width">
                            <n-input v-model:value="formValue.width" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item label="高" path="height">
                            <n-input v-model:value="formValue.height" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item label="层级" path="height">
                            <n-input v-model:value="formValue.zIndex" placeholder="请输入" />
                        </n-form-item>
                        <n-form-item label="背景色" path="backgroundColor">
                            <n-color-picker v-model:value="formValue.backgroundColor" :show-alpha="false" />
                        </n-form-item>
                        <n-form-item label="边框颜色" path="backgroundColor">
                            <n-color-picker v-model:value="formValue.borderColor" :show-alpha="false" />
                        </n-form-item>
                        <n-form-item label="边框宽度" path="backgroundColor">
                            <n-color-picker v-model:value="formValue.borderWidth" :show-alpha="false" />
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

import { ref, defineProps, defineEmits } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, NFlex, NColorPicker } from 'naive-ui'
const active = ref(false)
const placement = ref('right')

const formValue = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: '#fff',
    zIndex: 0,
    borderColor: '#000',
    borderWidth: 1
})

const formRef = ref(null)
const emit = defineEmits(['update-css'])

const handleValidateClick = (e) => {
    formRef.value.validate((errors) => {
        if (!errors) {
            console.log('Validate successfully')
            emit('update-css', formValue.value);
            active.value = false
        } else {
            console.log('Validate failed:', errors)
        }
    })
}

const rules = ref(
    {
        left: {
            required: true,
            message: '请输入X坐标',
            trigger: ['input', 'blur']
        },
        top: {
            required: true,
            message: '请输入Y坐标',
            trigger: ['input', 'blur']
        }
    }
)

const showDrawer = (canvasStyle) => {
    formValue.value = {
        ...canvasStyle
    }
    active.value = true
}

defineExpose({ showDrawer })

</script>

<style scoped lang="scss"></style>