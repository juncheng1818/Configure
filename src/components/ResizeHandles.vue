<template>
    <div ref="resizeHandles_ref">
        <div class="rotate-handle" @mousedown.stop="startRotate"></div>
        <div v-if="showResizeHandles" v-for="(handle, index) in resizeHandles" :key="index"
            :class="['resize-handle', handle.position]" @mousedown.stop="startResize($event, handle.position)">
        </div>
    </div>
</template>
<script setup lang="js">

import { ref } from 'vue';

const isResizing = ref(false);
const isRotating = ref(false);
const showResizeHandles = ref(true);
const resizeDirection = ref('');

const resizeHandles_ref = ref(null);
let initialAngle = 0;

const resizeHandles = [
    { position: 'top-left' },
    { position: 'top' },
    { position: 'top-right' },
    { position: 'right' },
    { position: 'bottom-right' },
    { position: 'bottom' },
    { position: 'bottom-left' },
    { position: 'left' }
];

const props = defineProps({
    offset: {
        type: Object,
        default: () => {
            return {
                x: 0,
                y: 0
            }
        }
    },
    componentStyle: {
        type: Object,
    }
})

//点位拖拽
const toggleResizeHandles = () => {
    showResizeHandles.value = !showResizeHandles.value;
};

const startResize = (event, direction) => {
    isResizing.value = true;
    resizeDirection.value = direction;
    props.offset.x = event.clientX;
    props.offset.y = event.clientY;
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
};

const onResize = (event) => {
    if (!isResizing.value) return;

    const dx = event.clientX - props.offset.x;
    const dy = event.clientY - props.offset.y;

    if (resizeDirection.value.includes('right')) {
        props.componentStyle.width = `${parseInt(props.componentStyle.width) + dx}px`;
    }
    if (resizeDirection.value.includes('bottom')) {
        props.componentStyle.height = `${parseInt(props.componentStyle.height) + dy}px`;
    }
    if (resizeDirection.value.includes('left')) {
        props.componentStyle.width = `${parseInt(props.componentStyle.width) - dx}px`;
        props.componentStyle.left = `${parseInt(props.componentStyle.left) + dx}px`;
    }
    if (resizeDirection.value.includes('top')) {
        props.componentStyle.height = `${parseInt(props.componentStyle.height) - dy}px`;
        props.componentStyle.top = `${parseInt(props.componentStyle.top) + dy}px`;
    }
    props.offset.x = event.clientX;
    props.offset.y = event.clientY;
};

const stopResize = () => {
    isResizing.value = false;
    resizeDirection.value = '';
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
};

const startRotate = (event) => {
    isRotating.value = true;
    const parent = resizeHandles_ref.value.parentElement;
    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    console.log(props.componentStyle);
    initialAngle = (radians * 180) / Math.PI - parseFloat(props.componentStyle.transform.replace('rotate(', '').replace('deg)', ''));
    document.addEventListener('mousemove', onRotate);
    document.addEventListener('mouseup', stopRotate);
};

const onRotate = (event) => {
    if (!isRotating.value) return;
    const parent = resizeHandles_ref.value.parentElement;
    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radians = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const angle = (radians * 180) / Math.PI - initialAngle;
    props.componentStyle.transform = `rotate(${angle}deg)`;
};

const stopRotate = () => {
    isRotating.value = false;
    document.removeEventListener('mousemove', onRotate);
    document.removeEventListener('mouseup', stopRotate);
};

</script>
<style scoped lang="scss">
.resize-handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #18A058;
    border-radius: 50%;
    z-index: inherit;
    cursor: pointer;
}

.resize-handle.top-left {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
}

.resize-handle.top {
    top: -4px;
    left: calc(50% - 4px);
    cursor: ns-resize;
}

.resize-handle.top-right {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
}

.resize-handle.right {
    top: calc(50% - 4px);
    right: -4px;
    cursor: ew-resize;
}

.resize-handle.bottom-right {
    bottom: -4px;
    right: -4px;
    cursor: nwse-resize;
}

.resize-handle.bottom {
    bottom: -4px;
    left: calc(50% - 4px);
    cursor: ns-resize;
}

.resize-handle.bottom-left {
    bottom: -4px;
    left: -4px;
    cursor: nesw-resize;
}

.resize-handle.left {
    top: calc(50% - 4px);
    left: -4px;
    cursor: ew-resize;
}

.rotate-handle {
    width: 16px;
    height: 16px;
    background-image: url('/rotate.png');
    background-size: 16px 16px;
    cursor: grab;
    position: absolute;
    left: calc(50% - 8px);
    top:  -30px;
}

.rotate-handle:active {
    cursor: grabbing;
}
</style>