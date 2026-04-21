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
      title: "Product Assortment",
      findings: [
        `${website1} offers a broader range of contemporary furniture styles`,
        `${website2} focuses more on mid-century modern aesthetics`,
        "Both sites feature seasonal collections with similar refresh cycles",
      ],
    },
    {
      title: "Pricing Strategy",
      findings: [
        `${website1} positions products in the $200-$2,000 range`,
        `${website2} has a slightly higher average price point`,
        "Both utilize promotional pricing with similar discount structures",
      ],
    },
    {
      title: "User Experience",
      findings: [
        `${website1} features a more streamlined checkout process`,
        `${website2} offers superior product visualization tools`,
        "Mobile experience is comparable across both platforms",
      ],
    },
    {
      title: "Brand Positioning",
      findings: [
        `${website1} targets younger, urban demographics`,
        `${website2} appeals to design-conscious homeowners`,
        "Both emphasize sustainability in marketing messaging",
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
