import {useState, useEffect} from 'react';
import * as s from './style.module.css';


export default function HighScore() {
  const [highScore, setHighScore] = useState(null);
  useEffect(() => {
    setHighScore(localStorage.getItem('highScore') ?? '0');
  }, []);

  return <p className={s.highScore}>High Score: {highScore}!</p>;
}