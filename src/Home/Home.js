import HighScore from '@/Home/HighScore/HighScore';
import Heading from '@/Home/Heading/Heading';
import StartButton from '@/Home/StartButton/StartButton';
import * as s from './style.module.css'

export default function Home() {
  return (
      <div className={`d-flex flex-column justify-content-center gap-3 ${s.wrap}`}>
        <HighScore/>
        <Heading />
        <StartButton />
      </div>

  );
}