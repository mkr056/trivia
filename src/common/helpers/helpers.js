/**
 * Shuffles the elements of an array.
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array = []) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Converts an object into a query string.
 * @param {Object} object - The object to be converted.
 * @returns {string} The query string representation of the object.
 */
function getQueryStringFromObject(object = {}) {
  return Object.entries(object)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

/**
 * Converts a query string into an object.
 * @param {string} queryString - The query string to be converted.
 * @returns {Object} The object representation of the query string.
 */
function getObjectFromQueryString(queryString = '') {
  const keyValuePairs = queryString.split('&');
  const object = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    object[key] = decodeURIComponent(value);
  });
  return object;
}

/**
 * Decodes HTML entities in a text.
 * @param {string} text - The text containing HTML entities to be decoded.
 * @returns {string} The decoded text.
 */

/*
This is required because the requested JSON may contain special symbols (&quot;, &deg;, etc.),
which are rendered on the screen as is, without any interpretation.
*/
function decodeHtmlText(text = '') {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.value;
}

/**
 * Sends a GET request to the specified URL and returns the JSON response.
 * @param {string} url - The URL to send the GET request to.
 * @returns {Promise} A Promise that resolves with the JSON response or rejects with an error.
 */
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