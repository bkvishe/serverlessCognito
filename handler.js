import { registerUser } from './register.js';

export const users = async (event, context) => {

  //console.log(event);

  registerUser(event).then(result => {

    //console.log(result, 'handler.js');

    return {
      statusCode: 200,
      body: result,
    };
  })
  .catch(error => {

    //console.log(error, 'handle.js');

    return {
      statusCode: 500,
      body: error,
    };
  });
};