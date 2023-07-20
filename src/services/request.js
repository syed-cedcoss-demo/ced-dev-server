import axios from 'axios';

export const reActive = async () => {
  try {
    await axios.get('https://node-server-setup-2-0.onrender.com/');
  } catch (error) {
    console.log('error', error);
  }
};

export const postCall = async (props) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(props?.body)
    };
    const res = await fetch('https://nodejs.org/api/documentation.json', options);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    }
  } catch (error) {
    console.log('error', error);
  } finally {
    console.log('always run');
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
