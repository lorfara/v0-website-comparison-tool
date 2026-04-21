export interface WebhookResponseData {
  company_a?: string
  company_b?: string
  generated?: string
  executive_summary?: {
    homepage?: string[]
    promotions?: string[]
  }
  full_report?: {
    homepage?: {
      hero_message?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      visual_hierarchy?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      brand_voice?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      call_to_action?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
    }
    promotions?: {
      active_promotions?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      promotional_placement?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      urgency_mechanics?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
      target_audience?: {
        company_a?: string
        company_b?: string
        advantage?: string
      }
    }
  }
  core_dynamic?: string
  appendix?: string[]
}
