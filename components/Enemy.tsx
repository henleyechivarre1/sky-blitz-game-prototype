export interface Enemy {
  x: number
  y: number
  type: number
  health: number
  speed: number
}

export class Enemy {
  static draw(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    switch (enemy.type) {
      case 1:
        this.drawType1(ctx, enemy)
        break
      case 2:
        this.drawType2(ctx, enemy)
        break
      case 3:
        this.drawType3(ctx, enemy)
        break
      case 4:
        this.drawType4(ctx, enemy)
        break
    }
  }

  private static drawType1(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Cyclops monster
    ctx.fillStyle = "#ff4136"
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Eye
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y - 5, 10, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y - 5, 5, 0, Math.PI * 2)
    ctx.fill()

    // Mouth
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y + 10, 8, 0, Math.PI)
    ctx.stroke()
  }

  private static drawType2(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Tentacle monster
    ctx.fillStyle = "#ff851b"

    // Body
    ctx.beginPath()
    ctx.ellipse(enemy.x, enemy.y, 15, 20, 0, 0, Math.PI * 2)
    ctx.fill()

    // Tentacles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const length = 15 + Math.sin(Date.now() / 200 + i) * 5
      ctx.beginPath()
      ctx.moveTo(enemy.x, enemy.y)
      ctx.quadraticCurveTo(
        enemy.x + Math.cos(angle) * 10,
        enemy.y + Math.sin(angle) * 10,
        enemy.x + Math.cos(angle) * length,
        enemy.y + Math.sin(angle) * length,
      )
      ctx.stroke()
    }

    // Eyes
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(enemy.x - 5, enemy.y - 5, 5, 0, Math.PI * 2)
    ctx.arc(enemy.x + 5, enemy.y - 5, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(enemy.x - 5, enemy.y - 5, 2, 0, Math.PI * 2)
    ctx.arc(enemy.x + 5, enemy.y - 5, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  private static drawType3(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Alien insectoid
    ctx.fillStyle = "#39cccc"

    // Body
    ctx.beginPath()
    ctx.moveTo(enemy.x, enemy.y - 20)
    ctx.lineTo(enemy.x - 15, enemy.y)
    ctx.lineTo(enemy.x - 10, enemy.y + 15)
    ctx.lineTo(enemy.x + 10, enemy.y + 15)
    ctx.lineTo(enemy.x + 15, enemy.y)
    ctx.closePath()
    ctx.fill()

    // Eyes
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(enemy.x - 8, enemy.y - 10, 4, 0, Math.PI * 2)
    ctx.arc(enemy.x + 8, enemy.y - 10, 4, 0, Math.PI * 2)
    ctx.fill()

    // Antennae
    ctx.strokeStyle = "#39cccc"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(enemy.x - 5, enemy.y - 18)
    ctx.lineTo(enemy.x - 10, enemy.y - 25)
    ctx.moveTo(enemy.x + 5, enemy.y - 18)
    ctx.lineTo(enemy.x + 10, enemy.y - 25)
    ctx.stroke()
  }

  private static drawType4(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Shielded blob monster
    ctx.fillStyle = "#2ecc40"

    // Body (pulsating blob)
    const pulsate = Math.sin(Date.now() / 200) * 2
    ctx.beginPath()
    ctx.ellipse(enemy.x, enemy.y, 20 + pulsate, 25 + pulsate, 0, 0, Math.PI * 2)
    ctx.fill()

    // Eyes
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(enemy.x - 8, enemy.y - 5, 6, 0, Math.PI * 2)
    ctx.arc(enemy.x + 8, enemy.y - 5, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(enemy.x - 8, enemy.y - 5, 3, 0, Math.PI * 2)
    ctx.arc(enemy.x + 8, enemy.y - 5, 3, 0, Math.PI * 2)
    ctx.fill()

    // Mouth
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y + 10, 10, 0, Math.PI, false)
    ctx.stroke()

    // Shield effect
    if (enemy.health > 0) {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.5)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(enemy.x, enemy.y, 30, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}

