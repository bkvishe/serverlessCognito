import { registerUser } from './register.js';
import { loginUser } from './login.js';

export const users = async (event, context) => {

  let response = {};

  if(event.path === '/register' && event.httpMethod === 'POST') {
    registerUser(event).then(result => {

      console.log(result, 'handler.js');

      response = {
        statusCode: 200,
        body: result,
      };
    })
    .catch(error => {

      console.log(error, 'handle.js');

      response = {
        statusCode: 500,
        body: error,
      };
    });
  }
  else if(event.path === '/login' && event.httpMethod === 'POST') {

    loginUser(event).then(result => {

      console.log(result, 'handler.js');

      response = {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
      };
    })
    .catch(error => {

      console.log(error, 'handle.js');

      response = {
        statusCode: 500,
        body: error,
      };
    });
  }
  else{

    response = {
      statusCode: 404,
      body: 'Invalid request',
    };
  }

  return response;
};