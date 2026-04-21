"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ReportSectionProps {
  website1: string
  website2: string
}

export function ReportSection({ website1, website2 }: ReportSectionProps) {
  const dimensions = [
    {
      title: "Homepage Messaging & Visual Hierarchy",
      findings: [
        `${website1} leads with lifestyle imagery and aspirational messaging above the fold`,
        `${website2} prioritizes product categories with a grid-based visual hierarchy`,
        "Both sites use hero banners but differ in typography weight and spacing strategies",
      ],
    },
    {
      title: "Promotional Placement & Offers",
      findings: [
        `${website1} features a persistent promotional banner with rotating offers`,
        `${website2} integrates promotional messaging within product cards`,
        "Both utilize urgency-driven language but with different visual prominence levels",
      ],
    },
    {
      title: "Product Discovery Experience",
      findings: [
        `${website1} offers robust filtering with visual swatches and room-based navigation`,
        `${website2} emphasizes search-first discovery with predictive suggestions`,
        "Both sites feature curated collections but differ in personalization depth",
      ],
    },
    {
      title: "AI-Powered Features",
      findings: [
        `${website1} implements AI-driven product recommendations on PDPs`,
        `${website2} features visual search and style matching capabilities`,
        "Both are exploring conversational AI but at different maturity levels",
      ],
    },
  ]

  const handleDownload = () => {
    const reportContent = `
COMPETITIVE ANALYSIS REPORT
===========================
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

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `competitive-analysis-${website1}-vs-${website2}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-8 py-6">
        <h3 className="font-serif text-xl tracking-wide text-foreground">
          Analysis Report
        </h3>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="divide-y divide-border">
        {dimensions.map((dimension, index) => (
          <div key={index} className="px-8 py-6">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {dimension.title}
            </h4>
            <ul className="flex flex-col gap-2">
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
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-secondary px-8 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Report generated on {new Date().toLocaleDateString()} | {website1} vs {website2}
        </p>
      </div>
    </div>
  )
}
