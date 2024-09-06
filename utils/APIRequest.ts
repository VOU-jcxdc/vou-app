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

async function doGet(url: string, query?: string) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data;
}

async function doPut(url: string, data: any) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.put(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data;
}

async function doPutImage(url: string, data: ArrayBuffer) {
  const response = await axios.put(url, data, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });

  return response;
}

async function doDelete(url: string) {
  const token = (await AsyncStorage.getItem('token')) || '';

  const response = await axios.delete(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data;
}

export { doDelete, doGet, doPost, doPut, doPutImage };
