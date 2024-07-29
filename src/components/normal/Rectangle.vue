<template>
    <div id="rectangle" @mousedown.stop="startDrag" @mousemove.stop="onDrag" @mouseup.stop="stopDrag"
        @contextmenu.prevent.stop="showContextMenu">
        <canvas ref="canvas" :style="canvasStyle"></canvas>
        <ContextMenu ref="contextMenu" @update-css="updateCss" :canvasStyle="canvasStyle"/>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, defineProps, reactive } from 'vue';
import ContextMenu from '../ContextMenu.vue';

const canvas = ref(null);
const contextMenu = ref(null);
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });

const props = defineProps({
    top: {
        type: String,
        default: '0px'
    },
    left: {
        type: String,
        default: '0px'
    },
})

const canvasStyle = reactive({
    position: 'absolute',
    border: '2px solid black',
    top: props.top,
    left: props.left,
    width: '100px',
    height: '50px',
    backgroundColor: 'white',
});

const setCanvasSize = (backgroundColor,width,height) => {
    const canvasElement = canvas.value;
    if (canvasElement) {
        canvasElement.width = width;
        canvasElement.height = height;
        const ctx = canvasElement.getContext('2d');
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }
};

import { useDrag } from '../../hocks/useDrag.js';
const { startDrag, onDrag, stopDrag } = useDrag(canvas, canvasStyle, isDragging, offset, props);

import { useContextMenu } from '../../hocks/useContextMenu.js';
const { showContextMenu } = useContextMenu(canvas, contextMenu);

const updateCss = (css) => {
    console.log('孙组件Drawer传过来的数据',css);
    canvasStyle.top = css.top;
    canvasStyle.left = css.left;
    canvasStyle.width = css.width;
    canvasStyle.height = css.height;
    setCanvasSize(canvasStyle.backgroundColor, canvasStyle.width, canvasStyle.height);
};

onMounted(() => {
    setCanvasSize(canvasStyle.backgroundColor, canvasStyle.width, canvasStyle.height);
});

onBeforeUnmount(() => {
});
</script>

<style scoped lang="scss">
#rectangle {
    width: auto;
    height: auto;
    cursor: pointer;
}
</style>