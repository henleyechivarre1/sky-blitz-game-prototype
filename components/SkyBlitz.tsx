"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Player } from "./Player"
import { Enemy } from "./Enemy"
import { Laser } from "./Laser"
import { useGameLoop } from "../hooks/useGameLoop"
import { Button } from "@/components/ui/button"
import GameStart from "./pages/GameStart"
import "./scss/GameScene.scss";

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface PowerUp {
  x: number;
  y: number;
  active: boolean;
}


export const SkyBlitz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 600, // "Phone-like" width
    height: window.innerHeight, // Full screen height
  });
  const [player, setPlayer] = useState({
    x: canvasSize.width / 2,
    y: canvasSize.height - 50,
  });
  const SHOOT_INTERVAL = 100;
  const PLAYER_HITBOX_SIZE = 15;
  const lastShotTime = useRef(0);
  const gameStartTime = useRef(performance.now()); // Track game start time
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const powerUpTimer = useRef<NodeJS.Timeout | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [unlockedTypes, setUnlockedTypes] = useState([1]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [bulletCount, setBulletCount] = useState(1);
  const [shieldHealth, setShieldHealth] = useState(0);
  const [upgradeBulletCount, setUpgradeBulletCount] = useState(1);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [scoreThreshold, setScoreThreshold] = useState(100);
  const [points, setPoints] = useState(1000);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const enemyHitboxSize = 40;

  useEffect(() => {
    if (!gameStarted) return; // Only attach input when the game starts

    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMouseDown = false; // Flag to track if the mouse button is held down

    const handleMouseDown = () => {
      isMouseDown = true; // Start moving when mouse is held down
    };

    const handleMouseUp = () => {
      isMouseDown = false; // Stop moving when mouse is released
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameOver || !isMouseDown) return; // Move only when mouse is held down

      const rect = canvas.getBoundingClientRect();

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        x: e.clientX - rect.left, // Update x position
        y: prevPlayer.y, // Keep y fixed
      }));
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameStarted, gameOver, player.y]); // Ensure y remains unchanged

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setCanvasSize({
          width: 600, // Keep the width fixed
          height: window.innerHeight, // Always take full height
        });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  //Pause functionality
  useEffect(() => {
    // Add event listener for ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => !prev); // Toggle pause on ESC
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Clean up listener on component unmount
    };
  }, []);

  useEffect(() => {
    if (score >= scoreThreshold) {
      setLevel((prevLevel) => prevLevel + 1);
      setScore(0); // Reset score for the next level
      setScoreThreshold((prevThreshold) => prevThreshold + 100);
    }
  }, [score]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!gameOver) {
  //       shootLaser();
  //     }
  //   }, 1000); // Fires every 1000ms (1 second)

  //   return () => clearInterval(interval);
  // }, [gameOver]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   let isHolding = false;

  //   const handleMouseDown = (e: MouseEvent) => {
  //     if (gameOver) return;
  //     isHolding = true;
  //     updatePlayerPosition(e);
  //   };

  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (gameOver || !isHolding) return;
  //     updatePlayerPosition(e);
  //   };

  //   const handleMouseUp = () => {
  //     isHolding = false;
  //   };

  //   const updatePlayerPosition = (e: MouseEvent) => {
  //     const rect = canvas.getBoundingClientRect();
  //     setPlayer({
  //       x: e.clientX - rect.left,
  //       y: e.clientY - rect.top,
  //     });
  //   };

  //   canvas.addEventListener("mousedown", handleMouseDown);
  //   canvas.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp); // Attach to document to detect release even outside canvas

  //   return () => {
  //     canvas.removeEventListener("mousedown", handleMouseDown);
  //     canvas.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [gameOver]);

  const getEnemyHealth = (level: number, enemyType: number) => {
    // Base health per enemy type at Level 1
    const baseHealth =
      enemyType === 1
        ? 3 // Type 1 starts with 2 HP
        : enemyType === 2
        ? 5 // Type 2 starts with 3 HP
        : enemyType === 3
        ? 2 // Type 3 starts with 1 HP
        : 10; // Type 4 starts with 8 HP (Tankiest enemy)

    // Level scaling factor (increases every 10 levels)
    const levelFactor = Math.floor(level / 10);

    // Enemy type multiplier (controls how much health increases per 10 levels)
    const typeMultiplier =
      enemyType === 1
        ? 2 // Type 1 increases moderately
        : enemyType === 2
        ? 3 // Type 2 increases faster
        : enemyType === 3
        ? 1 // Type 3 increases slowly
        : 4; // Type 4 scales the hardest

    // Final health calculation
    return baseHealth + levelFactor * typeMultiplier;
  };

  const spawnEnemy = (enemyType: number) => {
    if (!gameStarted) return;

    const newEnemy: Enemy = {
      x: Math.random() * canvasSize.width,
      y: 0,
      type: enemyType,
      health: getEnemyHealth(level, enemyType),
      speed: enemyType === 3 ? 2 : enemyType === 1 ? 1 : 0.5,
    };

    setEnemies((prev) => [...prev, newEnemy]);
  };

  const backButton = () => {
    setPlayer({ x: canvasSize.width / 2, y: canvasSize.height - 50 });
    setEnemies([]);
    setLasers([]);
    setParticles([]);
    setGameOver(false);
    setUnlockedTypes([1]);
    setScore(0);
    setBulletCount(upgradeBulletCount); // Reset bullets to default
    setPowerUps([]);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    gameStartTime.current = performance.now();
  };

  const spawnPowerUp = (x: number, y: number) => {
    setPowerUps((prev) => [...prev, { x, y, active: true }]);
  };

  const upgradeBullets = () => {
    setUpgradeBulletCount((prev) => prev + 2);
    setBulletCount((prev) => prev + 2);
  };
  const onUpgradeShield = () => {
    setShieldHealth(5); // Set shield health to full (5 hits)
  };

  const checkPlayerHit = (enemy: Enemy, enemyIndex: number) => {
    const hitboxSize = 35; // Adjusted for more accurate hit detection
    const isColliding =
      Math.abs(enemy.x - player.x) < hitboxSize &&
      Math.abs(enemy.y - player.y) < hitboxSize;

    if (isColliding) {
      if (shieldHealth > 0) {
        setShieldHealth((prev) => prev - 1); // Reduce shield by 1
        createExplosion(enemy.x, enemy.y); // Explosion effect when shield absorbs hit

        // If shield is fully depleted, remove it
        if (shieldHealth - 1 <= 0) {
          setShieldHealth(0);
        }
      } else {
        // No shield? Game over!
        setGameOver(true);
        createExplosion(player.x, player.y);
      }

      // Remove the enemy after collision
      setEnemies((prevEnemies) =>
        prevEnemies.filter((_, i) => i !== enemyIndex)
      );
    }
  };

  const checkPowerUpCollection = () => {
    setPowerUps((prev) =>
      prev.filter((powerUp) => {
        const collected =
          Math.abs(powerUp.x - player.x) < 20 &&
          Math.abs(powerUp.y - player.y) < 20;

        if (collected) {
          activatePowerUp();
        }

        return !collected; // Remove power-up if collected
      })
    );
  };

  const activatePowerUp = () => {
    setBulletCount(5); // Increase bullets
    // If a timer already exists, clear it first (reset instead of adding)
    if (powerUpTimer.current) {
      clearTimeout(powerUpTimer.current);
    }
    // Start a new timer (resets duration)
    powerUpTimer.current = setTimeout(() => {
      setBulletCount(upgradeBulletCount); // Revert to 1 bullet after 10 seconds
    }, 10000);
  };

  const shootLaser = () => {
    const newLasers: { x: number; y: number }[] = [];
    const bulletSpacing = 10;
    for (let i = 0; i < bulletCount; i++) {
      // Adjust the x position to spread the bullets evenly, centered around the player
      const laserX =
        player.x - ((bulletCount - 1) * bulletSpacing) / 2 + i * bulletSpacing;

      newLasers.push({
        x: laserX, // Adjusted x position
        y: player.y - 20, // Spawn slightly above the player
      });
    }

    setLasers((prev) => [...prev, ...newLasers]);
  };

  const createExplosion = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random() * 20 + 10,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const resetGame = () => {
    setPlayer({ x: canvasSize.width / 2, y: canvasSize.height - 50 });
    setEnemies([]);
    setLasers([]);
    setParticles([]);
    setGameOver(false);
    setUnlockedTypes([1]);
    setScore(0);
    setBulletCount(upgradeBulletCount); // Reset bullets to default
    setPowerUps([]);
    gameStartTime.current = performance.now();
  };

  useGameLoop(() => {
    if (gameOver || isPaused) return;

    const currentTime = performance.now();
    const elapsedTime = currentTime - gameStartTime.current; // Time since game started

    if (level >= 2 && !unlockedTypes.includes(2))
      setUnlockedTypes((prev) => [...prev, 2]); // Unlock Type 2
    if (level >= 3 && !unlockedTypes.includes(3))
      setUnlockedTypes((prev) => [...prev, 3]); // Unlock Type 3
    if (level >= 4 && !unlockedTypes.includes(4))
      setUnlockedTypes((prev) => [...prev, 4]); // Unlock Type 4

    // === Spawn Enemy Based on Unlocked Types ===
    if (Math.random() < 0.02) {
      const enemyType =
        unlockedTypes[Math.floor(Math.random() * unlockedTypes.length)];
      spawnEnemy(enemyType);
    }
    if (currentTime - lastShotTime.current >= SHOOT_INTERVAL) {
      shootLaser();
      lastShotTime.current = currentTime;
    }

    checkPowerUpCollection(); // Check if the player collects a power-up

    setPowerUps(
      (prev) =>
        prev
          .map((powerUp) => ({
            ...powerUp,
            y: powerUp.y + 0.8, // Power-up falls down at speed 2
          }))
          .filter((powerUp) => powerUp.y < canvasSize.height) // Remove when off-screen
    );

    setEnemies((prev) =>
      prev
        .map((enemy, index) => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let vx = (dx / distance) * enemy.speed;
          let vy = (dy / distance) * enemy.speed;

          // Apply movement patterns based on enemy type
          if (enemy.type === 2) {
            // **Type 2: Zigzag Pattern (Shorter Movements)**
            vx += Math.sin(enemy.y / 15) * 2; // Reduced width (from 3 to 2) and frequency adjusted
          } else if (enemy.type === 3 && Math.random() < 0.3) {
            vx += (Math.random() - 0.5) * 5; // Adjusted randomness
          } else if (enemy.type === 4 && Math.random() < 0.1) {
            vx = (dx / distance) * enemy.speed * 2;
          }

          const updatedEnemy = {
            ...enemy,
            x: enemy.x + vx,
            y: enemy.y + vy,
          };

          // **Check for collision with player**
          checkPlayerHit(updatedEnemy, index);

          return updatedEnemy;
        })
        .filter(
          (enemy) =>
            enemy.x >= 0 &&
            enemy.x <= canvasSize.width &&
            enemy.y >= 0 &&
            enemy.y <= canvasSize.height
        )
    );

    setLasers((prev) =>
      prev
        .map((laser) => ({
          ...laser,
          y: laser.y - 5,
        }))
        .filter((laser) => laser.y > 0)
    );

    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0)
    );

    // Collision detection
    setEnemies((prev) => {
      let enemiesDefeated: Enemy[] = []; // Track defeated enemies

      const updatedEnemies = prev
        .map((enemy) => {
          const hitByLaser = lasers.some(
            (laser) =>
              Math.abs(laser.x - enemy.x) < 25 &&
              Math.abs(laser.y - enemy.y) < 25
          );

          if (hitByLaser) {
            setLasers((prev) =>
              prev.filter(
                (laser) =>
                  !(
                    Math.abs(laser.x - enemy.x) < 25 &&
                    Math.abs(laser.y - enemy.y) < 25
                  )
              )
            );
            // Power-Up Chance (Only for Type 4 Enemies)
            if (enemy.type === 1 && Math.random() < 0) {
              // nothing spawns for type 1 enemies
            }
            if (enemy.type === 2 && Math.random() < 0.01) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }
            if (enemy.type === 3 && Math.random() < 0.02) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }
            if (enemy.type === 4 && Math.random() < 0.05) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }

            createExplosion(enemy.x, enemy.y);
            return { ...enemy, health: enemy.health - 1 };
          }
          return enemy;
        })
        .filter((enemy) => {
          if (enemy.health <= 0) {
            enemiesDefeated.push(enemy); // Store defeated enemies for accurate score tracking
            return false; // Remove enemy
          }
          return true;
        });

      // Compute total score increase based on defeated enemies
      if (enemiesDefeated.length > 0) {
        const totalScoreIncrease = enemiesDefeated.reduce((total, enemy) => {
          return (
            total +
            (enemy.type === 1
              ? 1
              : enemy.type === 2
              ? 2
              : enemy.type === 3
              ? 3
              : 5)
          );
        }, 0);

        setScore((prev) => prev + totalScoreIncrease); // Update score only once
        setPoints((prev) => prev + totalScoreIncrease);
      }
      return updatedEnemies;
    });

    // Check for game over
   const playerHit = enemies.some(
     (enemy) =>
       Math.abs(enemy.x - player.x) < PLAYER_HITBOX_SIZE &&
       Math.abs(enemy.y - player.y) < PLAYER_HITBOX_SIZE
   );

   if (playerHit) {
     setGameOver(true);
     createExplosion(player.x, player.y);
   }


    // Update score
    setScore(
      (prev) => prev + enemies.filter((enemy) => enemy.health <= 0).length
    );

    // Render game
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      // drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT)
      Player.draw(ctx, {
        x: player.x,
        y: player.y,
        shieldHealth: shieldHealth || 0,
      });
      enemies.forEach((enemy) => Enemy.draw(ctx, enemy));
      lasers.forEach((laser) => Laser.draw(ctx, laser));

      // Draw particles
      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, ${
          Math.floor(Math.random() * 200) + 50
        }, 0, ${particle.life / 30})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Points Text with Sci-Fi Glow
      ctx.fillStyle = "white";
      ctx.font = "bold 22px 'Orbitron', Arial"; // Sci-fi font for a game-like feel
      ctx.textAlign = "left";
      ctx.shadowColor = "cyan"; // Neon glow effect
      ctx.shadowBlur = 10;
      ctx.fillText(`⚡ Points: ${score}`, 20, 40); // Positioned at the top-left
      ctx.shadowBlur = 0; // Reset shadow effect

      powerUps.forEach((powerUp) => {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText("P", powerUp.x - 4, powerUp.y + 4);
      });

      ctx.fillStyle = "white";
      const centerX = canvasSize.width - 60; // 60px from the right
      const centerY = 60; // 60px from the top
      const radius = 40;
      // Calculate progress percentage
      const progressPercentage = Math.min(score / scoreThreshold, 1); // Cap at 100%
      const progressAngle = progressPercentage * 2 * Math.PI;
      // Background Circle
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Progress Arc
      // Progress Circle (Neon Effect)
      ctx.strokeStyle = "rgba(255, 215, 0, 0.9)"; // Bright gold with transparency
      ctx.lineWidth = 12;
      ctx.lineCap = "round"; // Makes progress bar edges smooth
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + progressAngle
      );
      ctx.stroke();

      // Outer Glow for Extra Effect
      ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + progressAngle
      );
      ctx.stroke();

      // Level Text with Futuristic Font
      ctx.fillStyle = "white";
      ctx.font = "bold 22px 'Orbitron', Arial"; // Use Orbitron for a sci-fi look
      ctx.textAlign = "center";
      ctx.shadowColor = "gold"; // Glow effect
      ctx.shadowBlur = 15;
      ctx.fillText(`Lv ${level}`, centerX, centerY + 5);
      ctx.shadowBlur = 0; // Reset shadow

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "GAME OVER",
          canvasSize.width / 2,
          canvasSize.height / 2 - 50
        );
        ctx.font = "24px Arial";
        ctx.fillText(
          `Final Score: ${score}`,
          canvasSize.width / 2,
          canvasSize.height / 2
        );
      }
    }
  });

  return (
    <div className="gameSceneContainer">
      <div className="gameSceneMain">
        {!gameStarted ? (
          <div>
            <GameStart
              onStart={() => {
                setGameOver(false); // Reset gameOver before starting
                setGameStarted(true); // Start the game
              }}
              onUpgradeBullets={upgradeBullets}
              onUpgradeShield={onUpgradeShield}
              score={points}
              setScore={setPoints}
              shieldHealth={shieldHealth} // Pass current shield health
              setShieldHealth={setShieldHealth}
            />
          </div>
        ) : (
          <div className="gameSceneCanvas">
            <div className="canvas-container">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="game-canvas"
              />
            </div>

            {gameOver && (
              <div className="game-over-screen">
                <h2 className="game-over-title">☠ GAME OVER ☠</h2>

                <p className="game-over-score">Final Score: {score}</p>

                <div className="game-over-buttons">
                  <button className="game-over-btn restart" onClick={resetGame}>
                    🔄 Restart Game
                  </button>
                  <button className="game-over-btn home" onClick={backButton}>
                    🏠 Back to Home
                  </button>
                </div>
              </div>
            )}
            {isPaused && (
              <div className="pause-menu">
                <div className="pause-content">
                  <h2 className="pause-title">⏸ Game Paused</h2>

                  <div className="pause-buttons">
                    <button
                      className="pause-btn resume"
                      onClick={() => setIsPaused(false)}
                    >
                      ▶ Resume
                    </button>
                    <button className="pause-btn quit" onClick={backButton}>
                      ⏹ Quit to Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

