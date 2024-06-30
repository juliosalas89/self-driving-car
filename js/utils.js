const lerp = (a, b, t) => a + (b - a) * t

const getIntersection = (A, B, C, D) => {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)
    
    const eps = 0.001
    const t = Math.abs(bottom) > eps  && (tTop / bottom) // the idea here is that bottom !== 0, but we can't trust floating point numbers
    const u = Math.abs(bottom) > eps && (uTop / bottom)
    const condition = t && u && t >= 0 && t <= 1 && u >= 0 && u <= 1
    
    return condition && {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t
    }
}

const polygonIntersects = (polygon1, polygon2) => {
    let intersects = false
    for (let i = 0; i < polygon1.length; i++) {
        const p11 = polygon1[i]
        const p12 = polygon1[(i + 1) % polygon1.length]
        for (let j = 0; j < polygon2.length; j++) {
            const p21 = polygon2[j]
            const p22 = polygon2[(j + 1) % polygon2.length]
            if (getIntersection(p11, p12, p21, p22)) {
                intersects = true
                break
            }
        }
    }
    return intersects
}

const getRGBA = (value) => {
    // opacity based on absolute value
    const alpha = Math.abs(value)
    // Red for negaitve values, Green for positive values
    const G = value < 0 ? 0 : 255
    const R = value > 0 ? 0 : 255
    return `rgba(${R},${G},0,${alpha})`
}