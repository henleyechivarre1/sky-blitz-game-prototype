import React, { useEffect, useState } from "react";
import "../scss/GameStart.scss";
import Store from "./Store";

interface GameStartProps {
  onStart: () => void;
  onUpgradeBullets: () => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function GameStart({
  onStart,
  onUpgradeBullets,
  score,
  setScore,
}: GameStartProps) {
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  return (
    <div className="game-start-container">
      <h1 className="game-title">SkyBlitz</h1>
      <button className="start-button" onClick={onStart}>
        Start Game
      </button>
      {/* Store Button (Opens Modal Instead of Routing) */}
      <button onClick={() => setIsStoreOpen(true)} className="store-button">
        Store
      </button>
      {/* Store Modal */}
      {isStoreOpen && (
        <Store
          onClose={() => setIsStoreOpen(false)}
          onUpgradeBullets={onUpgradeBullets}
          score={score}
          setScore={setScore}
        />
      )}
    </div>
  );
}
