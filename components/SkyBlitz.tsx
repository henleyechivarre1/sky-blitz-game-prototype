"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Player } from "./Player"
import { Enemy } from "./Enemy"
import { Laser } from "./Laser"
import { useGameLoop } from "../hooks/useGameLoop"
import { drawBackground } from "../utils/drawBackground"
import { Button } from "@/components/ui/button"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export const SkyBlitz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [player, setPlayer] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 })
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [lasers, setLasers] = useState<Laser[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      if (gameOver) return
      const rect = canvas.getBoundingClientRect()
      setPlayer({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    return () => canvas.removeEventListener("mousemove", handleMouseMove)
  }, [gameOver])

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


  const spawnEnemy = () => {
    const enemyType = Math.floor(Math.random() * 4) + 1
    const newEnemy: Enemy = {
      x: Math.random() * CANVAS_WIDTH,
      y: 0,
      type: enemyType,
      health: enemyType === 2 ? 3 : enemyType === 4 ? 3 : 1,
      speed: enemyType === 3 ? 2 : enemyType === 1 ? 1 : 0.5,
    }
    setEnemies((prev) => [...prev, newEnemy])
  }

  const shootLaser = () => {
    const newLaser: Laser = { x: player.x, y: player.y - 20 }
    // setInterval(() => {
    //   // if (!gameOver) {
    //   setLasers((prev) => [...prev, newLaser])
    //   // }
    // }, 1000); // Fires every 1000ms (1 second
    setLasers((prev) => [...prev, newLaser])
  }

  const createExplosion = (x: number, y: number) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 2 + 1
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random() * 20 + 10,
      })
    }
    setParticles((prev) => [...prev, ...newParticles])
  }

  const resetGame = () => {
    setPlayer({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 })
    setEnemies([])
    setLasers([])
    setParticles([])
    setScore(0)
    setGameOver(false)
  }

  useGameLoop(() => {
    if (gameOver) return

    if (Math.random() < 0.02) spawnEnemy()
    if (Math.random() < 0.1) shootLaser()

    setEnemies((prev) =>
      prev
        .map((enemy) => {
          const dx = player.x - enemy.x
          const dy = player.y - enemy.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const vx = (dx / distance) * enemy.speed
          const vy = (dy / distance) * enemy.speed

          return {
            ...enemy,
            x: enemy.x + vx,
            y: enemy.y + vy,
          }
        })
        .filter((enemy) => enemy.x >= 0 && enemy.x <= CANVAS_WIDTH && enemy.y >= 0 && enemy.y <= CANVAS_HEIGHT),
    )

    setLasers((prev) =>
      prev
        .map((laser) => ({
          ...laser,
          y: laser.y - 5,
        }))
        .filter((laser) => laser.y > 0),
    )

    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0),
    )
 
    // Collision detection
    setEnemies((prev) =>
      prev
        .map((enemy) => {
          const hitByLaser = lasers.some(
            (laser) => Math.abs(laser.x - enemy.x) < 25 && Math.abs(laser.y - enemy.y) < 25,
          )
          if (hitByLaser) {
            setLasers((prev) =>
              prev.filter((laser) => !(Math.abs(laser.x - enemy.x) < 25 && Math.abs(laser.y - enemy.y) < 25)),
            )
            createExplosion(enemy.x, enemy.y)
            return { ...enemy, health: enemy.health - 1 }
          }
          return enemy
        })
        .filter((enemy) => enemy.health > 0),
    )

    // Check for game over
    const playerHit = enemies.some((enemy) => Math.abs(enemy.x - player.x) < 35 && Math.abs(enemy.y - player.y) < 35)
    if (playerHit) {
      setGameOver(true)
      createExplosion(player.x, player.y)
    }

    // Update score
    setScore((prev) => prev + enemies.filter((enemy) => enemy.health <= 0).length)

    // Render game
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      // drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT)
      Player.draw(ctx, player)
      enemies.forEach((enemy) => Enemy.draw(ctx, enemy))
      lasers.forEach((laser) => Laser.draw(ctx, laser))

      // Draw particles
      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 200) + 50}, 0, ${particle.life / 30})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = "white"
      ctx.font = "20px Arial"
      ctx.fillText(`Score: ${score}`, 10, 30)

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.fillStyle = "white"
        ctx.font = "48px Arial"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)
        ctx.font = "24px Arial"
        ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      }
    }
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-700 cursor-none"
        />
        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Button
              onClick={resetGame}
              className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
            >
              Restart Game
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

