"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"
import { type WebhookResponseData } from "@/lib/webhook"

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>
    jspdf: { jsPDF: new (orientation?: string, unit?: string, format?: string | number[]) => {
      internal: { pageSize: { getWidth: () => number; getHeight: () => number } }
      addImage: (data: string, format: string, x: number, y: number, width: number, height: number) => void
      addPage: () => void
      save: (filename: string) => void
    }}
  }
}

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const executiveRef = useRef<HTMLDivElement>(null)
  const fullReportRef = useRef<HTMLDivElement>(null)

  // Load html2canvas and jsPDF from CDN
  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          console.log("[v0] Script already loaded:", src)
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
          console.log("[v0] Script loaded successfully:", src)
          resolve()
        }
        script.onerror = (e) => {
          console.error("[v0] Script failed to load:", src, e)
          reject(e)
        }
        document.head.appendChild(script)
      })
    }

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    ]).then(() => {
      console.log("[v0] All scripts loaded, checking globals...")
      console.log("[v0] window.html2canvas:", typeof window.html2canvas)
      console.log("[v0] window.jspdf:", typeof window.jspdf)
      setScriptsLoaded(true)
    }).catch((err) => {
      console.error("[v0] Failed to load PDF scripts:", err)
    })
  }, [])

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

  const generatePdf = async (element: HTMLElement, filename: string) => {
    console.log("[v0] generatePdf called")
    console.log("[v0] scriptsLoaded:", scriptsLoaded)
    console.log("[v0] window.html2canvas:", typeof window.html2canvas)
    console.log("[v0] window.jspdf:", typeof window.jspdf)
    console.log("[v0] element:", element)

    if (!scriptsLoaded || !window.html2canvas || !window.jspdf) {
      console.error("[v0] PDF libraries not ready")
      alert("PDF libraries are still loading. Please try again.")
      return
    }

    setIsGeneratingPdf(true)

    try {
      console.log("[v0] Calling html2canvas...")
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
      })
      console.log("[v0] html2canvas returned canvas:", canvas.width, "x", canvas.height)

      const imgData = canvas.toDataURL("image/png")
      console.log("[v0] Image data generated, length:", imgData.length)
      
      console.log("[v0] Creating jsPDF instance...")
      const { jsPDF } = window.jspdf
      const pdf = new jsPDF("p", "mm", "a4")
      console.log("[v0] jsPDF instance created")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const scaledHeight = imgHeight * ratio

      // If content fits on one page
      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", imgX, 0, imgWidth * ratio, scaledHeight)
      } else {
        // Multi-page support
        let heightLeft = scaledHeight
        let position = 0
        const pageHeight = pdfHeight

        pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, scaledHeight)
        heightLeft -= pageHeight

        while (heightLeft > 0) {
          position = -pageHeight * ((scaledHeight - heightLeft) / scaledHeight) * (scaledHeight / (imgWidth * ratio))
          pdf.addPage()
          pdf.addImage(imgData, "PNG", imgX, position, imgWidth * ratio, scaledHeight)
          heightLeft -= pageHeight
        }
      }

      console.log("[v0] Saving PDF as:", filename)
      pdf.save(filename)
      console.log("[v0] PDF save called successfully")
    } catch (error) {
      console.error("[v0] PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleDownloadExecutive = () => {
    console.log("[v0] handleDownloadExecutive clicked")
    console.log("[v0] executiveRef.current:", executiveRef.current)
    if (executiveRef.current) {
      generatePdf(executiveRef.current, "competitive-intelligence-report.pdf")
    } else {
      console.error("[v0] executiveRef.current is null!")
    }
  }

  const handleDownloadFull = () => {
    console.log("[v0] handleDownloadFull clicked")
    console.log("[v0] fullReportRef.current:", fullReportRef.current)
    if (fullReportRef.current) {
      generatePdf(fullReportRef.current, "competitive-intelligence-report.pdf")
    } else {
      console.error("[v0] fullReportRef.current is null!")
    }
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
              disabled={isGeneratingPdf || !scriptsLoaded}
              variant="outline"
              className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              {isGeneratingPdf ? "Generating..." : "Download as PDF"}
            </Button>
          ) : (
            <Button
              onClick={handleDownloadFull}
              disabled={isGeneratingPdf || !scriptsLoaded}
              variant="outline"
              className="flex items-center gap-2 border-border text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              {isGeneratingPdf ? "Generating..." : "Download as PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* Executive Summary Tab */}
      {activeTab === "executive" && (
        <div ref={executiveRef} className="divide-y divide-border bg-white">
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
        <div ref={fullReportRef} className="divide-y divide-border bg-white">

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
