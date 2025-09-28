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