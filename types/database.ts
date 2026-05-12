export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type HeroMetric = {
  label: string
  value: string
}

export type QuickFact = {
  label: string
  value: string
}

export interface Database {
  public: {
    Tables: {
      personal_info: {
        Row: {
          id: string
          full_name: string | null
          headline: string | null
          tagline: string | null
          email: string | null
          location: string | null
          linkedin_url: string | null
          github_url: string | null
          availability_status: string | null
          hero_metrics: Json
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          headline?: string | null
          tagline?: string | null
          email?: string | null
          location?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          availability_status?: string | null
          hero_metrics?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          headline?: string | null
          tagline?: string | null
          email?: string | null
          location?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          availability_status?: string | null
          hero_metrics?: Json
          updated_at?: string
        }
        Relationships: []
      }
      about: {
        Row: {
          id: string
          content: string | null
          quick_facts: Json
          updated_at: string
        }
        Insert: {
          id?: string
          content?: string | null
          quick_facts?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string | null
          quick_facts?: Json
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          category: string
          name: string
          type: 'hard' | 'soft'
          level: number | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          name: string
          type: 'hard' | 'soft'
          level?: number | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          name?: string
          type?: 'hard' | 'soft'
          level?: number | null
          order?: number
          created_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          id: string
          slug: string
          company: string
          role: string
          location: string | null
          start_date: string
          end_date: string | null
          summary: string | null
          full_content: string | null
          tech_stack: string[]
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          company: string
          role: string
          location?: string | null
          start_date: string
          end_date?: string | null
          summary?: string | null
          full_content?: string | null
          tech_stack?: string[]
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          company?: string
          role?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          summary?: string | null
          full_content?: string | null
          tech_stack?: string[]
          order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string | null
          full_content: string | null
          tech_stack: string[]
          github_url: string | null
          demo_url: string | null
          images: string[]
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary?: string | null
          full_content?: string | null
          tech_stack?: string[]
          github_url?: string | null
          demo_url?: string | null
          images?: string[]
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string | null
          full_content?: string | null
          tech_stack?: string[]
          github_url?: string | null
          demo_url?: string | null
          images?: string[]
          order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type PersonalInfoRow = Database['public']['Tables']['personal_info']['Row']
export type PersonalInfoInsert = Database['public']['Tables']['personal_info']['Insert']
export type PersonalInfoUpdate = Database['public']['Tables']['personal_info']['Update']

export type AboutRow = Database['public']['Tables']['about']['Row']
export type AboutInsert = Database['public']['Tables']['about']['Insert']
export type AboutUpdate = Database['public']['Tables']['about']['Update']

export type SkillRow = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type ExperienceRow = Database['public']['Tables']['experiences']['Row']
export type ExperienceInsert = Database['public']['Tables']['experiences']['Insert']
export type ExperienceUpdate = Database['public']['Tables']['experiences']['Update']

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ContactMessageRow = Database['public']['Tables']['contact_messages']['Row']
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update']
