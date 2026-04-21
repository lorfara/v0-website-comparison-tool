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

    // Get the raw text first to handle empty or invalid JSON responses
    const text = await response.text()
    console.log('[v0] Webhook raw response:', text)

    if (!text || text.trim() === '') {
      console.log('[v0] Webhook returned empty response')
      return null
    }

    try {
      const parsed = JSON.parse(text) as WebhookResponseData
      console.log('[v0] Webhook parsed response:', JSON.stringify(parsed, null, 2))
      return parsed
    } catch (parseError) {
      console.error('[v0] Failed to parse webhook response as JSON:', parseError)
      return null
    }
  } catch (error) {
    console.error('[v0] Failed to send to webhook:', error)
    return null
  }
}
