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

  const FORTHCOMING = ["coming soon"]

  const dimensions = [
    {
      title: "Homepage Messaging & Visual Hierarchy",
      findings: webhookData?.homepageMessaging?.findings ?? FORTHCOMING,
    },
    {
      title: "Promotional Strategy & Offers",
      findings: webhookData?.promotionalStrategy?.findings ?? FORTHCOMING,
    },
    {
      title: "Product Discovery Experience",
      findings: webhookData?.productDiscovery?.findings ?? FORTHCOMING,
    },
    {
      title: "AI-Powered Features",
      findings: webhookData?.aiFeatures?.findings ?? FORTHCOMING,
    },
  ]

  const getFeedback = (index: number): FeedbackState => {
    return feedback[index] || { rating: null, showChat: false, question: "", messages: [] }
  }

  const setRating = (index: number, rating: "helpful" | "not-helpful") => {
    setFeedback((prev) => ({
      ...prev,
      [index]: { ...getFeedback(index), rating },
    }))
  }

  const toggleChat = (index: number) => {
    setFeedback((prev) => ({
      ...prev,
      [index]: { ...getFeedback(index), showChat: !getFeedback(index).showChat },
    }))
  }

  const setQuestion = (index: number, question: string) => {
    setFeedback((prev) => ({
      ...prev,
      [index]: { ...getFeedback(index), question },
    }))
  }

  const submitQuestion = (index: number) => {
    const currentFeedback = getFeedback(index)
    if (!currentFeedback.question.trim()) return

    const userMessage = currentFeedback.question
    const assistantResponse = `Thank you for your question about ${dimensions[index].title}. This insight is based on our analysis of current homepage layouts, promotional strategies, and feature implementations. Would you like me to elaborate on any specific finding?`

    setFeedback((prev) => ({
      ...prev,
      [index]: {
        ...currentFeedback,
        question: "",
        messages: [
          ...currentFeedback.messages,
          { role: "user", content: userMessage },
          { role: "assistant", content: assistantResponse },
        ],
      },
    }))
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
${website1} vs ${website2}
Generated: ${new Date().toLocaleDateString()}

${dimensions
  .map((dim) => `${dim.title.toUpperCase()}\n${dim.findings[0]}`)
  .join("\n\n")}
    `.trim()
    triggerDownload(content, `executive-summary-${website1}-vs-${website2}.txt`)
  }

  const handleDownloadFull = () => {
    const content = `
FULL COMPETITIVE ANALYSIS REPORT
=================================
${website1} vs ${website2}
Generated: ${new Date().toLocaleDateString()}

${dimensions
  .map(
    (dim) => `
${dim.title.toUpperCase()}
${"-".repeat(dim.title.length)}
${dim.findings.map((f) => `• ${f}`).join("\n")}
`
  )
  .join("\n")}
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
          {dimensions.map((dimension, index) => (
            <div key={index} className="px-8 py-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                {dimension.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {dimension.findings[0]}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full Report Tab */}
      {activeTab === "full" && (
      <div className="divide-y divide-border">
        {dimensions.map((dimension, index) => {
          const sectionFeedback = getFeedback(index)
          return (
            <div key={index} className="px-8 py-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                {dimension.title}
              </h4>
              <ul className="mb-6 flex flex-col gap-2">
                {dimension.findings.map((finding, findingIndex) => (
                  <li
                    key={findingIndex}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {finding}
                  </li>
                ))}
              </ul>

              {/* Feedback Section */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Was this helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRating(index, "helpful")}
                      className={`h-8 w-8 p-0 ${
                        sectionFeedback.rating === "helpful"
                          ? "bg-green-100 text-green-700"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRating(index, "not-helpful")}
                      className={`h-8 w-8 p-0 ${
                        sectionFeedback.rating === "not-helpful"
                          ? "bg-red-100 text-red-700"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    {sectionFeedback.rating && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        Thanks for your feedback
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChat(index)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {sectionFeedback.showChat ? "Close" : "Ask a Question"}
                  </Button>
                </div>

                {/* Chat Section */}
                {sectionFeedback.showChat && (
                  <div className="mt-4 border border-border bg-secondary/50 p-4">
                    {sectionFeedback.messages.length > 0 && (
                      <div className="mb-4 max-h-48 overflow-y-auto">
                        {sectionFeedback.messages.map((message, msgIndex) => (
                          <div
                            key={msgIndex}
                            className={`mb-3 ${
                              message.role === "user" ? "text-right" : "text-left"
                            }`}
                          >
                            <div
                              className={`inline-block max-w-[80%] px-3 py-2 text-sm ${
                                message.role === "user"
                                  ? "bg-foreground text-background"
                                  : "bg-card text-foreground border border-border"
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask a clarifying question about this analysis..."
                        value={sectionFeedback.question}
                        onChange={(e) => setQuestion(index, e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            submitQuestion(index)
                          }
                        }}
                      />
                      <Button
                        onClick={() => submitQuestion(index)}
                        className="h-auto bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
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
