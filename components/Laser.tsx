export interface Laser {
  x: number
  y: number
}

export class Laser {
  static draw(ctx: CanvasRenderingContext2D, { x, y }: Laser) {
    const gradient = ctx.createLinearGradient(x, y, x, y - 20)
    gradient.addColorStop(0, "rgba(255, 0, 0, 0)")
    gradient.addColorStop(0.5, "rgba(255, 0, 0, 1)")
    gradient.addColorStop(1, "rgba(255, 255, 0, 1)")

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - 20)
    ctx.stroke()

    // Glow effect
    ctx.strokeStyle = "rgba(255, 255, 0, 0.5)"
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - 20)
    ctx.stroke()
  }
}

