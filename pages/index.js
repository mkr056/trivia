import {useState} from 'react';
import Home from '@/components/Home/Home';
import PopupContainer from '@/common/components/PopupContainer/PopupContainer';
import Config from '@/components/Config/Config';
import Question from "@/components/Question/Question";

export default function Page() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  function toggleConfig() {
    setIsPopupOpen(!isPopupOpen);
    setCurrentQuestion(null)
  }

  const PopupContent =
    currentQuestion ?
      <Question queryString={queryString} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/> :
      <Config setQueryString={setQueryString} setCurrentQuestion={setCurrentQuestion}/>

  return (
    <div className='container'>
      {isPopupOpen ?
        <PopupContainer isOpen={isPopupOpen} onClose={toggleConfig}>
          {PopupContent}
        </PopupContainer> :
        <Home onClick={toggleConfig}/>
      }
    </div>
  );
}