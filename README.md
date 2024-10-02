Prerequisites:

Configure the webhook for GDF agent

Now that the webhook exists as a service, you need to associate this webhook with your agent. This is done via fulfillment. To enable and manage fulfillment for your agent:

Go to the Dialogflow ES Console.
Select the intent bot agent you just created.
Select Fulfillment in the left sidebar menu.
Toggle the Webhook field to Enabled.
Provide the URL pointint to AWS Lambda API: "https://0lj6bguu76.execute-api.ap-southeast-2.amazonaws.com/intentbot". Leave all other fields blank.
Click Save at the bottom of the page.

Now that fulfillment is enabled for the agent, you need to enable fulfillment for each intent except for greeting intent:

Select Intents in the left sidebar menu.
Scroll down to the Fulfillment section.
Toggle Enable webhook call for this intent to on.
Toggle Enable webhook call for slot filling to on.
Click Save.
