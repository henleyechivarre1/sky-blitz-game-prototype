export interface PlayerProps {
  x: number
  y: number
}

export class Player {
  static draw(ctx: CanvasRenderingContext2D, { x, y }: PlayerProps) {
    // Main body
    ctx.fillStyle = "#4a4a4a"
    ctx.beginPath()
    ctx.moveTo(x, y - 20)
    ctx.lineTo(x - 15, y + 10)
    ctx.lineTo(x + 15, y + 10)
    ctx.closePath()
    ctx.fill()

    // Cockpit
    ctx.fillStyle = "#7fb2f0"
    ctx.beginPath()
    ctx.ellipse(x, y - 5, 5, 10, 0, 0, Math.PI * 2)
    ctx.fill()

    // Wings
    ctx.fillStyle = "#6a6a6a"
    ctx.beginPath()
    ctx.moveTo(x - 15, y + 10)
    ctx.lineTo(x - 25, y + 20)
    ctx.lineTo(x - 5, y + 15)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(x + 15, y + 10)
    ctx.lineTo(x + 25, y + 20)
    ctx.lineTo(x + 5, y + 15)
    ctx.closePath()
    ctx.fill()

    // Engine glow
    const gradient = ctx.createRadialGradient(x, y + 15, 0, x, y + 15, 10)
    gradient.addColorStop(0, "rgba(255, 100, 100, 1)")
    gradient.addColorStop(1, "rgba(255, 100, 100, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y + 15, 10, 0, Math.PI * 2)
    ctx.fill()
  }
}

