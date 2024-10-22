class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50 
        const left = margin
        const top = margin
        const width = ctx.canvas.width - 2 * margin
        const height = ctx.canvas.height - 2 * margin

        const levelHeight = height / network.levels.length
        for(let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(height-levelHeight,0,(network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)))
            Visualizer.drawLevel({
                ctx, 
                level: network.levels[i], 
                left, 
                top: levelTop, 
                width, 
                height: levelHeight, 
                isFinalOutput: i === network.levels.length - 1
            })
        }
    }

    static drawLevel({ ctx, level, left, top, width, height, isFinalOutput }) {
        const symbols = ['🠉','🠈','🠊','🠋']
        const right = left + width
        const bottom = top + height
        const { inputs, outputs, weights, biases } = level
        const nodeRadius = 12
        // Draw connections between inputs and outputs
        inputs.forEach((_, i) => {
            outputs.forEach((_, j) => {
                ctx.beginPath()
                ctx.moveTo(
                    Visualizer.#getNodeX(left, right, inputs.length, i), 
                    bottom
                )
                ctx.lineTo(
                    Visualizer.#getNodeX(left, right, outputs.length, j), 
                    top
                )
                ctx.lineWidth = 1
                // We asign a color and opacity depending on the sign and value of the connection weight 
                // Red for negaitve values, Green for positive values
                ctx.strokeStyle = getRGBA(weights[i][j])
                ctx.stroke()
            })
        })
        // Draw inputs nodes
        inputs.forEach((_, i, inputs) => {
            const x = Visualizer.#getNodeX(left, right, inputs.length, i)
            ctx.beginPath()
            ctx.arc(x, bottom, (nodeRadius), 0, Math.PI * 2)
            ctx.fillStyle = 'black'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(x, bottom, (0.6 * nodeRadius), 0, Math.PI * 2)
            ctx.fillStyle = getRGBA(inputs[i])
            ctx.fill()
        })
        // Draw outputs nodes
        outputs.forEach((_, i, outputs) => {
            const x = Visualizer.#getNodeX(left, right, outputs.length, i)
            ctx.beginPath()
            ctx.arc(x, top, (nodeRadius), 0, Math.PI * 2)
            ctx.fillStyle = 'black'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(x, top, (0.6* nodeRadius), 0, Math.PI * 2)
            ctx.fillStyle = getRGBA(outputs[i])
            ctx.fill()

            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2)
            ctx.strokeStyle = getRGBA(biases[i])
            ctx.stroke()

            if(isFinalOutput) {
                ctx.beginPath()
                ctx.fillStyle = 'black'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.strokeStyle = 'white'
                ctx.font= (nodeRadius * 1.5) + 'px Arial'
                ctx.fillText(symbols[i], x, top + nodeRadius*0.1)
                ctx.lineWidth = 0.5
                ctx.strokeText(symbols[i], x, top + nodeRadius*0.1)
            }

        })
    }

    static #getNodeX(left, right, nodesNr, i) {
        return lerp(
            left, 
            right, 
            nodesNr === 1 ? 0.5 : i / (nodesNr - 1)
        )
    }
}