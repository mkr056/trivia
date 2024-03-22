function getQueryStringFromObject(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

const sendGetRequest = async (url) => {
  const response = await fetch(url);
  const result = await response.json();
  if (response.status !== 200) throw result;
  return result;
};

export {getQueryStringFromObject, sendGetRequest}