import HighScore from '@/components/Home/HighScore/HighScore';
import Heading from '@/components/Home/Heading/Heading';
import Button from '@/common/components/Button/Button';
import * as s from './style.module.css';

export default function Home({onClick = () => {}}) {
  return (
    <div className={`d-flex flex-column justify-content-center gap-3 ${s.wrap}`}>
      <HighScore/>
      <Heading/>
      <div className='d-flex justify-content-center'>
        <Button uppercased title='Start Game!' onClick={onClick}/>
      </div>
    </div>
  );
}