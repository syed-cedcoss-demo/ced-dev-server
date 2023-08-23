import axios from 'axios';

export const reActive = async () => {
  try {
    await axios.get('https://ced-dev-server.onrender.com/');
  } catch (error) {
    console.log('error', error);
  }
};

export const postCall = async (props) => {
  try {
    const url = `https://api.bigcommerce.com/stores/${props?.storeHash}/${props?.url}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Auth-Token': props?.accessToken
      },
      body: JSON.stringify(props?.body)
    };
    const res = await fetch(url, options);
    return await res.json();
  } catch (error) {
    console.log('error', error);
  }
};

export const getCall = async (props) => {
  try {
    const url = `https://api.bigcommerce.com/stores/${props?.storeHash}/${props?.url}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Auth-Token': props?.accessToken
      }
    };
    const res = await fetch(url, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
