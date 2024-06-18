class Car {
    constructor ({ x, y, width, height, role = 'PLAYER', maxSpeed = 3 } = {}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        
        this.speed = 0;
        this.acceleration = 0.2
        this.maxSpeed = maxSpeed
        this.friction = 0.05
        this.angle = 0
        this.damaged = false
        this.sensor = role === 'PLAYER' ? new Sensor(this) : null
        this.controls = new Controls(role)
        this.polygon = this.#createPolygon()
    }

    update (roadBorders, traffic) {
        if(!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }
        this.sensor && this.sensor.update(roadBorders, traffic)
    }

    #createPolygon () {
        const radius = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height)
        return [
            { x: this.x - Math.sin(this.angle - alpha) * radius, y : this.y - Math.cos(this.angle - alpha) * radius },
            { x: this.x - Math.sin(this.angle + alpha) * radius, y : this.y - Math.cos(this.angle + alpha) * radius },
            { x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius, y : this.y - Math.cos(Math.PI + this.angle - alpha) * radius },
            { x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius, y : this.y - Math.cos(Math.PI + this.angle + alpha) * radius }
        ]
    }

    #assessDamage (roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if(polygonIntersects(this.polygon, roadBorders[i])) return true
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polygonIntersects(this.polygon, traffic[i].polygon)) return true
        }
        return false
    }

    #move () {
        const { forward, backward, left, right } = this.controls
        if (forward) this.speed += this.acceleration
        if (backward) this.speed -= this.acceleration
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed  // forward max speed
        if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2  // backward max speed
        // add some friction
        if (this.speed > 0) this.speed -= this.friction
        if (this.speed < 0) this.speed += this.friction
        if(Math.abs(this.speed) < this.friction) this.speed = 0 // Sometimes the car doesn't stop cause speed is different to 0, so with this line we make sure it stops
        if (left && this.speed) this.angle += (this.speed > 0 ? 0.03 : 0.06) * (this.speed / this.maxSpeed) // if goes backwards, turn faster. last part is to make it more realistic
        if (right && this.speed) this.angle -= (this.speed > 0 ? 0.03 : 0.06) * (this.speed / this.maxSpeed)
        this.y -= Math.cos(this.angle) * this.speed
        this.x -= Math.sin(this.angle) * this.speed
    }

    draw(ctx) {
        if(this.damaged) ctx.fillStyle = 'red'
        if(!this.damaged) ctx.fillStyle = 'grey'
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        this.polygon.forEach(point => {
            ctx.lineTo(point.x, point.y)
        })
        ctx.fill()
        this.sensor && this.sensor.draw(ctx)
    }
}