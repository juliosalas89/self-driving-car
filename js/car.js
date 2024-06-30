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
        this.useBrain = role === 'AI'
        if (role !== 'DUMMY') {
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
        }
        this.controls = new Controls(role)
        this.polygon = this.#createPolygon()
    }

    update (roadBorders, traffic) {
        if(!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }
        if(this.sensor) { 
            this.sensor.update(roadBorders, traffic)
            // We calculate offsets for our network, we want it to receive low values when the car is far from the road borders and traffic, and high values when it's close
            const offsets = this.sensor.readings.map(reading => reading ? 1-reading.offset : 0)
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            if(this.useBrain) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.backward = outputs[3]
            
            }
        }
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

    draw(ctx, color = 'black', drawSensors = false) {
        if(this.damaged) ctx.fillStyle = 'grey'
        if(!this.damaged) ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        this.polygon.forEach(point => {
            ctx.lineTo(point.x, point.y)
        })
        ctx.fill()
        this.sensor && drawSensors && this.sensor.draw(ctx)
    }
}