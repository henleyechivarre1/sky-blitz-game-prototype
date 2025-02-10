"use client";
import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const Game = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the Phaser game only on the client side
        if (typeof window !== 'undefined' && gameRef.current) {
            new Phaser.Game({
                type: Phaser.AUTO,
                width: window.innerWidth,
                height: window.innerHeight,
                parent: gameRef.current,
                scene: {
                    preload,
                    create,
                    update,
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: false,
                    },
                },
            });
        }

        // Clean up Phaser game when the component unmounts
        return () => {
            if (gameRef.current && gameRef.current.children.length > 0) {
                gameRef.current.removeChild(gameRef.current.children[0]);
            }
        };
    }, []);

    // Game variables
    let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
    let lasers: Phaser.GameObjects.Group | null = null;
    let enemies: Phaser.GameObjects.Group | null = null;
    let lastFired = 0;

    // Preload assets
    function preload(this: Phaser.Scene) {
        this.load.image('player', '/sprites/player.png');
        this.load.image('laser', '/sprites/laserGreen.png');
        this.load.image('enemy', '/sprites/enemyShip.png');
    }

    // Create the game world
    function create(this: Phaser.Scene) {
        if (!this.physics) {
            console.error('Phaser Physics not initialized');
            return;
        }

        // Create the player sprite
        player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 100, 'player').setOrigin(0.5, 0.5);

        // Explicitly set position again
        player.setPosition(window.innerWidth / 2, window.innerHeight - 100);

        // Create lasers group (now physics-enabled)
        lasers = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,  // Make lasers physics-enabled
            runChildUpdate: true,
            allowGravity: false,
        });

        // Create enemies group
        enemies = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,  // Updated to use Arcade Sprite
            runChildUpdate: true,
        });

        // Spawn enemies endlessly every second
        this.time.addEvent({
            delay: 1000, // Spawn every 1 second
            callback: spawnEnemy,
            callbackScope: this,
            loop: true,
        });

        // Collision: Laser hits enemy
        this.physics.add.overlap(
            lasers,
            enemies,
            (laser, enemy) => {
                hitEnemy(laser as Phaser.Physics.Arcade.Sprite, enemy as Phaser.Physics.Arcade.Sprite);
            },
            undefined,
            this
        );

        // Hide mouse cursor
        // this.input.setDefaultCursor('none');
    }

    // Update the game state
    function update(this: Phaser.Scene, time: number) {
        if (!player) return;

        // Get mouse position and move the player towards it
        const pointer = this.input.activePointer;

        if (pointer.isDown) {
            player.setPosition(pointer.x, player.y);
        }

        // Shoot lasers automatically
        if (time - lastFired > 300) {
            lastFired = time;
            fireLaser.call(this);
        }

        // Make enemies follow the player
        enemies?.getChildren().forEach((enemy: any) => {
            if (enemy && player) {
                this.physics.moveToObject(enemy, player, 60); // Move enemy towards player
            }

            // Collision: Enemy hits Player
            // this.physics.add.overlap(
            //     enemy,
            //     player,
            //     (player, enemy) => {
            //         hitPlayer(player as Phaser.Physics.Arcade.Sprite, enemy as Phaser.Physics.Arcade.Sprite);
            //     },
            //     undefined,
            //     this
            // );
        });
    }

    // Function to fire a laser
    function fireLaser() {
        if (player && lasers) {
            let laser = lasers.create(player.x, player.y - 30, 'laser');
            laser.setOrigin(0.5, 0.5);
            laser.setVelocity(0, -400); // Shoot laser upwards
        }
    }

    function spawnEnemy() {
        if (enemies) {
            let enemy = enemies.create(
                Phaser.Math.Between(0, window.innerWidth),
                Phaser.Math.Between(-50, 0), // Spawn slightly above the screen
                "enemy"
            );
            enemy.setOrigin(0.5, 0.5);
            enemy.setVelocity(0, 50); // Move downward initially
        }
    }

    function hitEnemy(laser: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
        if (laser && enemy) {
            laser.destroy(); // Remove laser
            enemy.destroy(); // Remove enemy
        }
    }

    function hitPlayer(enemy: Phaser.Physics.Arcade.Sprite, player: Phaser.Physics.Arcade.Sprite) {
        if (enemy && player) {
            console.log("game over");
        }
    }

    return <div ref={gameRef}></div>;
};

export default Game;
