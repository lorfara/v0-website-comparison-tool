"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { CompetitorForm } from "@/components/competitor-form"
import { ReportSection } from "@/components/report-section"
import { sendToWebhook, type WebhookResponseData } from "@/lib/webhook"

export default function Home() {
  const [website1, setWebsite1] = useState("CB2.com")
  const [website2, setWebsite2] = useState("WestElm.com")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [webhookData, setWebhookData] = useState<WebhookResponseData | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleRerun = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsAnalyzing(false)
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setWebhookData(null)
    abortControllerRef.current = new AbortController()

    try {
      const response = await sendToWebhook({
        event: 'analysis_started',
        timestamp: new Date().toISOString(),
        website1,
        website2,
      })

      if (abortControllerRef.current?.signal.aborted) return

      setWebhookData(response)
      setReportGenerated(true)
    } catch (error) {
      console.error('[v0] Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl tracking-wide text-foreground md:text-4xl">
            Competitive Analysis Agent
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-foreground" />
        </div>

        <div className="mb-10">
          <p className="text-center text-muted-foreground leading-relaxed">
            Enter two websites to compare across four dimensions: Homepage Messaging & Visual Hierarchy, 
            Promotional Strategy & Offers, Product Discovery Experience, and AI-Powered Features.
          </p>
        </div>

        <div ref={formRef}>
        <CompetitorForm
          website1={website1}
          website2={website2}
          setWebsite1={setWebsite1}
          setWebsite2={setWebsite2}
          onAnalyze={handleAnalyze}
          onStop={handleStop}
          isAnalyzing={isAnalyzing}
        />
        </div>

        {reportGenerated && (
          <ReportSection 
            website1={website1} 
            website2={website2}
            onRerun={handleRerun}
            webhookData={webhookData}
          />
        )}
      </main>
    </div>
  )
}
