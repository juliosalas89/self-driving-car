class NeuralNetwork {
    // Neuron Counts is an array of number of nodes in each layer
    constructor (neuronCounts) {
        this.levels = []
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))
        }
    }

    static feedForward (inputs, network) {
        let outputs = null
        for (let i = 0; i < network.levels.length; i++) {
            outputs = Level.feedForward((i ? outputs : inputs), network.levels[i])
        }
        return outputs
    }

    static mutate (network, mutationRate = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    mutationRate
                )
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        mutationRate
                    )
                }
            }
        })
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        this.biases = new Array(outputCount)
        // Every input is connected to every output, so we need a 2D array
        this.weights = []
        for (let i = 0; i < inputCount; i++) {
            this.weights.push(new Array(outputCount))
        }
        Level.#randomize(this)
    }

    static #randomize(level) {
        for (let i =0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1
            }
        }
        for(let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1
        }
    }

    static feedForward (inputs, level) {
        for(let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = inputs[i]
        }
        for(let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            level.inputs.forEach((input, j) => {
                sum += input * level.weights[j][i]
            })
            level.outputs[i] = sum > level.biases[i] ? 1 : 0
        }
        return level.outputs
    }
}