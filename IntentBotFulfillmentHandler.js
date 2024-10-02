export async function handler(event) {
    try {
        const body = JSON.parse(event.body); // Parse Dialogflow request

        const queryResult = body.queryResult;
        const userInput = queryResult.queryText;
        const botResponse = queryResult.fulfillmentText;
        const confidence = queryResult.intentDetectionConfidence;
        const sentiment = queryResult.sentimentAnalysisResult
            ? queryResult.sentimentAnalysisResult.queryTextSentiment.score
            : "N/A";
            
        // Check if the conversation is ending
        const endConversation = queryResult.intent && queryResult.intent.endInteraction;
        
        // Retrieve current transcript context
        let conversationHistory = "";
        if (queryResult.outputContexts && queryResult.outputContexts.length > 0) {
            const context = queryResult.outputContexts.find(ctx => ctx.name.endsWith('/contexts/genesys-output'));
            if (context && context.parameters && context.parameters.transcripts) {
                conversationHistory = context.parameters.transcripts; // Get existing transcripts
            }
        }

        // Add new dialogue segment
        const newSegment = `${userInput}(${confidence})(${sentiment})|${botResponse}|`;
        conversationHistory += newSegment;
        if (endConversation) {
            conversationHistory = conversationHistory.replace(/\|$/, "");
        }

        // Build response with updated context
        const response = {
            fulfillmentText: botResponse,
            outputContexts: [
                {
                    name: `${body.session}/contexts/genesys-output`,
                    lifespanCount: 50, // Lifespan of the context 50 turns
                    parameters: {
                        transcripts: conversationHistory
                    }
                }
            ]
        };

        // Return the fulfilment response
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error("Error in Lambda function:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
}