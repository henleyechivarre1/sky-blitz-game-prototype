import React, { useEffect, useState } from "react";
import "../scss/GameStart.scss";
import Store from "./Store";

interface GameStartProps {
  onStart: () => void;
  onUpgradeBullets: () => void;
  onUpgradeShield: () => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  shieldHealth: number;
  setShieldHealth: React.Dispatch<React.SetStateAction<number>>;
}

export default function GameStart({
  onStart,
  onUpgradeBullets,
  score,
  setScore,
  onUpgradeShield,
  shieldHealth,
  setShieldHealth,
}: GameStartProps) {
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  return (
    <div className="game-start-container">
      <h1 className="game-title">🚀 SkyBlitz</h1>

      <div className="button-container">
        <button className="start-button" onClick={onStart}>
          ▶ Start Game
        </button>

        <button onClick={() => setIsStoreOpen(true)} className="store-button">
          🛒 Open Store
        </button>
      </div>

      {/* Store Modal */}
      {isStoreOpen && (
        <Store
          onClose={() => setIsStoreOpen(false)}
          onUpgradeBullets={onUpgradeBullets}
          onUpgradeShield={onUpgradeShield}
          score={score}
          setScore={setScore}
          shieldHealth={shieldHealth}
          setShieldHealth={setShieldHealth}
        />
      )}
    </div>
  );
}
