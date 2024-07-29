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
                        <n-form-item>
                            <n-button attr-type="button" @click="handleValidateClick">
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
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, NFlex } from 'naive-ui'
const active = ref(false)
const placement = ref('right')

const formValue = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0
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
        left: canvasStyle.left,
        top: canvasStyle.top,
        width: canvasStyle.width,
        height: canvasStyle.height
    }
    active.value = true
}

defineExpose({ showDrawer })

</script>

<style scoped lang="scss"></style>