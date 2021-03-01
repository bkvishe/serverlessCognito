import handler from "./libs/handler-lib";
import userPool from "./libs/cognito-lib";

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export const registerUser = handler(async (user, context) => {
    return new Promise((resolve, reject) => {
        const eventBody = JSON.parse(user.body);

        const attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:eventBody.username}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:eventBody.gender}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:type",Value:eventBody.gender}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:eventBody.email}));

        userPool.signUp(eventBody.email, eventBody.password, attributeList, null, function(err, result){
            if (err) {
                return reject(err);
            }
           return resolve(result);
        });
    });
});