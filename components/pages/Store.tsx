import React, { useState } from "react";
import "../scss/Store.scss";

interface StoreProps {
  onClose: () => void; // Function to close the store
  onUpgradeBullets: () => void;
  onUpgradeShield: () => void; // Function to upgrade shield
  shieldHealth: number; // Current shield health
  setShieldHealth: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function Store({
  onClose,
  onUpgradeBullets,
  onUpgradeShield,
  score,
  setScore,
  shieldHealth,
  setShieldHealth,
}: StoreProps) {
  const [bulletsPurchased, setBulletsPurchased] = useState(false);

  const bulletCost = 100; // Price for bullet upgrade
  const [shieldPurchased, setShieldPurchased] = useState(false);
  const shieldCost = 100; // Shield upgrade cost
  const canBuyShield = score >= shieldCost; // Can the player afford the shield?

  const canBuy = score >= bulletCost;

  const handlePurchaseBullets = () => {
    if (canBuy && !bulletsPurchased) {
      onUpgradeBullets();
      setBulletsPurchased(true); // Mark as purchased
      setScore((prev) => prev - bulletCost); // Deduct points
    }
  };

  const handlePurchaseShield = () => {
    if (canBuy && !shieldPurchased) {
      onUpgradeShield(); // Upgrade shield
      setShieldPurchased(true); // Mark shield as purchased
      setScore((prev) => prev - shieldCost); // Deduct points for shield
      setShieldHealth(3); // Set shield health to 3 (full shield)
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
              onClick={handlePurchaseBullets}
            >
              {bulletsPurchased ? "Purchased" : `${bulletCost}`}
            </button>
          </div>

          {/* Upgrade: Shield */}
          <div className="store-item">
            <h3>Shield</h3>
            <p>
              Protect yourself with a temporary shield. It absorbs 3 hits before
              being destroyed.
            </p>
            <button
              className={`buy-button ${
                !canBuyShield || shieldPurchased ? "disabled" : ""
              }`}
              onClick={handlePurchaseShield}
              disabled={!canBuyShield || shieldPurchased}
            >
              {shieldPurchased ? "Purchased" : `${shieldCost}`}
            </button>
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
