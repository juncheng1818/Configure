export function useGraphics(x, y) {

    var rect = new Konva.Rect({
        name: 'rect',
        x: x,
        y: y,
        width: 100,
        height: 50,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true
    });

    var circle = new Konva.Circle({
        name: 'circle',
        x: x,
        y: y,
        radius: 40,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        draggable: true
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
        draggable: true
    });


    let graphics = {
        'rect': rect,
        'circle': circle,
        'oval': oval
    }

    return {
        graphics
    }

}