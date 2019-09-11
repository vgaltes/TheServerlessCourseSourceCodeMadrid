const Log = require('@dazn/lambda-powertools-logger');
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');
const middy = require('middy');
const AWSXray = require("aws-xray-sdk")
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const epsagon = require("epsagon");

epsagon.init({
    token: "4631348e-1228-44f4-937b-0a503d298a8c",
    appName: process.env.service,
    metadataOnly: false
  });
  
const handler = epsagon.lambdaWrapper(async (event, context) => {
    const orderPlaced = JSON.parse(event.Records[0].Sns.Message);

    if (orderPlaced.getTogetherId === "error"){
        throw new Error("Simulating error");
    }
  
    Log.info(`notified organiser [${orderPlaced.getTogetherId}, ${orderPlaced.orderId}, ${orderPlaced.userEmail}]`);
  
    return "all done";
});


module.exports.handler = middy(handler)
  .use(correlationIds({ sampleDebugLogRate: 0 }));