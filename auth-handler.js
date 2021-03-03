//import { RDS } from 'aws-sdk';

//const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const validateToken = async (token) => {

  let response = await axios.get('https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_Jtw8tAKB4/.well-known/jwks.json');

  if (response.status === 200) {
    let pems = {};
    var keys = response.data['keys'];
    for(var i = 0; i < keys.length; i++) {
        //Convert each key to PEM
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent};
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
    }
    //validate the token
    var decodedJwt = jwt.decode(token, {complete: true});
    if (!decodedJwt) {
        console.log("Not a valid JWT token");
        return {
          "message": "Not a valid JWT token"
        };
    }

    var kid = decodedJwt.header.kid;
    pem = pems[kid];
    if (!pem) {
        console.log('Invalid token1');
        return {
          "message": "Invalid token1"
        };
    }

    return jwt.verify(token, pem, function(err, payload) {
        if(err) {
            console.log("Invalid Token.");
            return {
              "message": "Invalid token"
            };
        } else {
            console.log("Valid Token.");
            console.log(payload, 'inside validate function');
            return payload;

        }
    });
  } else {
      console.log("Error! Unable to download JWKs");
      return {
        "message": "Error! Unable to download JWKs"
      };
  }
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
export const auth = async (event, context, callback) => {

  if (!event.authorizationToken) {
    return {
      "message": "Unauthorized"
    };
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return {
      "message": "Unauthorized"
    };
  }

  try {

    let res = await validateToken(tokenValue);

    //console.log(res, 'last', event.methodArn);

    return generatePolicy(res.sub, 'Allow', event.methodArn);

  } catch (err) {

    return {
      "message": "Unauthorized"
    };
  }
};