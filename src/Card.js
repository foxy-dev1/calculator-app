// src/components/Card.js
import React from 'react';
import './Card.css';

const Card = ({ suit, value, index }) => {
  const getColor = () => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  const getSuitSymbol = () => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  return (
    <div className="card" style={{ transform: `rotate(${index * 2 - 5}deg)`, zIndex: index }}>
      <div className={`card-content ${getColor()}`}>
        <div className="card-corner top-left">
          <div className="card-value">{value}</div>
          <div className="card-suit">{getSuitSymbol()}</div>
        </div>
        <div className="card-center-suit">{getSuitSymbol()}</div>
        <div className="card-corner bottom-right">
          <div className="card-value">{value}</div>
          <div className="card-suit">{getSuitSymbol()}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;