export function useGraphics(x, y, width, height) {

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
            return {
                x: pos.x,
                y: pos.y
            }
        },
      });


    let graphics = {
        'rect': rect,
        'circle': circle,
        'oval': oval,
        'wedge': wedge,
        'arrow': arrow
    }

    return {
        graphics
    }

}