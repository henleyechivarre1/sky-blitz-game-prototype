export interface Laser {
  x: number
  y: number
}

export class Laser {
  static draw(ctx: CanvasRenderingContext2D, { x, y }: Laser) {
    // Create a sharp, glowing red laser gradient
    const gradient = ctx.createLinearGradient(x, y, x, y - 30);
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)"); // Start with intense red
    gradient.addColorStop(0.5, "rgba(255, 0, 0, 1)"); // Full red intensity in the middle
    gradient.addColorStop(1, "rgba(255, 100, 100, 0.6)"); // Light red fade at the end

    // Draw the laser line with gradient effect
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2; // Sharper, thinner laser line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20); // Increased length for more dramatic effect
    ctx.stroke();

    // Adding a glowing red effect to enhance the laser feel
    const glowGradient = ctx.createLinearGradient(x, y, x, y - 30);
    glowGradient.addColorStop(0, "rgba(255, 100, 100, 0.5)"); // Red glow
    glowGradient.addColorStop(1, "rgba(255, 100, 100, 0.1)"); // Fade at the end

    ctx.strokeStyle = glowGradient;
    ctx.lineWidth = 6; // Glow effect is thicker
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 30); // Same length as the laser
    ctx.stroke();
  }
}