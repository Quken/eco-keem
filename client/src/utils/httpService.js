import axios from 'axios';

async function post(url, body) {
  return axios.post(url, body);
}

async function get(url) {
  return axios.get(url);
}

async function put(url, body) {
  return axios.put(url, body);
}

export { post, get, put };
