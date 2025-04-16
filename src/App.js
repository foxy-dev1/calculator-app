import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';

function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [mode, setMode] = useState('basic'); // 'basic' or 'scientific'
  const [mood, setMood] = useState('chill'); // 'chill' or 'nerdy'
  const [emoji, setEmoji] = useState('🙂');
  const [seriousMode, setSeriousMode] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');
  const [expression, setExpression] = useState('');
  const [parenthesesCount, setParenthesesCount] = useState(0);
  const [blackHoleActive, setBlackHoleActive] = useState(false);
  const [showNiceMeme, setShowNiceMeme] = useState(false);
  const [niceSound] = useState(new Audio('/nice-sound-effect-95595.mp3'));
  const [niceMemeShown, setNiceMemeShown] = useState(false); // Track if the meme has been shown for the current calculation
  const [showBlackHolePopup, setShowBlackHolePopup] = useState(false); // Add this new state to track popup visibility
  const [showHomepage, setShowHomepage] = useState(true);
  const [loading, setLoading] = useState(true); // New state for loading
  const [loadingMessages] = useState(['Loading...', 'Almost there...', 'Just a moment...']); // Messages for loading
  const [currentMessage, setCurrentMessage] = useState(0); // Current loading message index
  const [progress, setProgress] = useState(0); // Progress bar value
  const [percentMode, setPercentMode] = useState(false);
  const [percentValue, setPercentValue] = useState(null);

  useEffect(() => {
    // Set mood based on mode
    setMood(mode === 'basic' ? 'chill' : 'nerdy');
  }, [mode]);

  useEffect(() => {
    // Update emoji based on display value
    updateEmoji(display);
  }, [display]);

  useEffect(() => {
    if (loading) {
      // Update loading message every 1.5 seconds
      const messageInterval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      // Increase progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + 10;
          if (newValue >= 100) {
            clearInterval(progressInterval);
            // Wait a bit after reaching 100% before showing homepage
            setTimeout(() => setLoading(false), 500);
            return 100;
          }
          return newValue;
        });
      }, 600);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    }
  }, [loading]);

  // Format the result to limit decimal places
  const formatResult = (value) => {
    const numValue = parseFloat(value);
    // If it's an integer, return as is
    if (Number.isInteger(numValue)) {
      return String(numValue);
    }
    // Otherwise format to 6 decimal places and remove trailing zeros
    return parseFloat(numValue.toFixed(6)).toString();
  };

  // Reset the calculator
  const clearDisplay = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setFlipped(false);
    setCurrentOperation('');
    setExpression('');
    setParenthesesCount(0);
    setNiceMemeShown(false); // Reset the flag when clearing the calculator
  };

  // Update the emoji based on calculator state
  const updateEmoji = (value) => {
    // Don't change emoji in serious mode
    if (seriousMode) {
      setEmoji('');
      return;
    }

    if (value === 'Error') {
      setEmoji('😠');
    } else if (value === '69') {
      setEmoji('😏');
    } else if (value === '420') {
      setEmoji('😎');
    } else if (parseFloat(value) > 9999) {
      setEmoji('😲');
    } else if (value.includes('.') && !value.includes('e') && value.split('.')[1].length > 5) {
      setEmoji('🤓');
    } else if (value === '0') {
      setEmoji(mood === 'chill' ? '🙂' : '🧐');
    } else {
      // Default mood based on mode
      setEmoji(mood === 'chill' ? '😊' : '🧐');
    }

    // Always ensure showNiceMeme is false here
    setShowNiceMeme(false);
  };

  // Input a number
  const inputDigit = (digit) => {
    // If previous operation was equals, reset the flag
    if (waitingForOperand) {
      setNiceMemeShown(false);
    }

    // Check for easter eggs
    if (display === '0' && digit === 5) {
      setDisplay('5');
      setExpression('5');
      return;
    }
    if (display === '42' && digit === 0) {
      setDisplay('420');
      setExpression('420');
      return;
    }
    // Check for 5318008 (BOOBIES upside-down)
    if (expression + digit === '5318008') {
      setDisplay('5318008');
      setExpression('5318008');
      setFlipped(true);
      return;
    }

    if (waitingForOperand) {
      setDisplay(String(digit));
      setExpression(expression + digit);
      setWaitingForOperand(false);
    } else {
      const newDisplay = display === '0' ? String(digit) : display + digit;
      setDisplay(newDisplay);
      setExpression(expression === '0' ? String(digit) : expression + digit);
    }
  };

  // Input decimal point
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setExpression(expression + '0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  // Toggle positive/negative
  const toggleSign = () => {
    const newValue = -parseFloat(display);
    setDisplay(formatResult(String(newValue)));
    
    // Update expression - remove current number and add the negative version
    const lastNumberMatch = expression.match(/[-+]?\d*\.?\d+$/);
    if (lastNumberMatch) {
      const lastNumber = lastNumberMatch[0];
      const lastNumberIndex = expression.lastIndexOf(lastNumber);
      const newExpression = expression.substring(0, lastNumberIndex) + 
                          formatResult(String(newValue));
      setExpression(newExpression);
    } else {
      setExpression(formatResult(String(newValue)));
    }
  };

  // Percentage calculation
  const percentage = () => {
    setPercentValue(parseFloat(display));
    setPercentMode(true);
    setDisplay('0');
    setExpression('');
  };

  // Add parenthesis
  const addParenthesis = (type) => {
    if (type === 'open') {
      setExpression(expression + '(');
      setParenthesesCount(parenthesesCount + 1);
      setWaitingForOperand(true);
    } else if (type === 'close' && parenthesesCount > 0) {
      setExpression(expression + ')');
      setParenthesesCount(parenthesesCount - 1);
    }
  };

  // Perform basic operation
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    setExpression(expression + nextOperation);
    setWaitingForOperand(true);
    setOperation(nextOperation);
    setCurrentOperation(nextOperation);
  };

  // Scientific operations
  const performScientificOperation = (op) => {
    try {
      let result;
      // Handle pi separately since it doesn't need input value
      if (op === 'pi') {
        result = Math.PI;
        const strResult = formatResult(String(result));
        setCurrentOperation('π');
        setDisplay(strResult);
        setExpression(expression + 'π');
        setWaitingForOperand(true);
        return;
      }

      // For other operations, apply the operation to the expression
      switch (op) {
        case 'sqrt':
          setExpression(expression + 'sqrt(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        case 'square':
          setExpression(expression + '^2');
          break;
        case 'sin':
          setExpression(expression + 'sin(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        case 'cos':
          setExpression(expression + 'cos(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        case 'tan':
          setExpression(expression + 'tan(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        case 'log':
          setExpression(expression + 'log(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        case 'ln':
          setExpression(expression + 'ln(');
          setParenthesesCount(parenthesesCount + 1);
          break;
        default:
          break;
      }
      setCurrentOperation(op);
      setWaitingForOperand(true);
    } catch (error) {
      console.error("Calculator error:", error.message);
      setDisplay('Error');
      setEmoji('😠');
      setTimeout(() => {
        setDisplay('0');
        setCurrentOperation('');
      }, 2000);
    }
  };

  // Evaluate expression
  const evaluateExpression = (expr) => {
    try {
      // Replace scientific functions with JavaScript equivalents
      let processedExpr = expr
        .replace(/π/g, 'Math.PI')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(Math.PI/180*')
        .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
        .replace(/tan\(/g, 'Math.tan(Math.PI/180*')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/(\d+)\^2/g, '$1*$1');
      
      // Convert × to * for multiplication
      processedExpr = processedExpr.replace(/×/g, '*');

      // Evaluate the expression
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + processedExpr)();
      
      // Check for errors
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }
      
      return formatResult(String(result));
    } catch (error) {
      console.error('Expression evaluation error:', error);
      return 'Error';
    }
  };

  // Equals button
  const handleEquals = () => {
    if (percentMode && percentValue !== null) {
      // Calculate percent of the entered value
      const result = (percentValue / 100) * parseFloat(display);
      setDisplay(formatResult(String(result)));
      setExpression('');
      setPercentMode(false);
      setPercentValue(null);
      setParenthesesCount(0);
      setWaitingForOperand(true);
      setOperation(null);
      setCurrentOperation('');
      return;
    }
    // Close any remaining open parentheses
    let finalExpression = expression;
    for (let i = 0; i < parenthesesCount; i++) {
      finalExpression += ')';
    }
    
    // Evaluate the expression
    const result = evaluateExpression(finalExpression);
    setDisplay(result);
    
    if (result !== 'Error') {
      setExpression(result);
      setParenthesesCount(0);
      setWaitingForOperand(true);
      setOperation(null);
      setCurrentOperation('');
      
      // Show nice meme only when result is 69 AND equals button was pressed AND meme hasn't been shown yet
      if (result === '69' && !niceMemeShown) {
        setShowNiceMeme(true);
        setNiceMemeShown(true); // Mark that we've shown the meme
        
        // Play sound after a small delay
        setTimeout(() => {
          niceSound.play().catch(error => {
            console.log('Audio playback failed:', error);
          });
        }, 0);
        
        // Hide meme after 3 seconds
        setTimeout(() => {
          setShowNiceMeme(false);
        }, 2500);
      }
      
      // Check for perfect result (whole number)
      const numResult = parseFloat(result);
      if (numResult === Math.floor(numResult)) {
        setEmoji('🥳');
      }
    } else {
      setEmoji('😡');
      setTimeout(() => {
        clearDisplay();
      }, 2000);
    }
  };

  // Toggle mode
  const toggleMode = () => {
    setMode(mode === 'basic' ? 'scientific' : 'basic');
  };

  // Toggle serious mode
  const toggleSeriousMode = () => {
    setSeriousMode(!seriousMode);
    if (seriousMode) {
      setEmoji(mood === 'chill' ? '😊' : '🧐');
    } else {
      setEmoji('');
    }
  };

  // Black hole effect
  const activateBlackHole = () => {
    setBlackHoleActive(true);
    setShowBlackHolePopup(true);
    
    // Start animation effect
    setTimeout(() => {
      // Gradually remove characters one by one
      let currentExpr = expression;
      let currentDisplay = display;
      
      const interval = setInterval(() => {
        if (currentExpr.length > 0) {
          currentExpr = currentExpr.slice(0, -1);
          setExpression(currentExpr);
        }
        
        if (currentDisplay.length > 0) {
          currentDisplay = currentDisplay.slice(0, -1);
          setDisplay(currentDisplay);
        } else {
          clearInterval(interval);
          
          // After everything is gone, start fade out process
          const displayElement = document.querySelector('.display-container');
          if (displayElement) {
            displayElement.classList.add('black-hole-fading');
          }
          
          const popupElement = document.querySelector('.black-hole-popup');
          if (popupElement) {
            popupElement.classList.add('fading');
          }
          
          // Only reset everything after fade out completes
          setTimeout(() => {
            setExpression('');
            setDisplay('0');
            setPrevValue(null);
            setOperation(null);
            setParenthesesCount(0);
            setWaitingForOperand(true);
            setBlackHoleActive(false);
            setEmoji('🌌');
            setShowBlackHolePopup(false);
          }, 2000);
        }
      }, 100);
    }, 500);
  };

  const handleStart = () => {
    setShowHomepage(false);
  };

  if (showHomepage) {
    return <HomePage onStart={handleStart} />;
  }

  return (
    <div className={`App ${flipped ? 'flipped' : ''} ${mood} ${mode}`}>
      <div className="calculator-container">
        <div className="emoji-container">
          {!seriousMode && <div className="emoji">{emoji}</div>}
        </div>
        <div className="calculator">
          <div className={`display-container ${blackHoleActive ? 'black-hole-active' : ''}`}>
            <div className="operation-display">
              {expression}
            </div>
            <div className={`display ${flipped ? 'flipped-text' : ''}`}>
              {display}
            </div>
          </div>

          {/* Calculator content */}
          <div className="calculator-content">
            {/* Basic calculator panel */}
            <div className="basic-panel">
              <div className="buttons">
                <div className="row">
                  <button className="function" onClick={clearDisplay}>AC</button>
                  <button className="function" onClick={toggleSign}>+/-</button>
                  <button className="function" onClick={percentage}>%</button>
                  <button className="operator" onClick={() => performOperation('/')}>/</button>
                </div>
                <div className="row">
                  <button onClick={() => inputDigit(7)}>7</button>
                  <button onClick={() => inputDigit(8)}>8</button>
                  <button onClick={() => inputDigit(9)}>9</button>
                  <button className="operator" onClick={() => performOperation('×')}>×</button>
                </div>
                <div className="row">
                  <button onClick={() => inputDigit(4)}>4</button>
                  <button onClick={() => inputDigit(5)}>5</button>
                  <button onClick={() => inputDigit(6)}>6</button>
                  <button className="operator" onClick={() => performOperation('-')}>-</button>
                </div>
                <div className="row">
                  <button onClick={() => inputDigit(1)}>1</button>
                  <button onClick={() => inputDigit(2)}>2</button>
                  <button onClick={() => inputDigit(3)}>3</button>
                  <button className="operator" onClick={() => performOperation('+')}>+</button>
                </div>
                <div className="row">
                  <button className="zero" onClick={() => inputDigit(0)}>0</button>
                  <button onClick={inputDot}>.</button>
                  <button className="operator" onClick={handleEquals}>=</button>
                </div>
              </div>
            </div>
            
            {/* Scientific calculator panel (always rendered but slides in/out) */}
            <div className="scientific-panel">
              <div className="scientific-buttons">
                <button onClick={() => addParenthesis('open')}>(</button>
                <button onClick={() => addParenthesis('close')}>)</button>
                <button onClick={() => performScientificOperation('sqrt')}>√</button>
                <button onClick={() => performScientificOperation('square')}>x²</button>
                <button onClick={() => performScientificOperation('sin')}>sin</button>
                <button onClick={() => performScientificOperation('cos')}>cos</button>
                <button onClick={() => performScientificOperation('tan')}>tan</button>
                <button onClick={() => performScientificOperation('log')}>log</button>
                <button onClick={() => performScientificOperation('ln')}>ln</button>
                <button onClick={() => performScientificOperation('pi')}>π</button>
                <button onClick={() => inputDigit('e')}>e</button>
                <button className="function" onClick={clearDisplay}>C</button>
                <button 
                  className="black-hole-button" 
                  onClick={activateBlackHole}
                  disabled={blackHoleActive}
                >
                  Black Hole 🕳️
                </button>
              </div>
            </div>
          </div>

          {/* Mode toggles at the bottom */}
          <div className="mode-toggles">
            <button
              className={`mode-toggle ${mode === 'scientific' ? 'active' : ''}`}
              onClick={toggleMode}
            >
              {mode === 'basic' ? 'Scientific Mode' : 'Basic Mode'}
            </button>
            <button
              className={`serious-toggle ${seriousMode ? 'active' : ''}`}
              onClick={toggleSeriousMode}
            >
              {seriousMode ? 'Fun Mode' : 'Serious Mode'}
            </button>
            <button
              className="black-hole-toggle"
              onClick={activateBlackHole}
              disabled={blackHoleActive}
            >
              Black Hole
            </button>
          </div>

          {/* Nice meme container */}
          {!seriousMode && showNiceMeme && (
            <div className="nice-meme-container visible">
              <img 
                src="/nice-smack.gif" 
                alt="Nice meme"
                className="nice-meme"
              />
            </div>
          )}

          {/* Black hole popup message */}
          {showBlackHolePopup && (
            <div className="black-hole-popup">
              <p className="popup-text">Your numbers have been consumed by the cosmic singularity! Mathematical laws no longer apply.</p>
              <div className="popup-emojis">🕳️ 💫 🌌 ⚛️ 🔮 💥</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;