const Log = require('@dazn/lambda-powertools-logger');
const correlationIds = require('@dazn/lambda-powertools-middleware-correlation-ids');
const middy = require('middy');

const handler = async (event, context) => {
    const orderPlaced = JSON.parse(event.Records[0].Sns.Message);
  
    Log.info("received message in the DLQ", { getTogetherId: orderPlaced.getTogetherId, orderId: orderPlaced.orderId, userEmail: orderPlaced.userEmail });
  
    return "all done";
};


module.exports.handler = middy(handler)
  .use(correlationIds({ sampleDebugLogRate: 0 }));