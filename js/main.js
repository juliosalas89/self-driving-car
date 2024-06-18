const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200

const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const car = new Car({ x: road.getLaneCenter(1), y: 100, width: 30, height: 50, role: 'PLAYER' })
const traffic = [
    new Car({ x: road.getLaneCenter(1), y: -100, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 })
]
car.draw(carCtx)

const animate = () => {
    traffic.forEach(trafficCar => trafficCar.update(road.borders, []))
    car.update(road.borders, traffic)
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    carCtx.save()
    carCtx.translate(0, -car.y + carCanvas.height * 0.75)
    road.draw(carCtx)
    traffic.forEach(trafficCar => trafficCar.draw(carCtx))
    car.draw(carCtx)
    requestAnimationFrame(animate)
}

animate()