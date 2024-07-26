<template>
    <div id="rectangle">
        <canvas ref="canvas" :style="canvasStyle"></canvas>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue';

const canvas = ref(null);
const props = defineProps({
    position:{
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

const canvasStyle = ref({
    position: props.position,
    top: props.top,
    left: props.left,
});

const setCanvasSize = () => {
    const canvasElement = canvas.value;
    if (canvasElement) {
        canvasElement.width = 100;
        canvasElement.height = 50;
        const ctx = canvasElement.getContext('2d');

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 100, 50);
    }
};

onMounted(() => {
    setCanvasSize();
});

onBeforeUnmount(() => {
});
</script>

<style scoped lang="scss">
#rectangle {}
</style>