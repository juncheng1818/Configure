export function useGraphics(x, y, width, height) {

    // 画矩形
    var rect = new Konva.Rect({
        name: 'rect',
        x: x,
        y: y,
        width: 100,
        height: 50,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
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
        x: x,
        y: y,
        radius: 70,
        angle: 60,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true,
        rotation: -120
    });

    //箭头
    var arrow = new Konva.Arrow({
        x: x,
        y: y,
        points: [0, 0, 100, 50],
        pointerLength: 20,
        pointerWidth: 10,
        fill: 'black',
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
        x: x,
        y: y,
        sides: 8,
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
        points: [x, y + 50, x + 50, y, x + 100, y, x + 150, y + 50],
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


    let graphics = {
        'rect': rect,
        'circle': circle,
        'oval': oval,
        'wedge': wedge,
        'arrow': arrow,
        'star': star,
        'triangle': triangle
    }

    return {
        graphics
    }

}