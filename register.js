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

export const registerUser = (user) => {

    return new Promise((resolve, reject) => {

        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:user.name}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:user.gender}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:user.email}));

        userPool.signUp(user.email, user.password, attributeList, null, function(err, result){
            if (err) {
                //console.log(err, 'error - register');
                return reject(err);
            }

            //console.log(result, 'register');

            return resolve(result);
        });
    });
};