export async function handler(event) {
    // Helper function to retrieve contexts
    function getContext(outputContexts, contextName) {
        return outputContexts.find(ctx => ctx.name.endsWith(`/contexts/${contextName}`));
    }
    
    try {
        const body = JSON.parse(event.body);
        const queryResult = body.queryResult;
        const detectedIntent = queryResult.intent.displayName;
        const userInput = queryResult.queryText;
        const botResponse = queryResult.fulfillmentText;
        const confidence = queryResult.intentDetectionConfidence;
        const sentiment = queryResult.sentimentAnalysisResult?.queryTextSentiment?.score || "N/A";
        const endConversation = queryResult.intent?.endInteraction;

        // Retrieve MaximumSlotAttempts from Genesys Input context
        const genesysGreetingContext = getContext(queryResult.outputContexts, 'genesys_greeting');
        const MaximumSlotAttemptsInput = genesysGreetingContext?.parameters?.MaximumSlotAttempts || "2";

        // Retrieve current MaximumSlotAttempts from context
        const genesysOutputContext = getContext(queryResult.outputContexts, 'genesys-output');
        let MaximumSlotAttempts = parseInt(genesysOutputContext?.parameters?.MaximumSlotAttempts) || 0;
        let slotAttemptsCount = parseInt(genesysOutputContext?.parameters?.slotAttemptsCount) || 0;
        const previousIntent = genesysOutputContext?.parameters?.previousIntent || "";
        const previousBotResponse = genesysOutputContext?.parameters?.previousBotResponse || "";
        
        // Check slot attempts
        let isMaximumSlotAttempt = false;
        if (queryResult.parameters && !queryResult.allRequiredParamsPresent) {
            if (detectedIntent === previousIntent && botResponse === previousBotResponse) {
                slotAttemptsCount++;
                if (slotAttemptsCount >= MaximumSlotAttempts) {
                    isMaximumSlotAttempt = true;
                }
            }
        }

        // Conversation transcript
        let conversationHistory = genesysOutputContext?.parameters?.transcripts || "";
        const newSegment = `${userInput}(${confidence})(${sentiment})|${botResponse}|`;
        conversationHistory += newSegment;
        if (endConversation) {
            conversationHistory = conversationHistory.replace(/\|$/, "");
        }

        // Build response with updated context
        let response = {
            fulfillmentText: botResponse,
            outputContexts: [
                {
                    name: `${body.session}/contexts/genesys-output`,
                    lifespanCount: 50,
                    parameters: {
                        transcripts: conversationHistory,
                        previousIntent: detectedIntent,
                        previousBotResponse: botResponse,
                        MaximumSlotAttempts: MaximumSlotAttemptsInput || MaximumSlotAttempts,
                        slotAttemptsCount: slotAttemptsCount
                    }
                }
            ]
        };

        if (isMaximumSlotAttempt) {
            response.followupEventInput = { name: "GENESYS_SLOT_FILLING_CANCELLED" };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error("Error in Lambda function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
}
