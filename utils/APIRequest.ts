import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

async function doPost(url: string, data: any) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function doGet(url: string) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data;
}

async function doPatch(url: string, data: any) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.patch(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data;
}

export { doGet, doPatch, doPost };
