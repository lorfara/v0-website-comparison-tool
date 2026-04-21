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

  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadExecutive = () => {
    const content = `
EXECUTIVE SUMMARY
=================
${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2}
Generated: ${webhookData?.generated || new Date().toLocaleDateString()}

HOMEPAGE MESSAGING & VISUAL HIERARCHY
${executiveHomepage.map((f) => `• ${f}`).join("\n")}

PROMOTIONAL STRATEGY & OFFERS
${executivePromotions.map((f) => `• ${f}`).join("\n")}
    `.trim()
    triggerDownload(content, `executive-summary-${website1}-vs-${website2}.txt`)
  }

  const handleDownloadFull = () => {
    const content = `
FULL COMPETITIVE ANALYSIS REPORT
=================================
${webhookData?.company_a || website1} vs ${webhookData?.company_b || website2}
Generated: ${webhookData?.generated || new Date().toLocaleDateString()}

HOMEPAGE MESSAGING & VISUAL HIERARCHY

Hero Message
${webhookData?.company_a || website1}: ${fullHomeHero?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullHomeHero?.company_b || "coming soon"}
Advantage: ${fullHomeHero?.advantage || "coming soon"}

Visual Hierarchy
${webhookData?.company_a || website1}: ${fullHomeVisual?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullHomeVisual?.company_b || "coming soon"}
Advantage: ${fullHomeVisual?.advantage || "coming soon"}

Brand Voice
${webhookData?.company_a || website1}: ${fullHomeBrand?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullHomeBrand?.company_b || "coming soon"}
Advantage: ${fullHomeBrand?.advantage || "coming soon"}

Call-to-Action
${webhookData?.company_a || website1}: ${fullHomeCTA?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullHomeCTA?.company_b || "coming soon"}
Advantage: ${fullHomeCTA?.advantage || "coming soon"}

PROMOTIONAL STRATEGY & OFFERS

Active Promotions
${webhookData?.company_a || website1}: ${fullPromoActive?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullPromoActive?.company_b || "coming soon"}
Advantage: ${fullPromoActive?.advantage || "coming soon"}

Promotional Placement
${webhookData?.company_a || website1}: ${fullPromoPlacement?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullPromoPlacement?.company_b || "coming soon"}
Advantage: ${fullPromoPlacement?.advantage || "coming soon"}

Urgency Mechanics
${webhookData?.company_a || website1}: ${fullPromoUrgency?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullPromoUrgency?.company_b || "coming soon"}
Advantage: ${fullPromoUrgency?.advantage || "coming soon"}

Target Audience
${webhookData?.company_a || website1}: ${fullPromoAudience?.company_a || "coming soon"}
${webhookData?.company_b || website2}: ${fullPromoAudience?.company_b || "coming soon"}
Advantage: ${fullPromoAudience?.advantage || "coming soon"}

${coreDynamic && coreDynamic !== "coming soon" ? `KEY INSIGHT\n${coreDynamic}\n` : ""}

${appendix && appendix.length > 0 ? `APPENDIX\n${appendix.map((item) => `• ${item}`).join("\n")}` : ""}
    `.trim()
    triggerDownload(content, `full-report-${website1}-vs-${website2}.txt`)
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "executive", label: "Executive Summary" },
    { id: "full", label: "Full Report" },
  ]

  return (
    <div className="border border-border bg-card">
      {/* Tab Bar */}
      <div className="flex items-end justify-between border-b border-border px-8 pt-6">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm tracking-wide transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-b-2 border-foreground font-semibold text-foreground"
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
              onClick={handleDownloadExecutive}
              variant="outline"
              className="flex items-center gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
            >
              <Download className="h-4 w-4" />
              Download Summary
            </Button>
          ) : (
            <Button
              onClick={handleDownloadFull}
              variant="outline"
              className="flex items-center gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
            >
              <Download className="h-4 w-4" />
              Download Full Report
            </Button>
          )}
        </div>
      </div>

      {/* Executive Summary Tab */}
      {activeTab === "executive" && (
        <div className="divide-y divide-border">
          {/* Homepage Section */}
          <div className="px-8 py-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>
            <ul className="flex flex-col gap-2">
              {executiveHomepage.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Promotional Strategy & Offers
            </h4>
            <ul className="flex flex-col gap-2">
              {executivePromotions.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
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
          <div className="px-8 py-6">
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>

            <div className="mb-6 space-y-4">
              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Hero Message</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullHomeHero?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullHomeHero?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullHomeHero?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Visual Hierarchy</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullHomeVisual?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullHomeVisual?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullHomeVisual?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Brand Voice</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullHomeBrand?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullHomeBrand?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullHomeBrand?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Call-to-Action</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullHomeCTA?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullHomeCTA?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullHomeCTA?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-6">
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Promotional Strategy & Offers
            </h4>

            <div className="mb-6 space-y-4">
              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Active Promotions</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullPromoActive?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullPromoActive?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullPromoActive?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Promotional Placement</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullPromoPlacement?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullPromoPlacement?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullPromoPlacement?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Urgency Mechanics</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullPromoUrgency?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullPromoUrgency?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullPromoUrgency?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div>
                <h5 className="mb-2 text-xs font-semibold text-foreground">Target Audience</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>{website1}:</strong> {fullPromoAudience?.company_a || "coming soon"}</p>
                  <p><strong>{website2}:</strong> {fullPromoAudience?.company_b || "coming soon"}</p>
                  <p><strong>Advantage:</strong> {fullPromoAudience?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-6">
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-6">
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              AI-Powered Features
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* Core Dynamic Section */}
          {coreDynamic && coreDynamic !== "coming soon" && (
            <div className="px-8 py-6 bg-secondary/30">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Key Insight:</strong> {coreDynamic}
              </p>
            </div>
          )}

          {/* Appendix Section */}
          {appendix && appendix.length > 0 && (
            <div className="px-8 py-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                Appendix
              </h4>
              <ul className="flex flex-col gap-2">
                {appendix.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border bg-secondary px-8 py-6">
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Report generated on {new Date().toLocaleDateString()} | {website1} vs {website2}
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
