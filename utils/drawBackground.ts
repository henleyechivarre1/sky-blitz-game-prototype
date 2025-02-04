export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Create a starfield
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, "#000033")
  gradient.addColorStop(1, "#000066")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add stars
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 2
    const opacity = Math.random()

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.fill()
  }

  // Add a nebula effect
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 100 + 50
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, "rgba(255, 0, 255, 1)")
    gradient.addColorStop(1, "rgba(0, 0, 255, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

