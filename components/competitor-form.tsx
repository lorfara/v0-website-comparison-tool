import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompetitorFormProps {
  website1: string
  website2: string
  setWebsite1: (value: string) => void
  setWebsite2: (value: string) => void
  onAnalyze: () => void
  onStop: () => void
  isAnalyzing: boolean
}

export function CompetitorForm({
  website1,
  website2,
  setWebsite1,
  setWebsite2,
  onAnalyze,
  onStop,
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

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || !website1 || !website2}
          className={`px-8 py-2 text-sm tracking-wide text-white transition-colors duration-300 disabled:opacity-50 ${
            isAnalyzing
              ? "cursor-not-allowed bg-green-600 hover:bg-green-600"
              : "bg-foreground hover:bg-foreground/90"
          }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Run Competitive Analysis"
          )}
        </Button>

        {isAnalyzing && (
          <Button
            onClick={onStop}
            variant="outline"
            className="border-border px-6 py-2 text-sm tracking-wide text-foreground hover:bg-secondary"
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  )
}
