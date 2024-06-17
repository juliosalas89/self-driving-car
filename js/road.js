class Road {
    constructor (x, width, lanesCount = 3) {
        this.x = x
        this.width = width
        this.lanesCount = lanesCount

        this.left = x - width / 2
        this.right = x + width / 2

        const infinity = 1000000
        this.top = -infinity
        this.bottom = infinity

        const topLeft = { x: this.left, y: this.top }
        const topRight = { x: this.right, y: this.top }
        const bottomLeft = { x: this.left, y: this.bottom }
        const bottomRight = { x: this.right, y: this.bottom }
        this.borders = [
            [topLeft, bottomLeft], 
            [topRight, bottomRight]
        ]
    }

    getLaneCenter (laneIndex) {
        const laneWidth = this.width / this.lanesCount
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.lanesCount - 1) * laneWidth
    }

    draw(ctx) {
        ctx.lineWidth = 5
        ctx.strokeStyle = 'white'
        for (let i = 1; i <= this.lanesCount - 1; i++) {
            const x = lerp(this.left, this.right, i / this.lanesCount)
            ctx.setLineDash([20, 20])
            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }
        ctx.setLineDash([])
        this.borders.forEach(([start, end]) => {
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        })
    }
}