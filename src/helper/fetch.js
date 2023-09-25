import axios from 'axios';
import {Alert} from 'react-native';
import {PGYER_DOMAIN} from '../constants/api.url';
const baseUrl = PGYER_DOMAIN + 'apiv2/';

async function get(url = '', data = {}) {
  if (!url) {
    return {};
  }
  try {
    const params = new URLSearchParams(data);
    const query = params.toString();
    const response = await axios.get(`${baseUrl}${url}?${query}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return Alert.alert('出错了!');
  }
}

async function post(url = '', data = {}) {
  if (!url) {
    return {};
  }

  try {
    const response = await axios
      .post(`${baseUrl}${url}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data);
    return response;
  } catch (error) {
    console.error(error);
    return Alert.alert('出错了!');
  }
}

export {get, post};
