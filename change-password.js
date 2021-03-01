import handler from "./libs/handler-lib";
import userPool from "./libs/cognito-lib";
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');


export const changePassword = handler(async (user, context) => {

    return new Promise((resolve, reject) => {

        const eventBody = JSON.parse(user);
        //const eventBody = user;

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: eventBody.username,
            Password: eventBody.password,
        });

        var userData = {
            Username: eventBody.username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.changePassword(eventBody.password, eventBody.newPassword, (err, result) => {

                    if (err) {

                        return reject(err);
                    } else {

                        return resolve(result);
                    }
                });
            },
            onFailure: function (err) {

                return reject(err);
            },
        });
    });
});