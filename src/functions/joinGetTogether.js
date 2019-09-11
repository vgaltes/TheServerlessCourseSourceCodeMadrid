/* eslint-disable import/no-unresolved */
const AWSXray = require("aws-xray-sdk")
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const chance = require("chance").Chance();
const Log = require('@dazn/lambda-powertools-logger');
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');
const middy = require('middy');
const SNS = require('@dazn/lambda-powertools-sns-client');
const epsagon = require("epsagon");

epsagon.init({
    token: "4631348e-1228-44f4-937b-0a503d298a8c",
    appName: process.env.service,
    metadataOnly: false
  });

const handler = epsagon.lambdaWrapper(async (event, context) => {
  const body = JSON.parse(event.body);
  const getTogetherId = body.getTogetherId;
  const userEmail = body.userEmail;

  const orderId = chance.guid();
  Log.info(`user ${userEmail} joining gettogether ${getTogetherId}`);

  const data = {
    orderId,
    getTogetherId,
    userEmail
  };

  const params = {
    Message: JSON.stringify(data),
    TopicArn: process.env.joinGetTogetherSnsTopic
  };

  await SNS.publish(params).promise();

  Log.info("published 'join_getTogether' event");

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  };

  return response;
});

module.exports.handler = middy(handler)
    .use(correlationIds({ sampleDebugLogRate: 0 }));