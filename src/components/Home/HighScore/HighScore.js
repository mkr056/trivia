import {useState, useEffect} from 'react';
import * as s from './style.module.css';

/**
 * The high score component displayed on the Home page.
 * @returns {JSX.Element} The high score component.
 */
export default function HighScore() {
  const [highScore, setHighScore] = useState(null);
  useEffect(() => {
    // If there is an existing value for the high score in localstorage then use it, otherwise set to 0.
    setHighScore(localStorage.getItem('highScore') ?? '0');
  }, []);

  return <p className={s.highScore}>High Score: {highScore}!</p>;
}