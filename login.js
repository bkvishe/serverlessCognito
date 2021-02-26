const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
//const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
//const AWS = require('aws-sdk');
//const request = require('request');
//const jwkToPem = require('jwk-to-pem');
//const jwt = require('jsonwebtoken');
//global.fetch = require('node-fetch');

const poolData = {
    UserPoolId : "ap-south-1_Jtw8tAKB4",
    ClientId : "kmlu1nc7hbie0lu7ardqpo0cg"
};

//const pool_region = 'ap-south-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const loginUser = (user) => {

    return new Promise((resolve, reject) => {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username : user.username,
            Password : user.password,
        });

        var userData = {
            Username : user.username,
            Pool : userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
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
                console.log(err);

                return reject(err);
            },
        });
    });
};