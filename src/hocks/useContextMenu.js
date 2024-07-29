export function useContextMenu(canvas, contextMenu) {
    const showContextMenu = (event) => {
        const parentRect = canvas.value.parentElement.getBoundingClientRect();
        const relativeX = event.clientX - parentRect.left;
        const relativeY = event.clientY - parentRect.top;
    
        contextMenu.value.showMenu(relativeX, relativeY);
    };
    return {
        showContextMenu,
    };

}