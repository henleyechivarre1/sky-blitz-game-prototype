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
        this.drawType1(ctx, enemy);
        break;
      case 2:
        this.drawType2(ctx, enemy);
        break;
      case 3:
        this.drawType3(ctx, enemy);
        break;
      case 4:
        this.drawType4(ctx, enemy);
        break;
    }
  }

  private static drawType1(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Flying Saucer Body (Flat disk)
    ctx.fillStyle = "#3498db"; // Blue spaceship body
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2); // Full circle for the saucer
    ctx.fill();

    // Cockpit (Small circle at the bottom of the saucer)
    ctx.fillStyle = "#7fb2f0"; // Lighter blue for the cockpit
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y + 10, 7, 0, Math.PI * 2); // Cockpit positioned at the bottom center
    ctx.fill();

    // Engines (Two small circles at the top of the flying saucer)
    ctx.fillStyle = "#e74c3c"; // Red for the engine glow
    ctx.beginPath();
    ctx.arc(enemy.x - 12, enemy.y - 18, 5, 0, Math.PI * 2); // Left engine
    ctx.arc(enemy.x + 12, enemy.y - 18, 5, 0, Math.PI * 2); // Right engine
    ctx.fill();

    // Engine Glow (Faded red for the engine glow effect)
    const gradient = ctx.createRadialGradient(
      enemy.x,
      enemy.y - 18,
      0,
      enemy.x,
      enemy.y - 18,
      10
    );
    gradient.addColorStop(0, "rgba(231, 76, 60, 0.8)");
    gradient.addColorStop(1, "rgba(231, 76, 60, 0.2)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y - 18, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawType2(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Triangle-Shaped Spaceship Body (Facing Down)
    ctx.fillStyle = "#1abc9c"; // Light teal color for the spaceship body
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + 20); // Tip of the spaceship (now at the bottom)
    ctx.lineTo(enemy.x - 20, enemy.y - 20); // Left top corner
    ctx.lineTo(enemy.x + 20, enemy.y - 20); // Right top corner
    ctx.closePath();
    ctx.fill();

    // Cockpit (Small circle at the bottom of the spaceship)
    ctx.fillStyle = "#7fb2f0"; // Lighter blue for the cockpit
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y + 18, 6, 0, Math.PI * 2); // Positioned at the bottom tip of the spaceship
    ctx.fill();

    // Engines (Two small circles at the top of the spaceship)
    ctx.fillStyle = "#e74c3c"; // Red for the engine glow
    ctx.beginPath();
    ctx.arc(enemy.x - 12, enemy.y - 18, 6, 0, Math.PI * 2); // Left engine
    ctx.arc(enemy.x + 12, enemy.y - 18, 6, 0, Math.PI * 2); // Right engine
    ctx.fill();

    // Engine Glow (Faded red for the engine glow effect)
    const gradient = ctx.createRadialGradient(
      enemy.x,
      enemy.y - 18,
      0,
      enemy.x,
      enemy.y - 18,
      10
    );
    gradient.addColorStop(0, "rgba(231, 76, 60, 0.8)");
    gradient.addColorStop(1, "rgba(231, 76, 60, 0.2)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y - 18, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  private static drawType3(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Stealth or Hidden Spaceship (Darker Color)
    ctx.fillStyle = "#2c3e50"; // Darker gray/black for a stealthy spaceship

    // Body (Angular, stealthy design facing down)
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + 20); // Bottom point of the spaceship
    ctx.lineTo(enemy.x - 18, enemy.y); // Left side
    ctx.lineTo(enemy.x - 12, enemy.y - 12); // Left top
    ctx.lineTo(enemy.x + 12, enemy.y - 12); // Right top
    ctx.lineTo(enemy.x + 18, enemy.y); // Right side
    ctx.closePath();
    ctx.fill();

    // Eyes (Dark stealthy eyes, positioned at the bottom)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(enemy.x - 6, enemy.y + 8, 3, 0, Math.PI * 2); // Left eye
    ctx.arc(enemy.x + 6, enemy.y + 8, 3, 0, Math.PI * 2); // Right eye
    ctx.fill();

    // Antennae (Subtle antennas)
    ctx.strokeStyle = "#34495e"; // A little lighter than the body
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(enemy.x - 6, enemy.y + 18); // Antenna left
    ctx.lineTo(enemy.x - 12, enemy.y + 25);
    ctx.moveTo(enemy.x + 6, enemy.y + 18); // Antenna right
    ctx.lineTo(enemy.x + 12, enemy.y + 25);
    ctx.stroke();
  }

  private static drawType4(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    // Rectangular Tank-like Spaceship (Darker, mean look)
    ctx.fillStyle = "#2c3e50"; // Dark metallic color for a tougher look

    // Rectangular Body (Tank-like, angular design facing down)
    ctx.beginPath();
    ctx.moveTo(enemy.x - 30, enemy.y + 20); // Left side of the rectangle
    ctx.lineTo(enemy.x + 30, enemy.y + 20); // Right side of the rectangle
    ctx.lineTo(enemy.x + 30, enemy.y - 20); // Top right corner
    ctx.lineTo(enemy.x - 30, enemy.y - 20); // Top left corner
    ctx.closePath();
    ctx.fill();

    // Cockpit (Small circular cockpit at the bottom center of the rectangle)
    ctx.fillStyle = "#e74c3c"; // Red for the cockpit
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y + 18, 8, 0, Math.PI * 2); // Positioned near the bottom center
    ctx.fill();

    // Eyes (Menacing glowing eyes)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(enemy.x - 10, enemy.y + 8, 4, 0, Math.PI * 2); // Left eye
    ctx.arc(enemy.x + 10, enemy.y + 8, 4, 0, Math.PI * 2); // Right eye
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(enemy.x - 10, enemy.y + 8, 2, 0, Math.PI * 2); // Left pupil
    ctx.arc(enemy.x + 10, enemy.y + 8, 2, 0, Math.PI * 2); // Right pupil
    ctx.fill();

    // Optional: You can add some lines or patterns for a more industrial look
    ctx.strokeStyle = "#7f8c8d"; // Lighter metallic details
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(enemy.x - 10, enemy.y - 18); // Details for a mechanical look
    ctx.lineTo(enemy.x + 10, enemy.y - 18);
    ctx.stroke();
  }
}

