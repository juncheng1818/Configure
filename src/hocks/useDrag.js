import { ref, onMounted, computed } from 'vue';

export function useDrag(canvas, canvasStyle, isDragging, offset, props) {
    const startDrag = (event) => {
        isDragging.value = true;
        offset.x = event.clientX - canvasStyle.left.replace('px', '');
        offset.y = event.clientY - canvasStyle.top.replace('px', '');
    };

    const onDrag = (event) => {
        if (!isDragging.value) return;

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

    return {
        startDrag,
        onDrag,
        stopDrag
    };

}
