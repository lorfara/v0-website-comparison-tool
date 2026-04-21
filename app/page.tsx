"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CompetitorForm } from "@/components/competitor-form"
import { ReportSection } from "@/components/report-section"

export default function Home() {
  const [website1, setWebsite1] = useState("CB2.com")
  const [website2, setWebsite2] = useState("WestElm.com")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setReportGenerated(true)
    }, 2000)
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
            Promotional Placement & Offers, Product Discovery Experience, and AI-Powered Features.
          </p>
        </div>

        <CompetitorForm
          website1={website1}
          website2={website2}
          setWebsite1={setWebsite1}
          setWebsite2={setWebsite2}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {reportGenerated && (
          <ReportSection 
            website1={website1} 
            website2={website2} 
          />
        )}
      </main>
    </div>
  )
}
