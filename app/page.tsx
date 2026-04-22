"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { CompetitorForm } from "@/components/competitor-form"
import { ReportSection } from "@/components/report-section"
import { sendToWebhook } from "@/lib/webhook"
import type { WebhookResponseData } from "@/lib/webhook-types"

export default function Home() {
  const [website1, setWebsite1] = useState("CB2.com")
  const [website2, setWebsite2] = useState("WestElm.com")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [webhookData, setWebhookData] = useState<WebhookResponseData | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lastReport')
    if (saved) {
      setWebhookData(JSON.parse(saved))
      setReportGenerated(true)
    }
  }, [])

  const handleRerun = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleLoadSampleData = () => {
    const today = new Date().toISOString().split('T')[0]
    const sampleData: WebhookResponseData = {
      company_a: "CB2",
      company_b: "West Elm",
      generated: today,
      executive_summary: {
        homepage: [
          "CB2 leads with aspirational design authority messaging, positioning itself as a tastemaker rather than a retailer",
          "CB2 prioritizes editorial lifestyle content over transactional elements, reducing friction to aspiration",
          "CB2 drives conversion through a free design services CTA, lowering the barrier to high-ticket purchases",
        ],
        promotions: [
          "CB2 competes on volume with aggressive multi-tiered sales stacked across categories simultaneously",
          "West Elm protects premium positioning with a unified sale hub that avoids on-page promotional clutter",
          "West Elm leverages email capture with a 15% first-order incentive, prioritizing list growth over immediate conversion",
        ],
      },
      full_report: {
        homepage: {
          hero_message: {
            company_a: "Design-forward aspirational headline emphasizing craftsmanship and exclusivity",
            company_b: "Warm, values-led headline emphasizing sustainability and community",
            advantage: "CB2",
          },
          visual_hierarchy: {
            company_a: "High-contrast editorial imagery with sparse copy, directing attention to product",
            company_b: "Layered grid with lifestyle photography, balancing product and brand storytelling",
            advantage: "West Elm",
          },
          brand_voice: {
            company_a: "Cool, confident, architecture-influenced — speaks to the design-literate consumer",
            company_b: "Approachable, mission-driven — speaks to the values-conscious millennial buyer",
            advantage: "Tie",
          },
          call_to_action: {
            company_a: "Free design services CTA above the fold reduces friction and encourages high-value engagement",
            company_b: "Shop by room and category CTAs are functional but lack a differentiated hook",
            advantage: "CB2",
          },
        },
        promotions: {
          active_promotions: {
            company_a: "Up to 40% off sitewide sale stacked with clearance and new arrivals promotions",
            company_b: "Seasonal sale hub consolidates all discounts in one location, preserving full-price perception elsewhere",
            advantage: "West Elm",
          },
          promotional_placement: {
            company_a: "Promotions appear across multiple entry points including homepage, nav, and category pages",
            company_b: "Promotions are contained to a dedicated sale section, keeping the main experience premium",
            advantage: "West Elm",
          },
          urgency_mechanics: {
            company_a: "Limited-time countdown banners on select items create urgency at the product level",
            company_b: "Minimal urgency mechanics — relies on brand trust over scarcity tactics",
            advantage: "CB2",
          },
          target_audience: {
            company_a: "Targets design-forward urban professionals willing to pay premium for aesthetics",
            company_b: "Targets socially conscious buyers who value brand ethics alongside product quality",
            advantage: "Tie",
          },
        },
      },
      core_dynamic:
        "CB2 competes on design authority and editorial conviction while West Elm competes on promotional sophistication and values alignment. CB2 wins on aspiration; West Elm wins on trust.",
      appendix: [
        `Data sourced from live site scrape on ${today}`,
        "Promotional offers subject to change without notice",
        "Brand voice analysis based on homepage copy at time of capture",
      ],
    }
    setWebhookData(sampleData)
    setReportGenerated(true)
    localStorage.setItem('lastReport', JSON.stringify(sampleData))
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsAnalyzing(false)
  }

  const handleAnalyze = async () => {
    console.log('[v0] handleAnalyze called, current isAnalyzing:', isAnalyzing)
    
    // Prevent multiple simultaneous calls
    if (isAnalyzing) {
      console.log('[v0] Already analyzing, ignoring call')
      return
    }
    
    console.log('[v0] Starting analysis...')
    setIsAnalyzing(true)
    setWebhookData(null)
    setReportGenerated(false)
    abortControllerRef.current = new AbortController()

    try {
      console.log('[v0] Calling webhook...')
      const response = await sendToWebhook({
        event: 'analysis_started',
        timestamp: new Date().toISOString(),
        website1,
        website2,
      })

      console.log('[v0] Webhook returned, aborted:', abortControllerRef.current?.signal.aborted)
      if (abortControllerRef.current?.signal.aborted) return

      console.log('[v0] Setting webhook data and reportGenerated')
      setWebhookData(response)
      setReportGenerated(true)
      localStorage.setItem('lastReport', JSON.stringify(response))
    } catch (error) {
      console.error('[v0] Analysis failed:', error)
    } finally {
      console.log('[v0] Finally block, setting isAnalyzing to false')
      if (!abortControllerRef.current?.signal.aborted) {
        setIsAnalyzing(false)
      }
      abortControllerRef.current = null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="no-print mb-12 text-center">
          <h1 className="font-serif text-3xl tracking-wide text-foreground md:text-4xl">
            Competitive Analysis Agent
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-foreground" />
        </div>

        <div className="no-print mb-10">
          <p className="text-center text-muted-foreground leading-relaxed">
            Enter two websites to compare across four dimensions: Homepage Messaging & Visual Hierarchy, 
            Promotional Strategy & Offers, Product Discovery Experience, and AI-Powered Features.
          </p>
        </div>

        <div ref={formRef} className="no-print">
        <CompetitorForm
          website1={website1}
          website2={website2}
          setWebsite1={setWebsite1}
          setWebsite2={setWebsite2}
          onAnalyze={handleAnalyze}
          onStop={handleStop}
          onLoadSampleData={handleLoadSampleData}
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
