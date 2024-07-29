<template>
    <div id="rectangle" @mousedown.stop="startDrag" @mousemove.stop="onDrag" @mouseup.stop="stopDrag"
        @contextmenu.prevent="showContextMenu">
        <canvas ref="canvas" :style="canvasStyle"></canvas>
        <ContextMenu ref="contextMenu" />
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
    position: {
        type: String,
        default: 'absolute'
    },
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
    position: props.position,
    border: '2px solid black',
    top: props.top,
    left: props.left,
});

const setCanvasSize = () => {
    const canvasElement = canvas.value;
    if (canvasElement) {
        canvasElement.width = 100;
        canvasElement.height = 50;
        const ctx = canvasElement.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 100, 50);
    }
};

import { useDrag } from '../../hocks/useDrag.js';
const { startDrag, onDrag, stopDrag } = useDrag(canvas, canvasStyle, isDragging, offset, props);

import { useContextMenu } from '../../hocks/useContextMenu.js';
const { showContextMenu } = useContextMenu(canvas, contextMenu);

onMounted(() => {
    setCanvasSize()
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