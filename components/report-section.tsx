"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"
import { type WebhookResponseData } from "@/lib/webhook"

type TabId = "executive" | "full"

interface ReportSectionProps {
  website1: string
  website2: string
  onRerun: () => void
  webhookData: WebhookResponseData | null
}

interface FeedbackState {
  rating: "helpful" | "not-helpful" | null
  showChat: boolean
  question: string
  messages: { role: "user" | "assistant"; content: string }[]
}

export function ReportSection({ website1, website2, onRerun, webhookData }: ReportSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("executive")
  const [feedback, setFeedback] = useState<Record<number, FeedbackState>>({})

  // Data mappings based on webhook structure
  const executiveHomepage = webhookData?.executive_summary?.homepage ?? ["coming soon", "coming soon", "coming soon"]
  const executivePromotions = webhookData?.executive_summary?.promotions ?? ["coming soon", "coming soon", "coming soon"]

  const fullHomeHero = webhookData?.full_report?.homepage?.hero_message
  const fullHomeVisual = webhookData?.full_report?.homepage?.visual_hierarchy
  const fullHomeBrand = webhookData?.full_report?.homepage?.brand_voice
  const fullHomeCTA = webhookData?.full_report?.homepage?.call_to_action

  const fullPromoActive = webhookData?.full_report?.promotions?.active_promotions
  const fullPromoPlacement = webhookData?.full_report?.promotions?.promotional_placement
  const fullPromoUrgency = webhookData?.full_report?.promotions?.urgency_mechanics
  const fullPromoAudience = webhookData?.full_report?.promotions?.target_audience

  const coreDynamic = webhookData?.core_dynamic ?? "coming soon"
  const appendix = webhookData?.appendix ?? []

  const getFeedback = (index: number): FeedbackState => {
    return feedback[index] || { rating: null, showChat: false, question: "", messages: [] }
  }

  const handlePrintExecutive = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Executive Summary - ${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 8.5in; margin: 0 auto; padding: 1in; }
            h1 { font-size: 28px; margin-bottom: 8px; letter-spacing: 2px; }
            .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
            h2 { font-size: 18px; margin-top: 32px; margin-bottom: 16px; letter-spacing: 1px; }
            ul { margin-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 8px; }
            @media print { body { margin: 0; padding: 0; } .container { padding: 0.75in; } }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Executive Summary</h1>
            <div class="subtitle">${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2} • Generated ${webhookData?.generated || new Date().toLocaleDateString()}</div>
            
            <h2>Homepage Messaging & Visual Hierarchy</h2>
            <ul>
              ${executiveHomepage.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            
            <h2>Promotional Strategy & Offers</h2>
            <ul>
              ${executivePromotions.map((f) => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(content)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  const handlePrintFull = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Full Report - ${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 8.5in; margin: 0 auto; padding: 1in; }
            h1 { font-size: 28px; margin-bottom: 8px; letter-spacing: 2px; }
            .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
            h2 { font-size: 18px; margin-top: 32px; margin-bottom: 20px; letter-spacing: 1px; page-break-after: avoid; }
            h3 { font-size: 12px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            p { margin-bottom: 12px; }
            strong { color: #1a1a1a; font-weight: 600; }
            .section { margin-bottom: 24px; page-break-inside: avoid; }
            .key-insight { background: #f5f0eb; padding: 16px; margin: 32px 0; border-left: 4px solid #1a1a1a; }
            @media print { body { margin: 0; padding: 0; } .container { padding: 0.75in; } h2 { page-break-before: avoid; } }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Full Competitive Analysis Report</h1>
            <div class="subtitle">${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2} • Generated ${webhookData?.generated || new Date().toLocaleDateString()}</div>
            
            <h2>Homepage Messaging & Visual Hierarchy</h2>
            <div class="section">
              <h3>Hero Message</h3>
              <p><strong>${website1}:</strong> ${fullHomeHero?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullHomeHero?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullHomeHero?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Visual Hierarchy</h3>
              <p><strong>${website1}:</strong> ${fullHomeVisual?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullHomeVisual?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullHomeVisual?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Brand Voice</h3>
              <p><strong>${website1}:</strong> ${fullHomeBrand?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullHomeBrand?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullHomeBrand?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Call-to-Action</h3>
              <p><strong>${website1}:</strong> ${fullHomeCTA?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullHomeCTA?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullHomeCTA?.advantage || "coming soon"}</p>
            </div>
            
            <h2>Promotional Strategy & Offers</h2>
            <div class="section">
              <h3>Active Promotions</h3>
              <p><strong>${website1}:</strong> ${fullPromoActive?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullPromoActive?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullPromoActive?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Promotional Placement</h3>
              <p><strong>${website1}:</strong> ${fullPromoPlacement?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullPromoPlacement?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullPromoPlacement?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Urgency Mechanics</h3>
              <p><strong>${website1}:</strong> ${fullPromoUrgency?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullPromoUrgency?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullPromoUrgency?.advantage || "coming soon"}</p>
            </div>
            <div class="section">
              <h3>Target Audience</h3>
              <p><strong>${website1}:</strong> ${fullPromoAudience?.company_a || "coming soon"}</p>
              <p><strong>${website2}:</strong> ${fullPromoAudience?.company_b || "coming soon"}</p>
              <p><strong>Advantage:</strong> ${fullPromoAudience?.advantage || "coming soon"}</p>
            </div>
            
            ${coreDynamic && coreDynamic !== "coming soon" ? `<div class="key-insight"><strong>Key Insight:</strong> ${coreDynamic}</div>` : ""}
            
            ${appendix && appendix.length > 0 ? `<h2>Appendix</h2><ul>${appendix.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(content)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "executive", label: "Executive Summary" },
    { id: "full", label: "Full Report" },
  ]

  return (
    <div className="bg-card">
      {/* Tab Bar */}
      <div className="flex items-end justify-between border-b border-border px-8 pt-8 pb-0">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-serif text-sm tracking-wide transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pb-3">
          {activeTab === "executive" ? (
            <Button
              onClick={handlePrintExecutive}
              variant="outline"
              className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          ) : (
            <Button
              onClick={handlePrintFull}
              variant="outline"
              className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          )}
        </div>
      </div>

      {/* Executive Summary Tab */}
      {activeTab === "executive" && (
        <div className="divide-y divide-border">
          {/* Homepage Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>
            <ul className="flex flex-col gap-3">
              {executiveHomepage.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 bg-foreground" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              Promotional Strategy & Offers
            </h4>
            <ul className="flex flex-col gap-3">
              {executivePromotions.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 bg-foreground" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              AI-Powered Features
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>
        </div>
      )}

      {/* Full Report Tab */}
      {activeTab === "full" && (
        <div className="divide-y divide-border">
          {/* Homepage Section */}
          <div className="px-8 py-8">
            <h4 className="mb-8 font-serif text-lg font-semibold tracking-wide text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>

            <div className="mb-8 space-y-6">
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Hero Message</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullHomeHero?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullHomeHero?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullHomeHero?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Visual Hierarchy</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullHomeVisual?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullHomeVisual?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullHomeVisual?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Brand Voice</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullHomeBrand?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullHomeBrand?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullHomeBrand?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Call-to-Action</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullHomeCTA?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullHomeCTA?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullHomeCTA?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-8">
            <h4 className="mb-8 font-serif text-lg font-semibold tracking-wide text-foreground">
              Promotional Strategy & Offers
            </h4>

            <div className="mb-8 space-y-6">
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Active Promotions</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullPromoActive?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullPromoActive?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullPromoActive?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Promotional Placement</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullPromoPlacement?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullPromoPlacement?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullPromoPlacement?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Urgency Mechanics</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullPromoUrgency?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullPromoUrgency?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullPromoUrgency?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">Target Audience</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{website1}:</strong> {fullPromoAudience?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground">{website2}:</strong> {fullPromoAudience?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground">Advantage:</strong> {fullPromoAudience?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              AI-Powered Features
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* Core Dynamic Section */}
          {coreDynamic && coreDynamic !== "coming soon" && (
            <div className="px-8 py-8 bg-secondary">
              <p className="text-sm leading-relaxed text-foreground">
                <strong className="font-serif">Key Insight:</strong> {coreDynamic}
              </p>
            </div>
          )}

          {/* Appendix Section */}
          {appendix && appendix.length > 0 && (
            <div className="px-8 py-8">
              <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
                Appendix
              </h4>
              <ul className="flex flex-col gap-3">
                {appendix.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border bg-secondary px-8 py-8">
        <p className="mb-6 text-center text-xs uppercase tracking-wide text-muted-foreground">
          Report generated on {new Date().toLocaleDateString()} • {website1} vs {website2}
        </p>
        <div className="flex justify-center">
          <Button
            onClick={onRerun}
            className="bg-foreground px-8 py-2 text-sm tracking-wide text-background hover:bg-foreground/90"
          >
            Run another competitive analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
