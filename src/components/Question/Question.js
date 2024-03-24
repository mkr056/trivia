import {useState, useEffect, useRef} from 'react';
import {API} from '../../../config';
import {decodeHtmlText, getObjectFromQueryString, sendGetRequest, shuffleArray} from '@/common/helpers/helpers';
import Button from '@/common/components/Button/Button';
import * as s from './style.module.css';

const livesColors = {
  3: 'var(--light-green)',
  2: 'var(--yellow)',
  1: 'var(--orange)',
  0: 'var(--red)'
};

function styleBody(isCorrect = false) {
  const bodyCN = isCorrect ? 'correct' : 'wrong';
  document.body.classList.add(bodyCN);
}

function styleButtons(correctAnswer = '') {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
    const buttonText = button.textContent || button.innerText;
    if (buttonText !== correctAnswer) button.style.visibility = 'hidden';
  });
}

export default function Question({
  queryString = '',
  currentQuestion = {},
  setCurrentQuestion = f => f
}) {
  const [progress, setProgress] = useState({
    score: 0,
    lives: 3,
    questionNumber: 1,
    isGameOver: false
  })
  const [isFetching, setIsFetching] = useState(false);
  const config = useRef({number: 0, godMode: true});

  const questionTitle = decodeHtmlText(currentQuestion['question']);
  const correctAnswer = currentQuestion['correct_answer'];
  const incorrectAnswers = currentQuestion['incorrect_answers'];
  const answers = [...[correctAnswer], ...incorrectAnswers];
  const preparedAnswers = answers.map(decodeHtmlText);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    setShuffledAnswers(shuffleArray(preparedAnswers));
    const queryObject = getObjectFromQueryString(queryString);
    config.current.number = Number(queryObject['number']);
    config.current.godMode = Boolean(queryObject['godMode']);
    setProgress({...progress, questionNumber: progress.questionNumber + 1});
  }, [currentQuestion]);

  function fetchQuestionWithRetry(url = '') {
    sendGetRequest(url)
      .then(data => {
        const question = data?.results?.[0];
        if (question) setCurrentQuestion(question);
        setIsFetching(false);
      })
      .catch(() => setTimeout(() => fetchQuestionWithRetry(url), 1000));
  }

  function onClick(e) {
    const answer = e.target.textContent || e.target.innerText;
    const isCorrect = answer === correctAnswer;
    const newScore = isCorrect ? progress.score + 1 : progress.score;
    const newLives = isCorrect ? progress.lives : progress.lives - 1;
    setProgress({...progress, score: newScore, lives: newLives});
    const highScore = localStorage.getItem('highScore' ?? '0');
    if (!config.current.godMode && newScore > Number(highScore)) localStorage.setItem('highScore', newScore);
    styleBody(isCorrect);
    styleButtons(correctAnswer);

    setTimeout(() => {
      document.body.removeAttribute('class');
      if (!config.current.godMode && (progress.questionNumber > config.current.number || newLives === 0)) {
        setProgress({...progress, isGameOver: true});
        return;
      }
      setIsFetching(true);
      const url = `${API}?${queryString}`;
      fetchQuestionWithRetry(url);
    }, 1000);
  }

  const isHideQuestion = isFetching || progress.isGameOver;
  const messageText =
    isFetching ?
      'Please wait, fetching question...' :
      `Game Over! Your score is ${progress.score}`;

  const livesStyle = {color: livesColors[progress.lives]};

  return (
    isHideQuestion ?
      <div className='d-flex flex-column justify-content-center' style={{height: '100%'}}>
        <h3 style={{textAlign: 'center'}}>{messageText}</h3>
      </div> :
      <>
        {!config.current.godMode && (
          <div className={`d-flex justify-content-between ${s.info}`}>
            <h3>Score: {progress.score}</h3>
            <h3 style={livesStyle}>Lives: {progress.lives}</h3>
          </div>
        )}

        <div className='d-flex flex-column justify-content-center gap-4' style={{height: '100%'}}>
          <h4 className={s.questionTitle}>{questionTitle}</h4>
          {shuffledAnswers.map((answer, idx) =>
            <Button key={idx} title={answer} onClick={onClick}/>)}
        </div>
      </>
  );
}