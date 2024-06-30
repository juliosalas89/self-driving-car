const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200

const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300

const generateCars = (N) => {
    const cars = []
    for (let i = 0; i < N; i++) {
        cars.push(new Car({ x: road.getLaneCenter(1), y: 100, width: 30, height: 50, role: 'AI'}))
    }
    return cars
}
const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const cars = generateCars(100)
const traffic = [
    new Car({ x: road.getLaneCenter(1), y: -100, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -300, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -300, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -500, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -500, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -700, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -700, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -900, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -1100, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -1100, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -1300, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -1300, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -1500, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -1500, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -1600, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -1800, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -1800, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -2000, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -2000, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -2100, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -2200, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(0), y: -2400, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -2400, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(1), y: -2600, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
    new Car({ x: road.getLaneCenter(2), y: -2600, width: 30, height: 50, role: 'DUMMY', maxSpeed: 2 }),
]

let bestCar = cars[0]
const storedBrain = localStorage.getItem('bestBrain')
if(storedBrain) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(storedBrain)
        if(i) {
            NeuralNetwork.mutate(cars[i].brain, 0.01)
        }
    }
}

const save = () => {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

const discard = () => {
    localStorage.removeItem('bestBrain')
}

const animate = () => {
    traffic.forEach(trafficCar => trafficCar.update(road.borders, []))
    cars.forEach(car => car.update(road.borders, traffic))
    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight
    carCtx.save()
    // Fitness function based on distance traveled
    bestCar = cars.find(car => car.y === Math.min(...cars.map(car => car.y)))
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75)
    road.draw(carCtx)
    traffic.forEach(trafficCar => trafficCar.draw(carCtx))
    carCtx.globalAlpha = 0.2
    cars.forEach((car, i) => car.draw(carCtx, 'blue'))
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, 'blue', drawSensors = true)
    carCtx.restore()
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}

animate()