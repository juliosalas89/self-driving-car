const canvas = document.getElementById('mainCanvas')
canvas.height = window.innerHeight
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width / 2, canvas.width * 0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50)
car.draw(ctx)

const animate = () => {
    car.update(road.borders)
    canvas.height = window.innerHeight
    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.75)
    road.draw(ctx)
    car.draw(ctx)
    requestAnimationFrame(animate)
}

animate()