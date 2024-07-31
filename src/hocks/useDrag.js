import { ref, onMounted, computed } from 'vue';
import { dashboardComponentStore } from '../store/index.js'
const dashboardComponent = dashboardComponentStore()

export function useDrag(container_ref, componentStyle, isDragging, offset, props) {
    const startDrag = (event) => {
        isDragging.value = true;
        offset.x = event.clientX - componentStyle.left.replace('px', '');
        offset.y = event.clientY - componentStyle.top.replace('px', '');

        dashboardComponent.showResizable(props.id)

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (event) => {
        if (!isDragging.value) return;

        // const parent = canvas.value.parentElement;
        const parentRect = container_ref.value.getBoundingClientRect();

        let newLeft = event.clientX - offset.x;
        let newTop = event.clientY - offset.y;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + props.width > parentRect.width) newLeft = parentRect.width - props.width;
        if (newTop + props.height > parentRect.height) newTop = parentRect.height - props.height;

        componentStyle.left = `${newLeft}px`;
        componentStyle.top = `${newTop}px`;

        document.onmousemove = function (e) {
            componentStyle.left = `${newLeft}px`;
            componentStyle.top = `${newTop}px`;
        };
    };

    const stopDrag = () => {
        isDragging.value = false;

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    };

    return {
        startDrag,
        onDrag,
        stopDrag
    };

}
