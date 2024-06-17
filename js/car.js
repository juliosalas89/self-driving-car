class Car {
    constructor (x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        
        this.speed = 0;
        this.acceleration = 0.2
        this.maxSpeed = 3
        this.friction = 0.05
        this.angle = 0
        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }

    update (roadBorders) {
        this.#move()
        this.sensor.update(roadBorders)
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
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)
        ctx.beginPath()
        ctx.rect(
            - this.width / 2, 
            - this.height /2, 
            this.width, 
            this.height
        )
        ctx.fill()
        ctx.restore()

        this.sensor.draw(ctx)
    }
}