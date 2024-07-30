<template>
    <div ref="canvasContainer" :style="componentStyle" class="canvas-container" @contextmenu.prevent="showContextMenu">
        <canvas ref="canvas" class="canvas-element" @mousedown.stop="startDrag" @mousemove.stop="onDrag"
            @mouseup="stopDrag" @mouseleave="stopDrag">
        </canvas>
        <ResizeHandles v-if="props.resizable" :offset="offset" :id="props.id" :componentStyle="componentStyle" ref="resizeHandles_ref" />
        <ContextMenu ref="contextMenu" @update-css="updateCss" :canvasStyle="componentStyle" :id="props.id" />
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, defineProps, reactive, watch } from 'vue';
import ContextMenu from '../ContextMenu.vue';
import ResizeHandles from '../ResizeHandles.vue';

const canvas = ref(null);
const contextMenu = ref(null);
const isDragging = ref(false);
const offset = reactive({ x: 0, y: 0 });

import { dashboardComponentStore } from '../../store/index.js';
const dashboardComponent = dashboardComponentStore();

const props = defineProps({
    id: {
        type: String
    },
    resizable: {
        type: Boolean,
    },
    transform: {
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
});

const canvasContainer = ref(null);
const componentStyle = reactive({
    position: 'absolute',
    border: 'none',
    top: props.top,
    left: props.left,
    transform: props.transform,
    width: '100px',
    height: '100px',
    backgroundColor: '#ffffff',
    zIndex: 0
});

const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy - Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy - Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
};

const setCanvasSize = (backgroundColor, width, height) => {
    const canvasElement = canvas.value;
    if (canvasElement) {
        canvasElement.width = parseInt(width);
        canvasElement.height = parseInt(height);
        const ctx = canvasElement.getContext('2d');
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        drawStar(ctx, canvasElement.width / 2, canvasElement.height / 2, 5, canvasElement.width / 2, canvasElement.width / 4);
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
    dashboardComponent.updateComponentList(props.id, componentStyle);
};

onMounted(() => {
    setCanvasSize(componentStyle.backgroundColor, componentStyle.width, componentStyle.height);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
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
