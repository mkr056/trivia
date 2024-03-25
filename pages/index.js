import {useState} from 'react';
import PopupContainer from '@/common/components/PopupContainer/PopupContainer';
import Home from '@/components/Home/Home';
import Question from "@/components/Question/Question";
import Config from '@/components/Config/Config';

/**
 * This Page component is rendered when the root endpoint is accessed.
 * @returns {JSX.Element} The rendered component, either Home or PopupContainer.
 */

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  function onClickPopup() {
    setIsPopupOpen(!isPopupOpen);
    setCurrentQuestion(null);
  }

  /*
  In this app, there are only two main components that have to be rendered inside
  a popup container: the configuration menu and the question view (with question title,
  possible answers, score, and remaining lives). If currentQuestion is set, then display
  the question view, otherwise the configuration menu. PopupContent, therefore, represents
  one of the two components.
  */
  const PopupContent =
    currentQuestion ?
      <Question queryString={queryString} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/> :
      <Config setQueryString={setQueryString} setCurrentQuestion={setCurrentQuestion}/>;

  return (
    <div className='container'>
      {isPopupOpen ?
        <PopupContainer isOpen={isPopupOpen} onClick={onClickPopup}>
          {PopupContent}
        </PopupContainer> :
        <Home onClick={onClickPopup}/>
      }
    </div>
  );
}