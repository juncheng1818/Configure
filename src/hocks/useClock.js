export function useClock(x, y, width, height, layer, stage) {

    // 时钟的中心位置和半径
    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2;
    const radius = 30;

    const clockText = new Konva.Text({
        name: 'clock-text',
        id: `clock-text-${Date.now()}`,
        x: x,
        y: y,
        text: '',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: '#555',
        align: 'center',
        verticalAlign: 'middle',
        draggable: true
    });

    // 更新时钟的函数
    clockText.updateClock = function () {

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // 更新文本内容
        this.text(timeString);
        layer.draw()
    }

    // // 绘制时钟的圆形边框
    // const clockFace = new Konva.Circle({
    //     x: centerX,
    //     y: centerY,
    //     radius: radius,
    //     stroke: 'black',
    //     strokeWidth: 4,
    //     fill: 'white',
    // });
    // // layer.add(clockFace);

    // // 绘制时钟的刻度
    // const ticksGroup = new Konva.Group();
    // layer.add(ticksGroup);

    // for (let i = 0; i < 12; i++) {
    //     const angle = (i * 30) * (Math.PI / 180); // 每个刻度的角度
    //     const tickX = centerX + (radius - 20) * Math.sin(angle);
    //     const tickY = centerY - (radius - 20) * Math.cos(angle);

    //     const tick = new Konva.Line({
    //         points: [tickX, tickY, centerX + (radius - 10) * Math.sin(angle), centerY - (radius - 10) * Math.cos(angle)],
    //         stroke: 'black',
    //         strokeWidth: 2,
    //     });
    //     ticksGroup.add(tick);
    // }

    // // 创建时针、分针、秒针
    // const hourHand = new Konva.Line({
    //     points: [centerX, centerY, centerX, centerY - radius / 2],
    //     stroke: 'black',
    //     strokeWidth: 6,
    //     listening: false,
    // });
    // layer.add(hourHand);

    // const minuteHand = new Konva.Line({
    //     points: [centerX, centerY, centerX, centerY - radius * 0.75],
    //     stroke: 'black',
    //     strokeWidth: 4,
    //     listening: false,
    // });
    // layer.add(minuteHand);

    // const secondHand = new Konva.Line({
    //     points: [centerX, centerY, centerX, centerY - radius * 0.9],
    //     stroke: 'red',
    //     strokeWidth: 2,
    //     listening: false,
    // });
    // layer.add(secondHand);

    // // 更新时钟的函数
    // clockFace.updateClock = function () {
    //     const now = new Date();
    //     const hours = now.getHours();
    //     const minutes = now.getMinutes();
    //     const seconds = now.getSeconds();

    //     // 计算时针、分针和秒针的角度
    //     const hourAngle = (hours % 12) * 30 + minutes / 2;
    //     const minuteAngle = minutes * 6;
    //     const secondAngle = seconds * 6;

    //     hourHand.points([centerX, centerY, centerX + (radius / 2) * Math.sin(hourAngle * (Math.PI / 180)), centerY - (radius / 2) * Math.cos(hourAngle * (Math.PI / 180))]);
    //     minuteHand.points([centerX, centerY, centerX + (radius * 0.75) * Math.sin(minuteAngle * (Math.PI / 180)), centerY - (radius * 0.75) * Math.cos(minuteAngle * (Math.PI / 180))]);
    //     secondHand.points([centerX, centerY, centerX + (radius * 0.9) * Math.sin(secondAngle * (Math.PI / 180)), centerY - (radius * 0.9) * Math.cos(secondAngle * (Math.PI / 180))]);

    //     layer.draw();
    // }

    let clock = {
        'clockText': clockText,
        // 'clockFace': clockFace,
    }

    return {
        clock
    }

}