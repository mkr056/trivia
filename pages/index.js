import {useState} from 'react';
import Home from '@/components/Home/Home';
import PopupContainer from '@/common/components/PopupContainer/PopupContainer';
import Config from '@/components/Config/Config';

export default function Page() {

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  function toggleConfig() {
    setIsConfigOpen(!isConfigOpen);
  }

  return (
    <div className='container'>
      {isConfigOpen ?
        <PopupContainer isOpen={isConfigOpen} onClose={toggleConfig}>
          <Config/>
        </PopupContainer> :
        <Home onClick={toggleConfig}/>
      }
    </div>
  );
}