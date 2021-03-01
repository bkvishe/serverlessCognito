import handler from "./libs/handler-lib";
import userPool from "./libs/cognito-lib";
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');


export const forgotPassword = handler(async (user, context) => {

    return new Promise((resolve, reject) => {

        const eventBody = JSON.parse(user);
        //const eventBody = user;

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username : eventBody.username,
            Pool : userPool
        });

        if(eventBody.path === '/forgotPasswordTriggerCode' && eventBody.httpMethod === 'POST') {

            cognitoUser.forgotPassword({
                onSuccess: function(data) {

                    return resolve(data);
                },
                onFailure: function(err) {

                    return reject(err);
                }
            });
        }
        else if(eventBody.path === '/forgotPasswordVerifyCode' && eventBody.httpMethod === 'POST') {

            cognitoUser.confirmPassword(eventBody.verificationCode, eventBody.newPassword, {
                onSuccess() {

                    return resolve({
                        "message": "Password successfully changed!"
                    });
                },
                onFailure(err) {

                    return reject(err);
                },
            });
        }
        else{

            return reject({
                "message": "Invalid request"
            });
        }
    });
});