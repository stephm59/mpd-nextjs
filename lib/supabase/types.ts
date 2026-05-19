export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
        Relationships: [
          {
            foreignKeyName: "blog_post_faqs_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "blog_posts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone?: string
        }
        Relationships: []
      }
      google_oauth_tokens: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          created_at: string | null
          google_email: string
          id: string
          last_used_at: string | null
          refresh_token: string
          scopes: string[] | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string | null
          google_email: string
          id?: string
          last_used_at?: string | null
          refresh_token: string
          scopes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string | null
          google_email?: string
          id?: string
          last_used_at?: string | null
          refresh_token?: string
          scopes?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rdv_competences: {
        Row: {
          created_at: string
          id: string
          service_id: string
          technicien_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id: string
          technicien_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: string
          technicien_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdv_competences_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "rdv_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rdv_competences_technicien_id_fkey"
            columns: ["technicien_id"]
            isOneToOne: false
            referencedRelation: "rdv_techniciens"
            referencedColumns: ["id"]
          },
        ]
      }
      rdv_marques_chaudiere: {
        Row: {
          created_at: string
          est_active: boolean
          exclusif: boolean
          id: string
          nom: string
          ordre: number
          technicien_specialiste_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          est_active?: boolean
          exclusif?: boolean
          id?: string
          nom: string
          ordre?: number
          technicien_specialiste_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          est_active?: boolean
          exclusif?: boolean
          id?: string
          nom?: string
          ordre?: number
          technicien_specialiste_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdv_marques_chaudiere_technicien_specialiste_id_fkey"
            columns: ["technicien_specialiste_id"]
            isOneToOne: false
            referencedRelation: "rdv_techniciens"
            referencedColumns: ["id"]
          },
        ]
      }
      rdv_notifications: {
        Row: {
          brevo_message_id: string | null
          canal: string
          created_at: string
          envoyee_at: string
          erreur: string | null
          id: string
          reservation_id: string
          succes: boolean
          type: string
        }
        Insert: {
          brevo_message_id?: string | null
          canal: string
          created_at?: string
          envoyee_at?: string
          erreur?: string | null
          id?: string
          reservation_id: string
          succes?: boolean
          type: string
        }
        Update: {
          brevo_message_id?: string | null
          canal?: string
          created_at?: string
          envoyee_at?: string
          erreur?: string | null
          id?: string
          reservation_id?: string
          succes?: boolean
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdv_notifications_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "rdv_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      rdv_parametres: {
        Row: {
          cle: string
          description: string | null
          updated_at: string
          valeur: string
        }
        Insert: {
          cle: string
          description?: string | null
          updated_at?: string
          valeur: string
        }
        Update: {
          cle?: string
          description?: string | null
          updated_at?: string
          valeur?: string
        }
        Relationships: []
      }
      rdv_reservations: {
        Row: {
          annulation_token: string
          annule_at: string | null
          annule_par: string | null
          client_adresse: string
          client_complement: string | null
          client_email: string
          client_nom: string
          client_prenom: string | null
          client_telephone: string
          created_at: string
          creneau_debut: string
          creneau_fin: string
          google_event_calendar_id: string | null
          google_event_created_at: string | null
          google_event_id: string | null
          id: string
          ip_address: unknown
          marque_id: string | null
          notes: string | null
          prix_centimes: number
          reference: string | null
          service_id: string
          statut: string
          technicien_id: string
          updated_at: string
          user_agent: string | null
          ville_id: string
        }
        Insert: {
          annulation_token?: string
          annule_at?: string | null
          annule_par?: string | null
          client_adresse: string
          client_complement?: string | null
          client_email: string
          client_nom: string
          client_prenom?: string | null
          client_telephone: string
          created_at?: string
          creneau_debut: string
          creneau_fin: string
          google_event_calendar_id?: string | null
          google_event_created_at?: string | null
          google_event_id?: string | null
          id?: string
          ip_address?: unknown
          marque_id?: string | null
          notes?: string | null
          prix_centimes?: number
          reference?: string | null
          service_id: string
          statut?: string
          technicien_id: string
          updated_at?: string
          user_agent?: string | null
          ville_id: string
        }
        Update: {
          annulation_token?: string
          annule_at?: string | null
          annule_par?: string | null
          client_adresse?: string
          client_complement?: string | null
          client_email?: string
          client_nom?: string
          client_prenom?: string | null
          client_telephone?: string
          created_at?: string
          creneau_debut?: string
          creneau_fin?: string
          google_event_calendar_id?: string | null
          google_event_created_at?: string | null
          google_event_id?: string | null
          id?: string
          ip_address?: unknown
          marque_id?: string | null
          notes?: string | null
          prix_centimes?: number
          reference?: string | null
          service_id?: string
          statut?: string
          technicien_id?: string
          updated_at?: string
          user_agent?: string | null
          ville_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdv_reservations_marque_id_fkey"
            columns: ["marque_id"]
            isOneToOne: false
            referencedRelation: "rdv_marques_chaudiere"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rdv_reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "rdv_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rdv_reservations_technicien_id_fkey"
            columns: ["technicien_id"]
            isOneToOne: false
            referencedRelation: "rdv_techniciens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rdv_reservations_ville_id_fkey"
            columns: ["ville_id"]
            isOneToOne: false
            referencedRelation: "rdv_villes"
            referencedColumns: ["id"]
          },
        ]
      }
      rdv_services: {
        Row: {
          created_at: string
          description: string | null
          duree_minutes: number
          est_actif: boolean
          est_devis: boolean
          id: string
          nom: string
          ordre: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duree_minutes: number
          est_actif?: boolean
          est_devis?: boolean
          id?: string
          nom: string
          ordre?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duree_minutes?: number
          est_actif?: boolean
          est_devis?: boolean
          id?: string
          nom?: string
          ordre?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      rdv_tarifs_ville: {
        Row: {
          created_at: string
          id: string
          prix_centimes: number
          service_id: string
          updated_at: string
          ville_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prix_centimes?: number
          service_id: string
          updated_at?: string
          ville_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prix_centimes?: number
          service_id?: string
          updated_at?: string
          ville_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rdv_tarifs_ville_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "rdv_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rdv_tarifs_ville_ville_id_fkey"
            columns: ["ville_id"]
            isOneToOne: false
            referencedRelation: "rdv_villes"
            referencedColumns: ["id"]
          },
        ]
      }
      rdv_techniciens: {
        Row: {
          created_at: string
          email_google: string | null
          email_workspace: string
          est_actif: boolean
          id: string
          ordre: number
          prenom: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_google?: string | null
          email_workspace: string
          est_actif?: boolean
          id?: string
          ordre?: number
          prenom: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_google?: string | null
          email_workspace?: string
          est_actif?: boolean
          id?: string
          ordre?: number
          prenom?: string
          updated_at?: string
        }
        Relationships: []
      }
      rdv_villes: {
        Row: {
          code_postal: string
          created_at: string
          est_active: boolean
          id: string
          nom: string
          updated_at: string
        }
        Insert: {
          code_postal: string
          created_at?: string
          est_active?: boolean
          id?: string
          nom: string
          updated_at?: string
        }
        Update: {
          code_postal?: string
          created_at?: string
          est_active?: boolean
          id?: string
          nom?: string
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
        Relationships: [
          {
            foreignKeyName: "service_city_faqs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_city_faqs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "service_city_offers_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "service_city_pages"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "service_city_pages_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_city_pages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "service_faqs_generic_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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
      staging_service_city_faqs: {
        Row: {
          answer: string
          city_slug: string
          position: number
          published: boolean | null
          question: string
          service_slug: string
        }
        Insert: {
          answer: string
          city_slug: string
          position: number
          published?: boolean | null
          question: string
          service_slug: string
        }
        Update: {
          answer?: string
          city_slug?: string
          position?: number
          published?: boolean | null
          question?: string
          service_slug?: string
        }
        Relationships: []
      }
      staging_service_city_offers: {
        Row: {
          city_slug: string
          description: string | null
          emoji: string | null
          icon_name: string | null
          position: number
          service_slug: string
          title: string
        }
        Insert: {
          city_slug: string
          description?: string | null
          emoji?: string | null
          icon_name?: string | null
          position: number
          service_slug: string
          title: string
        }
        Update: {
          city_slug?: string
          description?: string | null
          emoji?: string | null
          icon_name?: string | null
          position?: number
          service_slug?: string
          title?: string
        }
        Relationships: []
      }
      staging_service_city_pages: {
        Row: {
          city_slug: string
          cta_subtitle: string | null
          cta_title: string | null
          h1: string | null
          h2_intro: string | null
          intro_description: string | null
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          published_at: string | null
          service_slug: string
          zones_text: string | null
        }
        Insert: {
          city_slug: string
          cta_subtitle?: string | null
          cta_title?: string | null
          h1?: string | null
          h2_intro?: string | null
          intro_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          service_slug: string
          zones_text?: string | null
        }
        Update: {
          city_slug?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          h1?: string | null
          h2_intro?: string | null
          intro_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          service_slug?: string
          zones_text?: string | null
        }
        Relationships: []
      }
      staging_testimonials: {
        Row: {
          author_name: string
          city_slug: string | null
          content: string
          location: string | null
          published: boolean | null
          rating: number | null
          service_slug: string | null
        }
        Insert: {
          author_name: string
          city_slug?: string | null
          content: string
          location?: string | null
          published?: boolean | null
          rating?: number | null
          service_slug?: string | null
        }
        Update: {
          author_name?: string
          city_slug?: string | null
          content?: string
          location?: string | null
          published?: boolean | null
          rating?: number | null
          service_slug?: string | null
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
        Relationships: [
          {
            foreignKeyName: "testimonials_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
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

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
