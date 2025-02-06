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

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 650

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
  const [player, setPlayer] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 50,
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
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Pause state

  useEffect(() => {
    if (!gameStarted) return; // Only attach input when the game starts

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (gameOver) return;
      const rect = canvas.getBoundingClientRect();
      setPlayer({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameStarted, gameOver]); // Reinitialize inputs when game starts

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

  const spawnEnemy = (enemyType: number) => {
    let baseHealth = 1;
    if (!gameStarted) return;

    // Increase enemy health based on score milestones
    if (score >= 100) {
      baseHealth =
        enemyType === 1 ? 1 : enemyType === 2 ? 3 : enemyType === 3 ? 2 : 4;
    } else if (score >= 300) {
      baseHealth =
        enemyType === 1 ? 2 : enemyType === 2 ? 3 : enemyType === 3 ? 4 : 6;
    } else if (score >= 500) {
      baseHealth =
        enemyType === 1 ? 3 : enemyType === 2 ? 5 : enemyType === 3 ? 6 : 7;
    } else {
      baseHealth =
        enemyType === 1 ? 1 : enemyType === 2 ? 2 : enemyType === 3 ? 2 : 3; // Default health
    }

    const newEnemy: Enemy = {
      x: Math.random() * CANVAS_WIDTH,
      y: 0,
      type: enemyType,
      health: baseHealth,
      speed: enemyType === 3 ? 2 : enemyType === 1 ? 1 : 0.5,
    };

    setEnemies((prev) => [...prev, newEnemy]);
  };

  const backButton = () => {
    setPlayer({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
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

  const checkPlayerHit = (enemyIndex: number) => {
    if (shieldHealth > 0) {
      setShieldHealth((prev) => prev - 1); // Reduce shield health by 1

      if (shieldHealth - 1 <= 0) {
        setShieldHealth(0); // Shield disappears when hit 3 times
      }
    } else {
      // If shield is already gone, destroy the enemy
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
    setBulletCount(6); // Increase bullets
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
    for (let i = 0; i < bulletCount; i++) {
      newLasers.push({
        x: player.x - i * 10 + bulletCount * 5,
        y: player.y - 20,
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
    setPlayer({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
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

    if (score >= 100 && !unlockedTypes.includes(2))
      setUnlockedTypes((prev) => [...prev, 2]); // Unlock Type 2
    if (score >= 200 && !unlockedTypes.includes(3))
      setUnlockedTypes((prev) => [...prev, 3]); // Unlock Type 3
    if (score >= 300 && !unlockedTypes.includes(4))
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
          .filter((powerUp) => powerUp.y < CANVAS_HEIGHT) // Remove when off-screen
    );

    setEnemies((prev) =>
      prev
        .map((enemy) => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const vx = (dx / distance) * enemy.speed;
          const vy = (dy / distance) * enemy.speed;

          // Updated Enemy Position
          const updatedEnemy: Enemy = {
            ...enemy,
            x: enemy.x + vx,
            y: enemy.y + vy,
          };

          if (
            shieldHealth > 0 &&
            Math.abs(updatedEnemy.x - player.x) < 35 &&
            Math.abs(updatedEnemy.y - player.y) < 35
          ) {
            setShieldHealth((prev) => Math.max(0, prev - 1)); // Reduce shield health by 1
            createExplosion(updatedEnemy.x, updatedEnemy.y); // Explosion effect
            return null; // Mark for removal
          }

          // Collision with Player (Only if Shield is Gone)
          if (
            shieldHealth <= 0 &&
            Math.abs(updatedEnemy.x - player.x) < 35 &&
            Math.abs(updatedEnemy.y - player.y) < 35
          ) {
            setGameOver(true);
            createExplosion(player.x, player.y);
            return null; // Mark for removal
          }

          return updatedEnemy; // Enemy keeps moving if no collision
        })
        .filter((enemy): enemy is Enemy => enemy !== null) // Remove null values safely
        .filter(
          (enemy) =>
            enemy.x >= 0 &&
            enemy.x <= CANVAS_WIDTH &&
            enemy.y >= 0 &&
            enemy.y <= CANVAS_HEIGHT
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
            if (enemy.type === 1 && Math.random() < 0.01) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }
            if (enemy.type === 2 && Math.random() < 0.02) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }
            if (enemy.type === 3 && Math.random() < 0.03) {
              spawnPowerUp(enemy.x, enemy.y); // Spawn power-up where enemy dies
            }
            if (enemy.type === 4 && Math.random() < 0.04) {
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
        Math.abs(enemy.x - player.x) < PLAYER_HITBOX_SIZE  && Math.abs(enemy.y - player.y) < PLAYER_HITBOX_SIZE 
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
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Points: ${score}`, 10, 30);

      powerUps.forEach((powerUp) => {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText("P", powerUp.x - 4, powerUp.y + 4);
      });

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
        ctx.font = "24px Arial";
        ctx.fillText(
          `Final Score: ${score}`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2
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
            <div className="gameSceneCanvasHW">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-700 cursor-none"
              />
            </div>

            {gameOver && (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/80">
                <h2 className="text-white text-3xl font-bold mb-4">
                  Game Over
                </h2>

                <Button
                  onClick={resetGame}
                  className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white font-bold rounded mb-2"
                >
                  Restart Game
                </Button>

                <Button
                  onClick={() => {
                    backButton();
                  }}
                  className="px-6 py-3 text-lg bg-gray-500 hover:bg-gray-600 text-white font-bold rounded"
                >
                  Back to Home
                </Button>
              </div>
            )}
            {isPaused && (
              <div className="pause-menu">
                <h2>Game Paused</h2>
                <button onClick={() => setIsPaused(false)}>Resume</button>
                <button
                  onClick={() => {
                    backButton();
                  }}
                >
                  Quit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

