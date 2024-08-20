export function useClock(x, y, width, height, layer, stage) {

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

    clockText.updateClock()

    let clock = {
        'clockText': clockText,
    }

    return {
        clock
    }

}