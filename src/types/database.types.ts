export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          name: string
          phone: string | null
          email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          address: string
          google_maps_link: string | null
          frequency_days: number | null
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          address: string
          google_maps_link?: string | null
          frequency_days?: number | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          client_id?: string
          address?: string
          google_maps_link?: string | null
          frequency_days?: number | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      visits: {
        Row: {
          id: string
          organization_id: string
          property_id: string
          scheduled_date: string
          status: 'pending' | 'completed' | 'canceled'
          estimated_income: number | null
          real_income: number | null
          notes: string | null
          tools_used_summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          property_id: string
          scheduled_date: string
          status?: 'pending' | 'completed' | 'canceled'
          estimated_income?: number | null
          real_income?: number | null
          notes?: string | null
          tools_used_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          property_id?: string
          scheduled_date?: string
          status?: 'pending' | 'completed' | 'canceled'
          estimated_income?: number | null
          real_income?: number | null
          notes?: string | null
          tools_used_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      tools: {
        Row: {
          id: string
          organization_id: string
          name: string
          brand: string | null
          purchase_date: string | null
          maintenance_limit_uses: number | null
          current_uses: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          brand?: string | null
          purchase_date?: string | null
          maintenance_limit_uses?: number | null
          current_uses?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          brand?: string | null
          purchase_date?: string | null
          maintenance_limit_uses?: number | null
          current_uses?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          organization_id: string
          amount: number
          category: 'fuel' | 'equipment' | 'maintenance' | 'other'
          date: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          amount: number
          category: 'fuel' | 'equipment' | 'maintenance' | 'other'
          date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          amount?: number
          category?: 'fuel' | 'equipment' | 'maintenance' | 'other'
          date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_for_user: {
        Args: {
          org_name: string
        }
        Returns: string
      }
    }
    Enums: {
      visit_status: 'pending' | 'completed' | 'canceled'
      expense_category: 'fuel' | 'equipment' | 'maintenance' | 'other'
    }
  }
}
