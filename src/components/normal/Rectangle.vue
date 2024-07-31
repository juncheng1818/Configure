<template>
    <div ref="container_ref" :style="componentStyle" class="canvas-container" @mousedown.stop="startDrag" @mousemove.stop="onDrag"
            @mouseup="stopDrag" @contextmenu.prevent="showContextMenu">
        <ResizeHandles v-if="props.resizable" :offset="offset" :id="props.id" :componentStyle="componentStyle"
            ref="resizeHandles_ref" />
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

import { dashboardComponentStore } from '../../store/index.js'
const dashboardComponent = dashboardComponentStore()

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
})

const container_ref = ref(null);
const componentStyle = reactive({
    position: 'absolute',
    top: props.top,
    left: props.left,
    transform: props.transform,
    width: '100px',
    height: '50px',
    zIndex: 0,
    border: '2px solid black',
});

import { useDrag } from '../../hocks/useDrag.js';
const { startDrag, onDrag, stopDrag } = useDrag(container_ref, componentStyle, isDragging, offset, props);

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
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped lang="scss">
.canvas-container {
    position: absolute;
    cursor: pointer;
}

.canvas-element {
    width: 100%;
    height: 100%;
    display: block;
}
</style>