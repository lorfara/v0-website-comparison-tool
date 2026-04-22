import type { WebhookResponseData } from './webhook-types'

export type { WebhookResponseData }

const WEBHOOK_URL = 'https://loreleifara.app.n8n.cloud/webhook/cfaab260-e02b-46d6-9113-3f27b7ad5442'

export async function sendToWebhook(data: object): Promise<WebhookResponseData | null> {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`)
  }

  const text = await response.text()
  if (!text || text.trim() === '') return null

  return JSON.parse(text) as WebhookResponseData
}
