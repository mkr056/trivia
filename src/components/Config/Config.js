import {useState, useEffect} from 'react';
import {API, API_CATEGORY} from '../../../config';
import {getQueryStringFromObject, sendGetRequest} from '@/common/helpers/helpers';
import Button from '@/common/components/Button/Button';
import * as s from './style.module.css';

const DEFAULT_NUMBER = '10';

const difficultyOptions = [
  {id: 'any', name: 'Any Difficulty'},
  {id: 'easy', name: 'Easy'},
  {id: 'medium', name: 'Medium'},
  {id: 'hard', name: 'Hard'}
];

const typeOptions = [
  {id: 'any', name: 'Any Type'},
  {id: 'multiple', name: 'Multiple Choice'},
  {id: 'boolean', name: 'True / False'}
];

/**
 * Prepares the config object for conversion to a query string.
 * @param config - The config object.
 * @returns {Object} The prepared config object.
 */

// This function is required due to strict api rules specified by the server, otherwise requests may result in errors.
function getPreparedConfig(config = {}) {
  return Object.keys(config).reduce((acc, key) => {
    if (config[key] && config[key] !== 'any') acc[key] = config[key];
    return acc;
  }, {});
}

export default function Config({setQueryString = f => f, setCurrentQuestion = f => f}) {
  const [config, setConfig] = useState({
    amount: 1, // refers to the number of questions to be requested from the server (does not change).
    category: 'any',
    difficulty: 'any',
    type: 'any',
    number: DEFAULT_NUMBER, // refers to the number of questions that will be asked to the user (based on user preference)
    godMode: false,
  });

  const [categoryOptions, setCategoryOptions] = useState([{
    id: 'any',
    name: 'Any Category'
  }]);

  // Instead of static category data, categories are fetched from the server on the first render of the component.
  useEffect(() => {
    sendGetRequest(API_CATEGORY)
      .then((data) => {
        setCategoryOptions([...categoryOptions, ...data['trivia_categories']]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  /**
   * Processes the current config in order to send request and finally fetches the first question.
   */
  function confirmConfig() {
    const preparedConfig = getPreparedConfig(config);
    const queryString = getQueryStringFromObject(preparedConfig);
    setQueryString(queryString);
    const url = `${API}?${queryString}`;
    sendGetRequest(url)
      .then((data) => {
        const question = data['results'][0];
        setCurrentQuestion(question);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  /**
   * Updates the config object.
   * @param {string} key - The key (property) of the object to be changed.
   * @param {any} value - The new value of the specified key.
   */
  function onChangeConfig(key, value) {
    const newConfig = {...config, [key]: value};
    /*
    If the user enables the godMode feature, then set the value of number to any, so it
    is removed from the config during the preparation process. If the user disables the godMode feature,
    then reset the value of number to the default, which is 10.
    */
    if (key === 'godMode') newConfig.number = value ? 'any' : DEFAULT_NUMBER;
    setConfig(newConfig);
  }

  /**
   * Validates user input for the number field.
   */

  /*
  When the input field for the number of questions loses focus, a series of checks are applied,
  in order to make sure that the value is an actual number and is greater than or equal to 1.
  If the input is valid, the update the config object with the corresponding value, otherwise
  reset to default.
  */
  function onBlurNumber() {
    const number = parseInt(config.number);
    const isValidNumber = !isNaN(number) && number >= 1;
    setConfig({...config, number: isValidNumber ? String(number) : DEFAULT_NUMBER});
  }

  return (
    <div className='d-flex flex-column justify-content-center gap-4' style={{height: '100%'}}>
      <h2 className={s.heading}>Configuration Menu</h2>

      <div className='d-flex flex-column gap-1'>
        <label>Number of Questions:</label>
        <input
          className={s.control}
          disabled={config.godMode}
          type='number'
          value={config.godMode ? '' : config.number}
          onBlur={onBlurNumber}
          onChange={(e) => {
            onChangeConfig('number', e.target.value);
          }}/>
      </div>

      <div className='d-flex flex-column gap-1'>
        <label>Select Category:</label>
        <select
          className={s.control}
          value={config.category}
          onChange={(e) => {
            onChangeConfig('category', e.target.value);
          }}>
          {categoryOptions.map((option, idx) =>
            <option key={idx} value={option.id}>{option.name}</option>)}
        </select>
      </div>

      <div className='d-flex flex-column gap-1'>
        <label>Select Difficulty:</label>
        <select
          className={s.control}
          value={config.difficulty}
          onChange={(e) => {
            onChangeConfig('difficulty', e.target.value);
          }}>
          {difficultyOptions.map((option, idx) =>
            <option key={idx} value={option.id}>{option.name}</option>)}
        </select>
      </div>

      <div className='d-flex flex-column gap-1'>
        <label>Select Type:</label>
        <select
          className={s.control}
          value={config.type}
          onChange={(e) => {
            onChangeConfig('type', e.target.value);
          }}>
          {typeOptions.map((option, idx) =>
            <option key={idx} value={option.id}>{option.name}</option>)}
        </select>
      </div>

      <div className='d-flex align-items-center justify-content-end gap-2'>
        <input
          type='checkbox'
          id='god-mode'
          value={String(config.godMode)}
          onChange={(e) => {
            onChangeConfig('godMode', e.target.checked);
          }}/>
        <label htmlFor='god-mode'>God Mode</label>
      </div>

      <div className='d-flex justify-content-center'>
        {/*This timeout is required in order for the user to notice the consequences of the onBlurNumber function*/}
        <Button title='Confirm!' onClick={() => setTimeout(confirmConfig, 200)}/>
      </div>

    </div>
  );
};