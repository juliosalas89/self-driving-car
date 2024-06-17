class Sensor {
    constructor(car, rayCount = 10, rayLength = 300, raySpread = Math.PI / 2) {
        this.car = car
        this.rayCount = rayCount
        this.rayLength = rayLength
        this.raySpread = raySpread
        this.rays = []
        this.readings = []
    }

    update (roadBorders) {
        this.#castRayd()
        this.readings = this.rays.map(ray => this.#getReading(ray, roadBorders)) 
    }

    #getReading([start, end], roadBorders) {
        const touches = []
        roadBorders.forEach(([borderStart, borderEnd]) => {
            const touch = getIntersection(start, end, borderStart, borderEnd)
            touch && touches.push(touch)
        })
        const closestOffset = touches.length && Math.min(...touches.map(({offset}) => offset))
        return closestOffset && touches.find(({offset}) => offset === closestOffset)
    }

    #castRayd() {
        this.rays = []
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.car.angle + lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount > 1 ? i / (this.rayCount - 1) : 0.5)
            const start = { x: this.car.x, y: this.car.y }
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength, 
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push([start, end])
        }
    }

    draw(ctx) {
        this.rays.forEach(([start, end], i) => {
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = 'red'
            ctx.moveTo(start.x, start.y)
            if(!this.readings[i]) ctx.lineTo(end.x, end.y)
            if(this.readings[i]) ctx.lineTo(this.readings[i].x, this.readings[i].y)
            ctx.stroke()

            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = 'black'
            ctx.moveTo(end.x, end.y)
            if(!this.readings[i]) ctx.lineTo(end.x, end.y)
            if(this.readings[i]) ctx.lineTo(this.readings[i].x, this.readings[i].y)
            ctx.stroke()
        })
    }
}