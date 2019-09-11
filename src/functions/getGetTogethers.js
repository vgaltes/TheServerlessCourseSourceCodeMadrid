const AWSXray = require("aws-xray-sdk")
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const middy = require("middy");
const { ssm } = require("middy/middlewares");
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');
const epsagon = require("epsagon");
const http = require('http');
const FunctionShield = require('@puresec/function-shield');
FunctionShield.configure({
    policy: {
        // 'block' mode => active blocking
        // 'alert' mode => log only
        // 'allow' mode => allowed, implicitly occurs if key does not exist
        outbound_connectivity: "alert",
        read_write_tmp: "block", 
        create_child_process: "block",
        read_handler: "block" },
    token: process.env.functionShieldToken });

const dynamodb = new AWS.DynamoDB.DocumentClient();

epsagon.init({
  token: "4631348e-1228-44f4-937b-0a503d298a8c",
  appName: process.env.service,
  metadataOnly: false
});

const handler = epsagon.lambdaWrapper(async (event, context) => {

  http.get('http://vgaltes.com');

  const count = 8;

  const req = {
    TableName: context.tableName,
    Limit: count
  };

  const resp = await dynamodb.scan(req).promise();

  const res = {
    statusCode: 200,
    body: JSON.stringify(resp.Items)
  };

  return res;
});

module.exports.handler = middy(handler)
  .use(ssm({
      cache: true,
      cacheExpiryInMillis: 3 * 60 * 1000,
      setToContext: true,
      names: {
        tableName: `${process.env.getTogethersTableNamePath}`
      }
    })
  )
  .use(correlationIds({ sampleDebugLogRate: 0 }));