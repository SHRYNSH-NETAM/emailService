class EmailService {
    constructor(providers) {
        this.statusMap = new Map(); // For idempotency and status tracking
        this.maxRetries = 3;
        this.backoffFactor = 1000; // ms
        this.circuitBreakerThreshold = 5;
        this.circuitBreakerCount = {};
        this.rateLimit = 5; // max emails per interval
        this.rateLimitInterval = 3000; // 3 seconds
        this.emailQueue = [];
        this.providers = providers.map(provider => ({ //providers status array
            provider: provider,
            isOpen: true,
            successCount: 0,
            failureCount: 0,
            totalFailure: 0,
            threshold: 3,
        }));
    }

    // Simulates sending an email with the given provider
    async sendWithProvider(provider, email) {
        const success = await provider.provider.sendEmail(email);
        if (!success) {
            provider.failureCount++;
            provider.totalFailure++;
            if (provider.isOpen && provider.failureCount >= provider.threshold) {
                provider.isOpen = false;
            }
        } else {
            provider.isOpen = true;
            provider.failureCount = 0;
        }
        return success;
    }

    // Attempt to send the email with retry logic and fallback between providers
    async sendEmailAttempt(email) {
        const uniqueId = this.generateUniqueId(email);
        console.log(`Sending Email with ID:${uniqueId} -->`);
        if (this.statusMap.has(uniqueId) && this.statusMap.get(uniqueId).success===true) {
            console.log(`           Email already sent. Skipping...\n`);
            return;
        }
    
        for (let i = 0; i < this.providers.length; i++) {
            const providerName = this.providers[i].provider.constructor.name;

            let attempt = 1;
            while (attempt <= this.maxRetries) {
                const sent = await this.sendWithProvider(this.providers[i], email);
    
                if (sent) {
                    const status = {
                        id: uniqueId,
                        success: true,
                        provider: providerName,
                        tries: attempt+(this.maxRetries*i),
                        timestamp: new Date()
                    };
                    this.providers[i].provider.successCount++;
                    this.statusMap.set(uniqueId, status);
                    console.log(`           Sent successfully via ${providerName} on ${attempt} attempt.\n`);
                    return;
                } else {
                    console.warn(`           Attempt ${attempt} failed for ${providerName}.`);
                    
                    // Break out of retry loop if circuit breaker is triggered
                    if (!this.providers[i].isOpen) {
                        console.error(`           Circuit breaker triggered for ${providerName}. No more attempts.`);
                        break;
                    }
    
                    // Exponential backoff: baseDelay * 2^(attempt-1)
                    const delayTime = this.backoffFactor * Math.pow(2, attempt - 1);
                    await this.delay(delayTime);
                }
                attempt++;
            }
        }
        const status = {
            id: uniqueId,
            success: false,
            provider: "",
            tries: this.providers.length*this.maxRetries,
            timestamp: new Date()
        };
        this.statusMap.set(uniqueId, status);
        console.error('           All providers failed. This Email could not be sent.\n');
    }    

    // Delay function for retry logic
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Process the queue with rate limiting
    async processQueue(emailStatus, providerStatus) {
        while (this.emailQueue.length > 0) {
            const emailsToSend = this.emailQueue.splice(0, this.rateLimit);
            for (const email of emailsToSend) {
                await this.sendEmailAttempt(email);
            }
            await this.delay(this.rateLimitInterval);
        }
        this.statusMap.forEach((values, keys) => {
            emailStatus.push(values);
        });
        providerStatus.push(...this.providers);
    }

    // Public method to send an email (adds to the queue)
    async sendEmail(emails, emailStatus, providerStatus) {
        emails.forEach(email => {
            this.emailQueue.push(email);
        });
        await this.processQueue(emailStatus, providerStatus);
    }
    
    generateUniqueId(email) {
        let str = `${email.to}-${email.subject}-${email.body}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(36); // Convert to base36 for shorter representation
    }
}

// Mock email providers
class EmailProviderA {
    async sendEmail(email) {
        // Simulate random success/failure
        return Math.random() > 0.5;
    }
}

class EmailProviderB {
    async sendEmail(email) {
        // Simulate random success/failure
        return Math.random() > 0.5;
    }
}

module.exports = {
    EmailService,
    EmailProviderA,
    EmailProviderB
};