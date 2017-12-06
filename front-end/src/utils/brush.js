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
        let { width, height } = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);
        if (strokes) {
            for (let stroke of strokes) {
                this.draw(stroke);
            }
        }
    }
    draw (stroke) {
        let ctx = this.ctx;
        let { width, height } = ctx.canvas;
        let x = stroke.x * width;
        let y = stroke.y * height;
        switch (stroke.type) {
            case 'mode':
                this.mode = stroke.mode;
                break;
            case 'color':
                this.ctx.strokeStyle = stroke.color;
                break;
            case 'begin':
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.stroke();
                break;
            case 'move':
            {
                switch (this.mode) {
                    case 'brush':
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        break;
                    case 'eraser':
                        ctx.clearRect(x - ctx.lineWidth, y - ctx.lineWidth, ctx.lineWidth * 2, ctx.lineWidth * 2);
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