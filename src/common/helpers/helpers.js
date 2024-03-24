function shuffleArray(array = []) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getQueryStringFromObject(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function getObjectFromQueryString(queryString) {
  const keyValuePairs = queryString.split('&');
  const obj = {};
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.split('=');
    obj[key] = decodeURIComponent(value);
  });
  return obj;
}

function decodeHtmlText(text = '') {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.value;
}


const sendGetRequest = async (url = '') => {
  const response = await fetch(url);
  const result = await response.json();
  if (response.status !== 200) throw result;
  return result;
};

export {
  shuffleArray,
  getQueryStringFromObject,
  getObjectFromQueryString,
  decodeHtmlText,
  sendGetRequest
};