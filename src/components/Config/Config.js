import {useEffect, useState} from 'react';
import {API, API_CATEGORY} from '../../../config';
import Button from '@/common/components/Button/Button';
import {getQueryStringFromObject, sendGetRequest} from '@/common/helpers/helpers';
import * as s from './style.module.css';

const DEFAULT_NUMBER = '10';

const difficulties = [
  {id: 'any', name: 'Any Difficulty'},
  {id: 'easy', name: 'Easy'},
  {id: 'medium', name: 'Medium'},
  {id: 'hard', name: 'Hard'}
];

const types = [
  {id: 'any', name: 'Any Type'},
  {id: 'multiple', name: 'Multiple Choice'},
  {id: 'boolean', name: 'True / False'}
];

function getPreparedConfig(config) {
  return Object.keys(config).reduce((acc, key) => {
    if (config[key] && config[key] !== 'any') acc[key] = config[key];
    return acc;
  }, {});
}

export default function Config({setQueryString = f => f, setCurrentQuestion = f => f}) {
  const [config, setConfig] = useState({
    amount: 1,
    category: 'any',
    difficulty: 'any',
    type: 'any',
    number: DEFAULT_NUMBER,
    godMode: false,
  });

  const [categories, setCategories] = useState([{id: 'any', name: 'Any Category'}]);

  useEffect(() => {
    sendGetRequest(API_CATEGORY)
      .then(data => {
        setCategories([...categories, ...data['trivia_categories']]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  function confirmConfig() {
    const preparedConfig = getPreparedConfig(config);
    const queryString = getQueryStringFromObject(preparedConfig);
    setQueryString(queryString);
    const url = `${API}?${queryString}`;
    sendGetRequest(url)
      .then(data => {
        const question = data['results'][0];
        setCurrentQuestion(question);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function onChangeConfig(key, value) {
    const newConfig = {...config, [key]: value};
    if (key === 'godMode') newConfig.number = value ? 'any' : DEFAULT_NUMBER;
    setConfig(newConfig);
  }

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
          {categories.map((category, idx) =>
            <option key={idx} value={category.id}>{category.name}</option>)}
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
          {difficulties.map((difficulty, idx) =>
            <option key={idx} value={difficulty.id}>{difficulty.name}</option>)}
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
          {types.map((type, idx) =>
            <option key={idx} value={type.id}>{type.name}</option>)}
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
        <Button title='Confirm!' onClick={() => setTimeout(confirmConfig, 200)}/>
      </div>

    </div>
  );
};