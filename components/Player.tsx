export interface PlayerProps {
  x: number;
  y: number;
  shieldHealth?: number;
}

export class Player {
  static draw(ctx: CanvasRenderingContext2D, { x, y, shieldHealth = 0 }: PlayerProps) {
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
    //Shiled
    if (shieldHealth > 0) {
      ctx.strokeStyle = `rgba(0, 200, 255, 0.5)`; // Light blue glow effect
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2); // Circular shield
      ctx.stroke();
    }
    //Hitbox for debugging purposes
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.arc(x, y, 20, 0, Math.PI * 2); // Match hitbox size (20px)
    // ctx.stroke();
  }
}

