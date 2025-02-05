import React, { useState } from "react";
import "../scss/Store.scss";

interface StoreProps {
  onClose: () => void; // Function to close the store
  onUpgradeBullets: () => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function Store({ onClose, onUpgradeBullets, score , setScore}: StoreProps) {
  const [bulletsPurchased, setBulletsPurchased] = useState(false);
const bulletCost = 100; // Price for bullet upgrade

const canBuy = score >= bulletCost;

  const handlePurchase = () => {
    if (canBuy && !bulletsPurchased) {
      onUpgradeBullets();
      setBulletsPurchased(true); // Mark as purchased
      setScore((prev) => prev - bulletCost); // Deduct points
    }
  };

  return (
    <div className="store-modal">
      <div className="store-content">
        <h2>In-Game Store</h2>
        <p>
          Your Points: <strong>{score}</strong>
        </p>

        {/* Upgrade Options */}
        <div className="store-items">
          {/* Upgrade: Increase Bullets */}
          <div className="store-item">
            <h3>+2 Bullets (Permanent)</h3>
            <p>Increase your firepower permanently by 2.</p>
            <button
              className={`buy-button ${!canBuy ? "disabled" : ""}`}
              disabled={!canBuy || bulletsPurchased}
              onClick={handlePurchase}
            >
              {bulletsPurchased ? "Purchased" : `${bulletCost}`}
            </button>
          </div>

          {/* Upgrade: Shield */}
          <div className="store-item">
            <h3>Shield</h3>
            <p>Protect yourself with a temporary shield.(Requires 3 hits).</p>
            <button className="buy-button">Buy</button>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="close-button">
          Close Store
        </button>
      </div>
    </div>
  );
}
