import React from "react";
import "../scss/GameStart.scss";

interface GameStartProps {
  onStart: () => void;
}

export default function GameStart({ onStart }: GameStartProps) {
  return (
    <div className="game-start-container">
      <h1 className="game-title">SkyBlitz</h1>
      <button className="start-button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}
