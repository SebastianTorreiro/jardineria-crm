export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          date: string
          description: string | null
          id: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          organization_id: string | null
          share_percentage: number
          visit_id: string | null
          worker_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          organization_id?: string | null
          share_percentage: number
          visit_id?: string | null
          worker_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          organization_id?: string | null
          share_percentage?: number
          visit_id?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          client_id: string
          created_at: string | null
          frequency_days: number | null
          google_maps_link: string | null
          id: string
          organization_id: string
          photos: string[] | null
          updated_at: string | null
        }
        Insert: {
          address: string
          client_id: string
          created_at?: string | null
          frequency_days?: number | null
          google_maps_link?: string | null
          id?: string
          organization_id: string
          photos?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          client_id?: string
          created_at?: string | null
          frequency_days?: number | null
          google_maps_link?: string | null
          id?: string
          organization_id?: string
          photos?: string[] | null
          updated_at?: string | null
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
          },
        ]
      }
      supplies: {
        Row: {
          created_at: string | null
          current_stock: number | null
          id: string
          min_stock: number | null
          name: string
          organization_id: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          current_stock?: number | null
          id?: string
          min_stock?: number | null
          name: string
          organization_id?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          current_stock?: number | null
          id?: string
          min_stock?: number | null
          name?: string
          organization_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          brand: string | null
          created_at: string | null
          current_uses: number | null
          id: string
          maintenance_limit_uses: number | null
          name: string
          organization_id: string
          purchase_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          current_uses?: number | null
          id?: string
          maintenance_limit_uses?: number | null
          name: string
          organization_id: string
          purchase_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          current_uses?: number | null
          id?: string
          maintenance_limit_uses?: number | null
          name?: string
          organization_id?: string
          purchase_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_attendance: {
        Row: {
          organization_id: string | null
          visit_id: string
          worker_id: string
        }
        Insert: {
          organization_id?: string | null
          visit_id: string
          worker_id: string
        }
        Update: {
          organization_id?: string | null
          visit_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_attendance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_attendance_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_attendance_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          completed_at: string | null
          created_at: string | null
          direct_expenses: number | null
          estimated_duration_mins: number | null
          estimated_income: number | null
          id: string
          notes: string | null
          notes_after_visit: string | null
          notes_embedding: string | null
          organization_id: string
          property_id: string
          real_income: number | null
          scheduled_date: string
          start_time: string | null
          status: Database["public"]["Enums"]["visit_status"]
          tools_used_summary: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          direct_expenses?: number | null
          estimated_duration_mins?: number | null
          estimated_income?: number | null
          id?: string
          notes?: string | null
          notes_after_visit?: string | null
          notes_embedding?: string | null
          organization_id: string
          property_id: string
          real_income?: number | null
          scheduled_date: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          tools_used_summary?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          direct_expenses?: number | null
          estimated_duration_mins?: number | null
          estimated_income?: number | null
          id?: string
          notes?: string | null
          notes_after_visit?: string | null
          notes_embedding?: string | null
          organization_id?: string
          property_id?: string
          real_income?: number | null
          scheduled_date?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          tools_used_summary?: string | null
          total_price?: number | null
          updated_at?: string | null
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
          },
        ]
      }
      workers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          is_partner: boolean | null
          name: string
          organization_id: string | null
          share_percentage: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_partner?: boolean | null
          name: string
          organization_id?: string | null
          share_percentage?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_partner?: boolean | null
          name?: string
          organization_id?: string | null
          share_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "workers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_visit_with_payouts: {
        Args: {
          p_expenses: number
          p_income: number
          p_org_id: string
          p_payouts: Json
          p_visit_id: string
        }
        Returns: Json
      }
      create_organization_for_user: {
        Args: { org_name: string }
        Returns: string
      }
      is_member: { Args: { org_id: string }; Returns: boolean }
    }
    Enums: {
      expense_category:
        | "fuel"
        | "equipment"
        | "maintenance"
        | "other"
        | "combustible"
        | "repuestos"
        | "sueldos"
        | "herramientas"
        | "otros"
      visit_status: "pending" | "completed" | "canceled"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      expense_category: [
        "fuel",
        "equipment",
        "maintenance",
        "other",
        "combustible",
        "repuestos",
        "sueldos",
        "herramientas",
        "otros",
      ],
      visit_status: ["pending", "completed", "canceled"],
    },
  },
} as const

