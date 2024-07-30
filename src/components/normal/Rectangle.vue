<template>
    <div ref="canvasContainer" :style="componentStyle" class="canvas-container" @contextmenu.prevent="showContextMenu">
        <canvas ref="canvas" class="canvas-element" @mousedown.stop="startDrag" @mousemove.stop="onDrag"
            @mouseup="stopDrag" @mouseleave="stopDrag">
        </canvas>
        <ResizeHandles v-if="props.resizable":offset="offset" :componentStyle="componentStyle" ref="resizeHandles_ref" />
        <ContextMenu ref="contextMenu" @update-css="updateCss" :canvasStyle="componentStyle" :id="props.id" />
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, defineProps, reactive } from 'vue';
import ContextMenu from '../ContextMenu.vue';
import ResizeHandles from '../ResizeHandles.vue';

const canvas = ref(null);
const contextMenu = ref(null);
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });

const props = defineProps({
    id: {
        type: String
    },
    resizable: {
        type: Boolean,
    },
    transform:{
        type: String
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

const canvasContainer = ref(null);
const componentStyle = reactive({
    position: 'absolute',
    border: '2px solid black',
    top: props.top,
    left: props.left,
    transform: props.transform,
    width: '100px',
    height: '50px',
    backgroundColor: '#ffffff',
    zIndex: 0
});

const setCanvasSize = (backgroundColor, width, height) => {
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
const { startDrag, onDrag, stopDrag } = useDrag(canvas, componentStyle, isDragging, offset, props);

import { useContextMenu } from '../../hocks/useContextMenu.js';
const { showContextMenu } = useContextMenu(canvas, contextMenu);

const updateCss = (css) => {
    console.log('孙组件Drawer传过来的数据', css);
    componentStyle.top = css.top;
    componentStyle.left = css.left;
    componentStyle.width = css.width;
    componentStyle.height = css.height;
    componentStyle.backgroundColor = css.backgroundColor;
    componentStyle.zIndex = css.zIndex;
    setCanvasSize(componentStyle.backgroundColor, componentStyle.width, componentStyle.height);
};

onMounted(() => {
    setCanvasSize(componentStyle.backgroundColor, componentStyle.width, componentStyle.height);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
});
</script>

<style scoped lang="scss">
.canvas-container {
    position: absolute;
    border: 1px solid black;
    cursor: pointer;
}

.canvas-element {
    width: 100%;
    height: 100%;
    display: block;
}
</style>