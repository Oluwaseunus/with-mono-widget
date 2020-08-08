export const fetchRequest = ({ url, options = {} }, callback) => {
  return fetch(`https://api.withmono.com${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'mono-sec-key': process.env.REACT_APP_SECRET,
    },
  })
    .then((response) => response.json())
    .catch(callback);
};
