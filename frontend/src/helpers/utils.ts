import axios from 'axios';
export const http = axios.create({
  baseURL: 'https://denali-prod.netlify.app/api/v1/',
});

export const retreiveTokens = () => {
  const storage = localStorage.getItem('tokens');
  let tokens;
  if (storage) {
    tokens = JSON.parse(storage);
  }
  return tokens;
};
