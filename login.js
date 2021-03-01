import handler from "./libs/handler-lib";
import userPool from "./libs/cognito-lib";
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');


export const loginUser = handler(async (user, context) => {

    return new Promise((resolve, reject) => {
        const eventBody = JSON.parse(user.body);

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username : eventBody.username,
            Password : eventBody.password,
        });

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username : eventBody.username,
            Pool : userPool
        });
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {

                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('id token + ' + result.getIdToken().getJwtToken());
                console.log('refresh token + ' + result.getRefreshToken().getToken());

                return resolve({
                    access_token: result.getAccessToken().getJwtToken(),
                    id_token: result.getIdToken().getJwtToken(),
                    refresh_token: result.getRefreshToken().getToken()
                });
            },
            onFailure: function(err) {
                return reject(err);
            },
        });
    });
});