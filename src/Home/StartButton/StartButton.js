import * as s from './style.module.css';

function startGame() {
  console.log('test')
}

export default function StartButton() {
  return (
    <div className='d-flex justify-content-center'>
      <button
        className={s.startButton}
        type='button'
        onClick={startGame}>
        Start game!
      </button>
    </div>
  );
}