import {useState, useEffect, useRef} from 'react';
import {API} from '../../../config';
import {shuffleArray, getObjectFromQueryString, decodeHtmlText, sendGetRequest} from '@/common/helpers/helpers';
import Button from '@/common/components/Button/Button';
import * as s from './style.module.css';

// Keys represent remaining lives and values represent the color to be applied to the lives label.
const livesColors = {
  3: 'var(--light-green)',
  2: 'var(--yellow)',
  1: 'var(--orange)',
  0: 'var(--red)'
};

/**
 * Adds a new class to the body element depending on the passed parameter.
 * @param {boolean} isCorrect - Determines which class name should be appending to the body depending on user answer.
 */

/*
This function eventually triggers a change in the background color of the body element,
green for the correct answer and red for the wrong answer.
*/
function styleBody(isCorrect = false) {
  const bodyCN = isCorrect ? 'correct' : 'wrong';
  document.body.classList.add(bodyCN);
}

/**
 * Applies stying to the buttons: disables all of them and hides the wrong answers.
 * @param {string} correctAnswer - The correct answer for the current question.
 */

/*
Similarly to styleBody, this function is required for better user experience, making the
correct answer stand out from the rest.
*/
function styleButtons(correctAnswer = '') {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.disabled = true;
    const buttonText = button.innerText;
    if (buttonText !== correctAnswer) button.style.visibility = 'hidden';
  });
}

/**
 * The question component with question title, possible answers, score, and remaining lives.
 * @param {string} queryString - The string used for query parameters to fetch questions.
 * @param {Object} currentQuestion - The current question displayed to the user.
 * @param setCurrentQuestion - The function to update the object representing the current question.
 * @returns {JSX.Element} - The question component.
 */
export default function Question({
  queryString = '',
  currentQuestion = {},
  setCurrentQuestion = f => f
}) {
  const [progress, setProgress] = useState({
    score: 0,
    lives: 3,
    questionNumber: 1, // refers to the current question number being presented to the user.
    isGameOver: false
  });
  const [isFetching, setIsFetching] = useState(false);
  // number refers to the total number of question to be asked.
  const config = useRef({number: 0, godMode: true});

  const questionTitle = decodeHtmlText(currentQuestion['question']);
  const correctAnswer = currentQuestion['correct_answer'];
  const incorrectAnswers = currentQuestion['incorrect_answers'];
  const answers = [...[correctAnswer], ...incorrectAnswers];
  const preparedAnswers = answers.map(decodeHtmlText);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  /*
  This code is triggered on first render and every currentQuestion update. It shuffles the answers,
  sets values for important variables based on queryString, and updates progress state.
  */
  useEffect(() => {
    setShuffledAnswers(shuffleArray(preparedAnswers));
    const queryObject = getObjectFromQueryString(queryString);
    config.current.number = Number(queryObject['number']);
    config.current.godMode = Boolean(queryObject['godMode']);
    setProgress({...progress, questionNumber: progress.questionNumber + 1});
  }, [currentQuestion]);

  /**
   * Sends request to fetch a question. In case of failure, repeats the process after 1 second.
   * @param {string} url - The url to send request to.
   */
  function fetchQuestionWithRetry(url = '') {
    sendGetRequest(url)
      .then((data) => {
        const question = data?.results?.[0];
        if (question) setCurrentQuestion(question);
        setIsFetching(false);
      })
      // This handler is required because there has to be a 5-second gap between requests. So we keep retrying every 1s.
      .catch(() => setTimeout(() => fetchQuestionWithRetry(url), 1000));
  }

  /**
   * Updates progress state, high score value, applies styling to the body and answer buttons,
   * checks if the game is over, and fetches new question.
   * @param {Object} e - The representation of the event when clicking on the button.
   */
  function onClick(e) {
    const answer = e.target.innerText;
    const isCorrect = answer === correctAnswer;
    const newScore = isCorrect ? progress.score + 1 : progress.score;
    const newLives = isCorrect ? progress.lives : progress.lives - 1;
    setProgress({...progress, score: newScore, lives: newLives});
    const highScore = localStorage.getItem('highScore' ?? '0');
    // High score is updated only when god mode is disabled.
    if (!config.current.godMode && newScore > Number(highScore)) localStorage.setItem('highScore', newScore);
    // Apply styling to indicate to the user whether his answer was correct.
    styleBody(isCorrect);
    styleButtons(correctAnswer);

    // This timeout is required in order for the styling to be visible for a period of 1s before it is reset.
    setTimeout(() => {
      document.body.removeAttribute('class');
      // The checks related to the question number and remaining lives is only applicable when god mode is disabled.
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

  // The styling to be applied to the lives label.
  const livesStyle = {color: livesColors[progress.lives]};

  return (
    isHideQuestion ?
      <div className='d-flex flex-column justify-content-center' style={{height: '100%'}}>
        <h3 style={{textAlign: 'center'}}>{messageText}</h3>
      </div> :
      <>
        {/*Show progress only is the god mode is disabled*/}
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