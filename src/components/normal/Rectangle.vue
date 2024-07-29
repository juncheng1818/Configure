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

/**
 * 拖拽相关
*/

const startDrag = (event) => {
    isDragging.value = true;
    offset.x = event.clientX - canvasStyle.left.replace('px', '');
    offset.y = event.clientY - canvasStyle.top.replace('px', '');
};

const onDrag = (event) => {
    if (!isDragging.value) return;

    //获取整个父组件元素
    const parent = canvas.value.parentElement;
    const parentRect = parent.getBoundingClientRect();

    let newLeft = event.clientX - offset.x;
    let newTop = event.clientY - offset.y;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + props.width > parentRect.width) newLeft = parentRect.width - props.width;
    if (newTop + props.height > parentRect.height) newTop = parentRect.height - props.height;

    canvasStyle.left = `${newLeft}px`;
    canvasStyle.top = `${newTop}px`;
};

const stopDrag = () => {
    isDragging.value = false;
};


/**
 * 拖拽结束
 * */


const showContextMenu = (event) => {
    const parentRect = canvas.value.parentElement.getBoundingClientRect();
    const relativeX = event.clientX - parentRect.left;
    const relativeY = event.clientY - parentRect.top;

    contextMenu.value.showMenu(relativeX, relativeY);
};

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