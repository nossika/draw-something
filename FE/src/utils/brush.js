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
        this.strokes = [];
    }
    redraw (strokes) {
        strokes = (strokes || []).slice();
        let revokeIndex;
        revokeLoop: while ((revokeIndex = strokes.findIndex(stroke => stroke.type === 'revoke')) !== -1) {
            let beginIndex = 0;
            let endIndex = revokeIndex - 1;
            strokes.splice(revokeIndex, 1);
            for (let i = revokeIndex - 1; i > 0; i--) {
                if (strokes[i].type === 'end') {
                    endIndex = i;
                } else if (strokes[i].type === 'begin') {
                    beginIndex = i;
                    strokes.splice(beginIndex, endIndex - beginIndex + 1);
                    continue revokeLoop;
                }
            }
            strokes.splice(beginIndex, endIndex - beginIndex + 1);
        }
        this.strokes = strokes;
        let { width, height } = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.strokeStyle = '#000';
        for (let stroke of strokes) {
            this.draw(stroke);
        }
    }
    exec (stroke) {
        this.strokes.push(stroke);
        if (stroke.type === 'revoke') {
            this.redraw(this.strokes);
        } else {
            this.draw(stroke);
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
                        ctx.clearRect(x - ctx.lineWidth * 10, y - ctx.lineWidth * 10, ctx.lineWidth * 20, ctx.lineWidth * 20);
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