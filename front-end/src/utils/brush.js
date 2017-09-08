export default class Brush {
    constructor ({
        canvas,
        lineWidth = 4,
        color = 'red'
    }) {
        this.ctx = canvas.getContext('2d');
        this.mode = 'brush';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
    }
    redraw (strokes) {
        let { canvasWidth, canvasHeight } = this.ctx.canvas;
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        for (let stroke of strokes) {
            this.draw(stroke);
        }
    }
    draw (stroke) {
        let ctx = this.ctx;
        switch (stroke.type) {
            case 'mode':
                this.mode = stroke.mode;
                break;
            case 'color':
                this.ctx.strokeStyle = stroke.color;
                break;
            case 'begin':
                ctx.beginPath();
                ctx.moveTo(stroke.x, stroke.y);
                ctx.stroke();
                break;
            case 'move':
            {
                switch (this.mode) {
                    case 'brush':
                        ctx.lineTo(stroke.x, stroke.y);
                        ctx.stroke();
                        break;
                    case 'eraser':
                        ctx.clearRect(stroke.x - this.ctx.lineWidth, stroke.y - this.ctx.lineWidth, this.ctx.lineWidth * 2, this.ctx.lineWidth * 2);
                        break;
                }
            }
                break;
            case 'close':
                ctx.closePath();
                break;

        }
    }

};