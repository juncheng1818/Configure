import { ref } from 'vue'
export function useGraphics(x, y, width, height) {

    // 画矩形
    var rect = new Konva.Rect({
        name: 'rect',
        id: `rect-${Date.now()}`,
        x: x,
        y: y,
        width: 100,
        height: 50,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        cornerRadius: 4,
        draggable: true,
        strokeScaleEnabled: false,  // 禁用缩放时的边框缩放
        dragBoundFunc: function (pos) {

            //放大或者缩小之后的宽高
            const newWidth = rect.width() * rect.scaleX();
            const newHeight = rect.height() * rect.scaleY();

            var newX = pos.x <= 0 ? 0 : pos.x;
            var newY = pos.y <= 0 ? 0 : pos.y;

            if (newX + newWidth > width) {
                newX = width - newWidth;
            }

            if (newY + newHeight > height) {
                newY = height - newHeight;
            }

            return {
                x: newX,
                y: newY
            }
        },
    });

    // 画圆
    var circle = new Konva.Circle({
        name: 'circle',
        id: `circle-${Date.now()}`,
        x: x,
        y: y,
        radius: 40,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,  // 禁用缩放时的边框缩放
        dragBoundFunc: function (pos) {
            // 放大或缩小后的半径
            const newRadius = circle.radius() * circle.scaleX();

            let newX = pos.x;
            let newY = pos.y;

            if (newX - newRadius < 0) {
                newX = newRadius;
            }
            if (newY - newRadius < 0) {
                newY = newRadius;
            }
            if (newX + newRadius > width) {
                newX = width - newRadius;
            }
            if (newY + newRadius > height) {
                newY = height - newRadius;
            }

            return {
                x: newX,
                y: newY,
            };
        },
    });

    // 画椭圆
    var oval = new Konva.Ellipse({
        name: 'oval',
        id: `oval-${Date.now()}`,
        x: x,
        y: y,
        radiusX: 60,
        radiusY: 30,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,  // 禁用缩放时的边框缩放
        dragBoundFunc: function (pos) {
            // 放大或缩小后的宽高
            const newRadiusX = oval.radiusX() * oval.scaleX();
            const newRadiusY = oval.radiusY() * oval.scaleY();

            let newX = pos.x;
            let newY = pos.y;

            if (newX - newRadiusX < 0) {
                newX = newRadiusX;
            }
            if (newY - newRadiusY < 0) {
                newY = newRadiusY;
            }
            if (newX + newRadiusX > width) {
                newX = width - newRadiusX;
            }
            if (newY + newRadiusY > height) {
                newY = height - newRadiusY;
            }

            return {
                x: newX,
                y: newY,
            };
        },
    });

    //扇形
    var wedge = new Konva.Wedge({
        name: 'wedge',
        id: `wedge-${Date.now()}`,
        x: x,
        y: y,
        radius: 80,
        angle: 60,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true,
        rotation: -120,
        draggable: true,
        strokeScaleEnabled: false,  // 禁用缩放时的边框缩放
        dragBoundFunc: function (pos) {
            var stage = this.getStage();

            // 获取三角形的包围盒
            var boundingBox = this.getClientRect({ relativeTo: stage });
            // 计算三角形相对于其自身原点的偏移
            var offsetX = boundingBox.x - this.x();
            var offsetY = boundingBox.y - this.y();
            // 计算新的位置，确保包围盒完全在舞台内
            var newX = Math.max(-offsetX, Math.min(pos.x, stage.width() - boundingBox.width - offsetX));
            var newY = Math.max(-offsetY, Math.min(pos.y, stage.height() - boundingBox.height - offsetY));
            return {
                x: newX,
                y: newY
            };
        },
    });

    //箭头
    var arrow = new Konva.Arrow({
        name: 'arrow',
        id: `arrow-${Date.now()}`,
        x: x,
        y: y,
        points: [0, 0, 100, 50],
        pointerLength: 26,
        pointerWidth: 20,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            // 获取箭头当前宽度和高度
            const newWidth = arrow.width() * arrow.scaleX();
            const newHeight = arrow.height() * arrow.scaleY();

            // 计算箭头的边界
            let newX = pos.x <= 0 ? 0 : pos.x;
            let newY = pos.y <= 0 ? 0 : pos.y;

            if (newX + newWidth > width) {
                newX = width - newWidth;
            }

            if (newY + newHeight > width) {
                newY = width - newHeight;
            }

            return {
                x: newX,
                y: newY
            };
        },
    });

    //五角星
    var star = new Konva.Star({
        name: 'star',
        id: `star-${Date.now()}`,
        x: x,
        y: y,
        numPoints: 5,
        innerRadius: 30,
        outerRadius: 60,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            // 计算星星的边界
            let newX = pos.x;
            let newY = pos.y;

            // 左边界
            if (newX - star.outerRadius() * star.scaleX() < 0) {
                newX = star.outerRadius() * star.scaleX();
            }
            // 右边界
            if (newX + star.outerRadius() * star.scaleX() > width) {
                newX = width - star.outerRadius() * star.scaleX();
            }
            // 上边界
            if (newY - star.outerRadius() * star.scaleY() < 0) {
                newY = star.outerRadius() * star.scaleY();
            }
            // 下边界
            if (newY + star.outerRadius() * star.scaleY() > height) {
                newY = height - star.outerRadius() * star.scaleY();
            }

            return {
                x: newX,
                y: newY
            };
        },
    });

    // 三角形
    var triangle = new Konva.RegularPolygon({
        name: 'triangle',
        id: `triangle-${Date.now()}`,
        x: x,
        y: y,
        sides: 3,
        radius: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();

            // 获取三角形的包围盒
            var boundingBox = this.getClientRect({ relativeTo: stage });
            // 计算三角形相对于其自身原点的偏移
            var offsetX = boundingBox.x - this.x();
            var offsetY = boundingBox.y - this.y();
            // 计算新的位置，确保包围盒完全在舞台内
            var newX = Math.max(-offsetX, Math.min(pos.x, stage.width() - boundingBox.width - offsetX));
            var newY = Math.max(-offsetY, Math.min(pos.y, stage.height() - boundingBox.height - offsetY));
            return {
                x: newX,
                y: newY
            };
        },
    });

    //梯形
    var trapezoid = new Konva.Line({
        name: 'trapezoid',
        id: `trapezoid-${Date.now()}`,
        points: [
            x, y + 150, // 左下角
            x + 50, y, // 左上角
            x + 100, y, // 右上角
            x + 150, y + 150 // 右下角
        ],
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        closed: true,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();

            var boundingBox = this.getClientRect({ relativeTo: stage });
            var offsetX = boundingBox.x - this.x();
            var offsetY = boundingBox.y - this.y();
            var newX = Math.max(-offsetX, Math.min(pos.x, stage.width() - boundingBox.width - offsetX));
            var newY = Math.max(-offsetY, Math.min(pos.y, stage.height() - boundingBox.height - offsetY));

            return {
                x: newX,
                y: newY
            };
        }
    });

    // 五边形
    var pentagon = new Konva.RegularPolygon({
        name: 'pentagon',
        id: `pentagon-${Date.now()}`,
        x: x,
        y: y,
        sides: 5,
        radius: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();

            // 获取三角形的包围盒
            var boundingBox = this.getClientRect({ relativeTo: stage });
            // 计算三角形相对于其自身原点的偏移
            var offsetX = boundingBox.x - this.x();
            var offsetY = boundingBox.y - this.y();
            // 计算新的位置，确保包围盒完全在舞台内
            var newX = Math.max(-offsetX, Math.min(pos.x, stage.width() - boundingBox.width - offsetX));
            var newY = Math.max(-offsetY, Math.min(pos.y, stage.height() - boundingBox.height - offsetY));
            return {
                x: newX,
                y: newY
            };
        },
    });

    // 六边形
    var hexagon = new Konva.RegularPolygon({
        name: 'hexagon',
        id: `hexagon-${Date.now()}`,
        x: x,
        y: y,
        sides: 6,
        radius: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();

            // 获取三角形的包围盒
            var boundingBox = this.getClientRect({ relativeTo: stage });
            // 计算三角形相对于其自身原点的偏移
            var offsetX = boundingBox.x - this.x();
            var offsetY = boundingBox.y - this.y();
            // 计算新的位置，确保包围盒完全在舞台内
            var newX = Math.max(-offsetX, Math.min(pos.x, stage.width() - boundingBox.width - offsetX));
            var newY = Math.max(-offsetY, Math.min(pos.y, stage.height() - boundingBox.height - offsetY));
            return {
                x: newX,
                y: newY
            };
        },
    });


    // 环形
    var ring = new Konva.Ring({
        name: 'ring',
        id: `ring-${Date.now()}`,
        x: x,
        y: y,
        innerRadius: 40,
        outerRadius: 70,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();
            var scale = this.scaleX(); // 假设 x 和 y 的缩放比例相同
            var outerRadius = this.outerRadius() * scale;

            // 计算新的位置，确保整个环都在舞台内
            var newX = Math.max(outerRadius, Math.min(pos.x, stage.width() - outerRadius));
            var newY = Math.max(outerRadius, Math.min(pos.y, stage.height() - outerRadius));

            return {
                x: newX,
                y: newY
            };
        },
    });

    // 弧形
    var arc = new Konva.Arc({
        name: 'arc',
        id: `arc-${Date.now()}`,
        x: 100,
        y: 100,
        innerRadius: 40,
        outerRadius: 70,
        angle: 90,
        rotation: -45,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();
            var scale = this.scaleX(); // 假设 x 和 y 的缩放比例相同
            var outerRadius = this.outerRadius() * scale;

            // 计算新的位置，确保整个弧形都在舞台内
            var newX = Math.max(outerRadius, Math.min(pos.x, stage.width() - outerRadius));
            var newY = Math.max(outerRadius, Math.min(pos.y, stage.height() - outerRadius));

            return {
                x: newX,
                y: newY
            };
        },
    });

    //简单文字
    var simpleText = new Konva.Text({
        name: 'simpleText',
        id: `simpleText-${Date.now()}`,
        x: x,
        y: y,
        text: 'peace',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'black',
        draggable: true,
        strokeScaleEnabled: false,
        dragBoundFunc: function (pos) {
            var stage = this.getStage();
            // 获取文本的边界框
            var textBox = this.getClientRect({relativeTo: stage});
            // 计算新的位置，确保文本不会超出舞台边界
            var newX = Math.max(0, Math.min(pos.x, stage.width() - textBox.width));
            var newY = Math.max(0, Math.min(pos.y, stage.height() - textBox.height));
            return {
                x: newX,
                y: newY
            };
        },
    });

    let graphics = {
        'rect': rect,
        'circle': circle,
        'oval': oval,
        'wedge': wedge,
        'arrow': arrow,
        'star': star,
        'triangle': triangle,
        'trapezoid': trapezoid,
        'pentagon': pentagon,
        'hexagon': hexagon,
        'ring': ring,
        'arc': arc,
        'simpleText': simpleText
    }

    return {
        graphics
    }

}