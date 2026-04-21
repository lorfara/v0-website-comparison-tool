'use server'

export interface WebhookResponseData {
  homepageMessaging?: { findings: string[] }
  promotionalStrategy?: { findings: string[] }
  productDiscovery?: { findings: string[] }
  aiFeatures?: { findings: string[] }
}

export async function sendToWebhook(data: object): Promise<WebhookResponseData | null> {
  try {
    const response = await fetch(
      'https://loreleifara.app.n8n.cloud/webhook-test/cfaab260-e02b-46d6-9113-3f27b7ad5442',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      console.error('[v0] Webhook error:', response.status)
      return null
    }

    return response.json() as Promise<WebhookResponseData>
  } catch (error) {
    console.error('[v0] Failed to send to webhook:', error)
    return null
  }
}
