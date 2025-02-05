import React from "react";
import "../scss/GameStart.scss";

interface StoretProps {
  onStart: () => void;
}

export default function Store({ onStart }: StoretProps) {
  return (
    <div className="game-start-container">
      <h1 className="game-title">SkyBlitz</h1>
      <button className="start-button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}