export function useHeatingSystem(x, y, width, height, layer, stage,imageName) {

    const img = new Image();
    img.src = `/images/${imageName}.png`;  // 替换为你的图片路径

    const customImage = new Konva.Image({
        name: `custom-image-${imageName}`,
        id: `custom-image-${imageName}-${Date.now()}`,
        x: x,  // 图片的X轴位置
        y: y,  // 图片的Y轴位置
        image: img,
        width: 128,  // 图片宽度
        height: 128,  // 图片高度
        draggable: true  // 图片是否可拖动
    });

    return {
        customImage
    }

}