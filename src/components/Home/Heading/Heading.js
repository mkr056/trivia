import * as s from './style.module.css';

export default function Heading() {
  return (
    <div className={`d-flex flex-column align-items-center gap-1 ${s.wrap}`}>
      <h1 className={s.title}>Welcome to the Ultimate&nbsp;Trivia&nbsp;Challenge!</h1>
      <h5 className={s.subtitle}>
        Test your knowledge across various categories and see how many questions you can answer correctly.
      </h5>
      <p className={s.question}>Are you ready to put your trivia skills to the test?</p>
    </div>
  );
}