# EmailService API

This project is an Express API that utilizes a custom EmailService to send emails through multiple providers with advanced features such as retry logic, circuit breaking, rate limiting, and idempotency. The API is designed to handle email sending requests and provides feedback on the status of each email and provider.


## Features

• Retry Logic: Automatically retries sending an email up to a maximum number of attempts if it fails.

• Circuit Breaker: Disables a provider temporarily if it fails consecutively beyond a threshold, preventing further attempts.

• Rate Limiting: Controls the maximum number of emails sent within a defined time interval.

• Idempotency: Ensures that duplicate email requests are identified and not reprocessed.

• Provider Fallback: Automatically switches to alternative providers if the primary provider fails.


## Installation

Clone the repository:

```bash
  git clone https://github.com/yourusername/emailservice-api.git
  cd emailservice-api
```
Install the required dependencies:

```bash
  npm install
```
Start the server

```bash
  npm run start
```
## Usage

### Running the API Server

Start the Express server:

```bash
  npm start
```
The server will run on http://localhost:3000 by default. You can change the port by setting the PORT environment variable.




## API Endpoints

#### 1. Send Emails
• Endpoint: /send-emails

• Method: POST

• Description: Sends a list of emails using the configured providers.

• Request Body:
```json
{
  "emails": [
    {
      "to": "recipient@example.com",
      "subject": "Email Subject",
      "body": "Email Body"
    },
    ...
  ]
}
```
• Response:
```json
{
  "emailStatus": [
    {
      "id": "uniqueEmailId",
      "success": true,
      "provider": "EmailProviderA",
      "tries": 1,
      "timestamp": "2024-08-28T00:00:00.000Z"
    },
    ...
  ],
  "providerStatus": [
    {
      "provider": "EmailProviderA",
      "isOpen": true,
      "successCount": 10,
      "failureCount": 2,
      "totalFailure": 3,
      "threshold": 3
    },
    ...
  ]
}
```
• Error Responses:

400 Bad Request: Invalid input when the emails array is not provided or is malformed.



## Running Tests

To test the functionality of the EmailService, you can run the provided test script:

Execute the test script:
```bash
  node test.js
```
The output will show the status of each email sent and the status of each provider.


## Customization

You can modify the behavior of the EmailService by adjusting the following parameters in main.js:

• maxRetries: The maximum number of retry attempts for each provider.

• backoffFactor: The base delay time (in ms) used for exponential backoff during retries.

• circuitBreakerThreshold: The number of consecutive failures required to trigger the circuit breaker for a provider.

• rateLimit: The maximum number of emails that can be sent per interval.

• rateLimitInterval: The interval (in ms) for the rate limiting mechanism.