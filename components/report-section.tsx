"use client"

import { useState, useEffect } from "react"
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

  const reportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleBeforePrint = () => {
        const reportContent = document.querySelector(".report-content")
        if (!reportContent) return

        const pages = reportContent.querySelectorAll(".print-page-break")
        let pageNum = 1

        pages.forEach((page) => {
          const existing = page.querySelector(".print-page-footer")
          if (existing) existing.remove()

          const footer = document.createElement("div")
          footer.className = "print-page-footer"
          footer.textContent = `Page ${pageNum}`
          page.appendChild(footer)
          pageNum++
        })
      }

      window.addEventListener("beforeprint", handleBeforePrint)
      return () => window.removeEventListener("beforeprint", handleBeforePrint)
    }
  }, [])

  const getFeedback = (index: number): FeedbackState => {
    return feedback[index] || { rating: null, showChat: false, question: "", messages: [] }
  }

  const handleDownload = () => {
    const company1 = (webhookData?.company_a || "company1").replace(/\s+/g, '_').toLowerCase()
    const company2 = (webhookData?.company_b || "company2").replace(/\s+/g, '_').toLowerCase()
    const date = new Date().toISOString().split('T')[0]
    document.title = `competitive_analysis_${company1}_${company2}_${date}`
    window.print()
    document.title = 'Competitive Analysis Agent'
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "executive", label: "Executive Summary" },
    { id: "full", label: "Full Report" },
  ]

  return (
    <div className="bg-card">
      {/* Tab Bar */}
      <div className="no-print flex items-end justify-between border-b border-border px-8 pt-6 pb-0">
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
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </div>

      {/* Executive Summary Tab */}
      {activeTab === "executive" && (
        <div className="report-content print-page-break divide-y divide-border bg-white">
          {/* Print-only header */}
          <div className="hidden print:block px-8 pt-10 pb-6 border-b border-border">
            <h1 className="font-serif text-2xl font-semibold tracking-wide text-foreground">Website Competitive Analysis</h1>
            <h2 className="font-serif text-lg tracking-wide text-muted-foreground mt-1">Executive Summary</h2>
            {reportDate && <p className="mt-3 text-sm text-muted-foreground">{reportDate}</p>}
          </div>
          {/* Homepage Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>
            <ul className="flex flex-col gap-4">
              {executiveHomepage.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="print-bullet mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Promotional Strategy & Offers
            </h4>
            <ul className="flex flex-col gap-4">
              {executivePromotions.map((finding, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="print-bullet mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
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
        <div className="report-content print-page-break divide-y divide-border bg-white">
          {/* Print-only header */}
          <div className="hidden print:block px-8 pt-10 pb-6 border-b border-border">
            <h1 className="font-serif text-2xl font-semibold tracking-wide text-foreground">Website Competitive Analysis</h1>
            <h2 className="font-serif text-lg tracking-wide text-muted-foreground mt-1">Full Report</h2>
            {reportDate && <p className="mt-3 text-sm text-muted-foreground">{reportDate}</p>}
          </div>

          {/* Table of Contents */}
          <div className="toc-section px-8 py-8 bg-secondary/40">
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
            <h4 className="mb-8 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Homepage Messaging & Visual Hierarchy
            </h4>

            <div className="mb-8 space-y-6">
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Hero Message</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullHomeHero?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullHomeHero?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullHomeHero?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Visual Hierarchy</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullHomeVisual?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullHomeVisual?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullHomeVisual?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Brand Voice</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullHomeBrand?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullHomeBrand?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullHomeBrand?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Call-to-Action</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullHomeCTA?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullHomeCTA?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullHomeCTA?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotions Section */}
          <div className="px-8 py-8">
            <h4 className="mb-8 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Promotional Strategy & Offers
            </h4>

            <div className="mb-8 space-y-6">
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Active Promotions</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullPromoActive?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullPromoActive?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullPromoActive?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Promotional Placement</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullPromoPlacement?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullPromoPlacement?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullPromoPlacement?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Urgency Mechanics</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullPromoUrgency?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullPromoUrgency?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullPromoUrgency?.advantage || "coming soon"}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide print:text-[#8B6914] text-foreground">Target Audience</h5>
                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground print:text-[#2C1810]">{website1}:</strong> {fullPromoAudience?.company_a || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#2C1810]">{website2}:</strong> {fullPromoAudience?.company_b || "coming soon"}</p>
                  <p><strong className="text-foreground print:text-[#C4956A]">Advantage:</strong> {fullPromoAudience?.advantage || "coming soon"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Discovery Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
              Product Discovery Experience
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coming soon — this dimension will be available in Phase 2.
            </p>
          </div>

          {/* AI-Powered Features Section */}
          <div className="px-8 py-8">
            <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
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
                <strong className="font-serif print:text-[#2C1810]">Key Insight:</strong> {coreDynamic}
              </p>
            </div>
          )}

          {/* Appendix Section */}
          {appendix && appendix.length > 0 && (
            <div className="px-8 py-8">
              <h4 className="mb-6 font-serif text-lg font-semibold tracking-wide print:text-[#2C1810] print:border-b print:border-[#C4956A] print:pb-3 text-foreground">
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

      <div className="no-print border-t border-border bg-secondary px-8 py-8">
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
