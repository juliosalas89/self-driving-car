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