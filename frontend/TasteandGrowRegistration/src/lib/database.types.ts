export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          school_code: string
          school_name: string
          city_region: string
          contact_name: string
          contact_role: string
          contact_email: string
          student_count: number | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_code: string
          school_name: string
          city_region: string
          contact_name: string
          contact_role: string
          contact_email: string
          student_count?: number | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_code?: string
          school_name?: string
          city_region?: string
          contact_name?: string
          contact_role?: string
          contact_email?: string
          student_count?: number | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          name: string
          description: string
          items_included: Json
          base_price: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          items_included: Json
          base_price: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          items_included?: Json
          base_price?: number
          active?: boolean
          created_at?: string
        }
      }
      school_activations: {
        Row: {
          id: string
          school_id: string
          experience_id: string
          event_date: string
          fundraiser_amount: number
          parent_qr_code: string
          teacher_qr_code: string
          status: string
          total_raised: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          experience_id: string
          event_date: string
          fundraiser_amount?: number
          parent_qr_code: string
          teacher_qr_code: string
          status?: string
          total_raised?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          experience_id?: string
          event_date?: string
          fundraiser_amount?: number
          parent_qr_code?: string
          teacher_qr_code?: string
          status?: string
          total_raised?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'viewer'
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'viewer'
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'viewer'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: 'admin' | 'viewer'
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: 'admin' | 'viewer'
    }
  }
}
