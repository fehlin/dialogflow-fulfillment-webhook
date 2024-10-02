# Dialogflow Fulfillment Webhook Setup

This guide explains how to configure the webhook for a Dialogflow ES agent and integrate it with Genesys Cloud Architect Flow to manage session variables, including capturing conversation transcripts as participant data.

### 1. Configure the Webhook for Dialogflow ES Agent

Now that the webhook exists as a service, you need to associate this webhook with your Dialogflow agent. This is done via the **Fulfillment** settings.

#### Steps:

1. Go to the [Dialogflow ES Console](https://dialogflow.cloud.google.com/).
2. Select the intent bot agent you created.
3. In the left sidebar menu, select **Fulfillment**.
4. Toggle the **Webhook** field to **Enabled**.
5. Provide the URL pointing to AWS Lambda API: https://0lj6bguu76.execute-api.ap-southeast-2.amazonaws.com/intentbot   Leave all other fields blank.
6. Click **Save** at the bottom of the page.

#### Enable Fulfillment for Intents:

Once fulfillment is enabled for the agent, you need to enable it for each intent except for the greeting intent.

1. In the left sidebar menu, select **Intents**.
2. For each intent (except for greeting):
- Scroll down to the **Fulfillment** section.
- Toggle **Enable webhook call for this intent** to **on**.
- Toggle **Enable webhook call for slot filling** to **on**.
3. Click **Save**.

### 2. Configure Genesys Cloud Architect Flow

To capture and retrieve conversation transcripts between the customer and the Dialogflow bot, configure the Genesys Cloud Architect Flow with session variables.

#### Steps:

1. From where the **Call Dialogflow Bot** action is placed in the flow, set **Session Variables - Outpus**:
- **Key Name 1**: `transcripts`
- **Variable to Assign 1**: `<any variable to retrieve transcript context value>`
