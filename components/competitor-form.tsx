import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

interface CompetitorFormProps {
  website1: string
  website2: string
  setWebsite1: (value: string) => void
  setWebsite2: (value: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export function CompetitorForm({
  website1,
  website2,
  setWebsite1,
  setWebsite2,
  onAnalyze,
  isAnalyzing,
}: CompetitorFormProps) {
  return (
    <div className="mb-12 border border-border bg-card p-8">
      <h3 className="mb-6 font-serif text-xl tracking-wide text-foreground">
        Competitor Websites
      </h3>
      
      <div className="mb-6 flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <Label htmlFor="website1" className="mb-2 block text-sm font-medium text-foreground">
            Website 1
          </Label>
          <Input
            id="website1"
            type="text"
            value={website1}
            onChange={(e) => setWebsite1(e.target.value)}
            placeholder="Enter first website"
            className="border-border bg-background text-muted-foreground placeholder:text-muted-foreground focus:text-foreground focus:ring-foreground"
          />
        </div>
        
        <div className="flex-1">
          <Label htmlFor="website2" className="mb-2 block text-sm font-medium text-foreground">
            Website 2
          </Label>
          <Input
            id="website2"
            type="text"
            value={website2}
            onChange={(e) => setWebsite2(e.target.value)}
            placeholder="Enter second website"
            className="border-border bg-background text-muted-foreground placeholder:text-muted-foreground focus:text-foreground focus:ring-foreground"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || !website1 || !website2}
          className="bg-foreground px-8 py-2 text-sm tracking-wide text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Analyzing...
            </span>
          ) : (
            "Run Competitive Analysis"
          )}
        </Button>
      </div>
    </div>
  )
}
