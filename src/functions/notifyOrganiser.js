const Log = require('@dazn/lambda-powertools-logger');
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');
const middy = require('middy');
const AWSXray = require("aws-xray-sdk")
const AWS = AWSXray.captureAWS(require("aws-sdk"));

const handler = async (event, context) => {
    const orderPlaced = JSON.parse(event.Records[0].Sns.Message);

    if (orderPlaced.getTogetherId === "error"){
        throw new Error("Simulating error");
    }
  
    Log.info(`notified organiser [${orderPlaced.getTogetherId}, ${orderPlaced.orderId}, ${orderPlaced.userEmail}]`);
  
    return "all done";
};


module.exports.handler = middy(handler)
  .use(correlationIds({ sampleDebugLogRate: 0 }));