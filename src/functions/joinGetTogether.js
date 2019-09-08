/* eslint-disable import/no-unresolved */
const AWS = require("aws-sdk");
const chance = require("chance").Chance();
const sns = new AWS.SNS();
const Log = require('@dazn/lambda-powertools-logger');

module.exports.handler = async (event, context) => {
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

  await sns.publish(params).promise();

  Log.info("published 'join_getTogether' event");

  const response = {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  };

  return response;
};