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

  const formatDate = (raw?: string): string => {
    if (!raw) return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const d = new Date(raw)
    return isNaN(d.getTime())
      ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const generatedDate = formatDate(webhookData?.generated)

  const getFeedback = (index: number): FeedbackState => {
    return feedback[index] || { rating: null, showChat: false, question: "", messages: [] }
  }

  const handleDownloadExecutive = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const companyA = webhookData?.company_a || website1
    const companyB = webhookData?.company_b || website2

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Website Competitive Analysis - Executive Summary</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a1a1a; padding: 48px; }
            h1 { font-size: 24px; margin-bottom: 8px; letter-spacing: 1px; }
            .report-type { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
            .subtitle { color: #666; font-size: 13px; margin-bottom: 32px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
            h2 { font-size: 16px; margin-top: 28px; margin-bottom: 14px; }
            ul { margin-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 8px; font-size: 13px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="report-type">Website Competitive Analysis</div>
          <h1>Executive Summary</h1>
          <div class="subtitle">${companyA} vs ${companyB} &bull; Generated ${generatedDate}</div>
          <h2>Homepage Messaging & Visual Hierarchy</h2>
          <ul>${executiveHomepage.map((f) => `<li>${f}</li>`).join("")}</ul>
          <h2>Promotional Strategy & Offers</h2>
          <ul>${executivePromotions.map((f) => `<li>${f}</li>`).join("")}</ul>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 300)
  }

  const handleDownloadFull = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const companyA = webhookData?.company_a || website1
    const companyB = webhookData?.company_b || website2

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Website Competitive Analysis - Full Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a1a1a; padding: 48px; }
            h1 { font-size: 24px; margin-bottom: 8px; letter-spacing: 1px; }
            .report-type { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
            .subtitle { color: #666; font-size: 13px; margin-bottom: 32px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
            h2 { font-size: 16px; margin-top: 28px; margin-bottom: 14px; page-break-after: avoid; }
            h3 { font-size: 11px; font-weight: 600; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            p { margin-bottom: 8px; font-size: 13px; }
            strong { font-weight: 600; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .key-insight { background: #f5f0eb; padding: 16px; margin: 24px 0; border-left: 3px solid #1a1a1a; font-size: 13px; }
            ul { margin-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 6px; font-size: 13px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="report-type">Website Competitive Analysis</div>
          <h1>Full Report</h1>
          <div class="subtitle">${companyA} vs ${companyB} &bull; Generated ${generatedDate}</div>

          <h2>Executive Summary</h2>
          <h3>Homepage Messaging & Visual Hierarchy</h3>
          <ul>${executiveHomepage.map((f) => `<li>${f}</li>`).join("")}</ul>
          <h3>Promotional Strategy & Offers</h3>
          <ul>${executivePromotions.map((f) => `<li>${f}</li>`).join("")}</ul>

          <h2>1. Homepage Messaging & Visual Hierarchy</h2>
          <div class="section">
            <h3>Hero Message</h3>
            <p><strong>${companyA}:</strong> ${fullHomeHero?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullHomeHero?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullHomeHero?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Visual Hierarchy</h3>
            <p><strong>${companyA}:</strong> ${fullHomeVisual?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullHomeVisual?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullHomeVisual?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Brand Voice</h3>
            <p><strong>${companyA}:</strong> ${fullHomeBrand?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullHomeBrand?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullHomeBrand?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Call-to-Action</h3>
            <p><strong>${companyA}:</strong> ${fullHomeCTA?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullHomeCTA?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullHomeCTA?.advantage || "coming soon"}</p>
          </div>

          <h2>2. Promotional Strategy & Offers</h2>
          <div class="section">
            <h3>Active Promotions</h3>
            <p><strong>${companyA}:</strong> ${fullPromoActive?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullPromoActive?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullPromoActive?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Promotional Placement</h3>
            <p><strong>${companyA}:</strong> ${fullPromoPlacement?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullPromoPlacement?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullPromoPlacement?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Urgency Mechanics</h3>
            <p><strong>${companyA}:</strong> ${fullPromoUrgency?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullPromoUrgency?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullPromoUrgency?.advantage || "coming soon"}</p>
          </div>
          <div class="section">
            <h3>Target Audience</h3>
            <p><strong>${companyA}:</strong> ${fullPromoAudience?.company_a || "coming soon"}</p>
            <p><strong>${companyB}:</strong> ${fullPromoAudience?.company_b || "coming soon"}</p>
            <p><strong>Advantage:</strong> ${fullPromoAudience?.advantage || "coming soon"}</p>
          </div>

          <h2>3. Product Discovery Experience</h2>
          <p style="color:#666;">Coming soon — this dimension will be available in Phase 2.</p>

          <h2>4. AI-Powered Features</h2>
          <p style="color:#666;">Coming soon — this dimension will be available in Phase 2.</p>

          ${coreDynamic && coreDynamic !== "coming soon" ? `<div class="key-insight"><strong>Key Insight:</strong> ${coreDynamic}</div>` : ""}
          ${appendix && appendix.length > 0 ? `<h2>Appendix</h2><ul>${appendix.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 300)
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "executive", label: "Executive Summary" },
    { id: "full", label: "Full Report" },
  ]

  return (
    <div className="bg-card">
      {/* Tab Bar */}
      <div className="flex items-end justify-between border-b border-border px-8 pt-6 pb-0">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-serif text-sm tracking-wide transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="pb-3">
          {activeTab === "executive" ? (
            <Button
              onClick={handleDownloadExecutive}
              variant="outline"
              className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          ) : (
            <Button
              onClick={handleDownloadFull}
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
        <div className="divide-y divide-border bg-white">
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
        <div className="divide-y divide-border bg-white">

          {/* Table of Contents */}
          <div className="px-8 py-8 bg-secondary/40">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide text-foreground">
              Table of Contents
            </h4>
            <ol className="space-y-2">
              {[
                { num: "1", title: "Homepage Messaging & Visual Hierarchy", subs: ["Hero Message", "Visual Hierarchy", "Brand Voice", "Call-to-Action"] },
                { num: "2", title: "Promotional Strategy & Offers", subs: ["Active Promotions", "Promotional Placement", "Urgency Mechanics", "Target Audience"] },
                { num: "3", title: "Product Discovery Experience", subs: [] },
                { num: "4", title: "AI-Powered Features", subs: [] },
              ].map((item) => (
                <li key={item.num}>
                  <div className="flex items-baseline justify-between border-b border-border pb-2">
                    <span className="text-sm font-semibold text-foreground">{item.num}.&nbsp;&nbsp;{item.title}</span>
                  </div>
                  {item.subs.length > 0 && (
                    <ul className="mt-1 mb-2 space-y-1">
                      {item.subs.map((sub) => (
                        <li key={sub} className="flex items-baseline pl-6 text-xs text-muted-foreground">
                          <span className="mr-2">—</span>{sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>

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
          Report generated on {generatedDate} • {website1} vs {website2}
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
