export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      blog_post_faqs: {
        Row: {
          answer: string
          blog_post_id: string
          created_at: string
          id: string
          position: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          blog_post_id: string
          created_at?: string
          id?: string
          position?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          blog_post_id?: string
          created_at?: string
          id?: string
          position?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          service_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          service_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          service_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          department: string | null
          id: string
          name: string
          published: boolean
          region: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          name: string
          published?: boolean
          region?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          name?: string
          published?: boolean
          region?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          created_at: string
          from_path: string
          id: string
          status_code: number
          to_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_path: string
          id?: string
          status_code?: number
          to_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_path?: string
          id?: string
          status_code?: number
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_city_faqs: {
        Row: {
          answer: string
          city_id: string
          created_at: string
          id: string
          position: number
          published: boolean
          question: string
          service_id: string
          updated_at: string
        }
        Insert: {
          answer: string
          city_id: string
          created_at?: string
          id?: string
          position?: number
          published?: boolean
          question: string
          service_id: string
          updated_at?: string
        }
        Update: {
          answer?: string
          city_id?: string
          created_at?: string
          id?: string
          position?: number
          published?: boolean
          question?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_city_offers: {
        Row: {
          created_at: string
          description: string
          emoji: string | null
          icon_name: string | null
          id: string
          page_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          emoji?: string | null
          icon_name?: string | null
          id?: string
          page_id: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string | null
          icon_name?: string | null
          id?: string
          page_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_city_pages: {
        Row: {
          city_id: string
          created_at: string
          cta_subtitle: string
          cta_title: string | null
          h1: string | null
          h2_intro: string | null
          id: string
          intro_description: string | null
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          service_id: string
          updated_at: string
          zones_text: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          cta_subtitle?: string
          cta_title?: string | null
          h1?: string | null
          h2_intro?: string | null
          id?: string
          intro_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          service_id: string
          updated_at?: string
          zones_text?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          cta_subtitle?: string
          cta_title?: string | null
          h1?: string | null
          h2_intro?: string | null
          id?: string
          intro_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          service_id?: string
          updated_at?: string
          zones_text?: string | null
        }
        Relationships: []
      }
      service_faqs_generic: {
        Row: {
          answer: string
          created_at: string
          id: string
          position: number
          published: boolean
          question: string
          service_id: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          position?: number
          published?: boolean
          question: string
          service_id: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          position?: number
          published?: boolean
          question?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          published: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          published?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          published?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          city_id: string | null
          content: string
          created_at: string
          id: string
          location: string | null
          published: boolean
          rating: number
          service_id: string | null
          updated_at: string
        }
        Insert: {
          author_name: string
          city_id?: string | null
          content: string
          created_at?: string
          id?: string
          location?: string | null
          published?: boolean
          rating: number
          service_id?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          city_id?: string | null
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          published?: boolean
          rating?: number
          service_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never
