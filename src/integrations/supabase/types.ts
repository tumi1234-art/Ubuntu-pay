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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contributions: {
        Row: {
          amount: number
          confidence: number | null
          created_at: string
          date: string
          id: string
          member_id: string
          method: string
          receipt_image_url: string | null
          red_flags: string[] | null
          reference: string | null
          status: string
          stokvel_id: string
          verdict: string | null
        }
        Insert: {
          amount: number
          confidence?: number | null
          created_at?: string
          date?: string
          id?: string
          member_id: string
          method?: string
          receipt_image_url?: string | null
          red_flags?: string[] | null
          reference?: string | null
          status?: string
          stokvel_id: string
          verdict?: string | null
        }
        Update: {
          amount?: number
          confidence?: number | null
          created_at?: string
          date?: string
          id?: string
          member_id?: string
          method?: string
          receipt_image_url?: string | null
          red_flags?: string[] | null
          reference?: string | null
          status?: string
          stokvel_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_stokvel_id_fkey"
            columns: ["stokvel_id"]
            isOneToOne: false
            referencedRelation: "stokvels"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          amount: number
          due_date: string
          id: string
          interest: number
          member_id: string
          months_left: number
          remaining: number
          status: string
          total_months: number
        }
        Insert: {
          amount: number
          due_date: string
          id?: string
          interest: number
          member_id: string
          months_left: number
          remaining: number
          status: string
          total_months: number
        }
        Update: {
          amount?: number
          due_date?: string
          id?: string
          interest?: number
          member_id?: string
          months_left?: number
          remaining?: number
          status?: string
          total_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "loans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          auth_user_id: string | null
          email: string | null
          id: string
          joined: string
          name: string
          phone: string | null
          role: string
          stokvel_id: string
          total_contributed: number
        }
        Insert: {
          auth_user_id?: string | null
          email?: string | null
          id?: string
          joined?: string
          name: string
          phone?: string | null
          role?: string
          stokvel_id: string
          total_contributed?: number
        }
        Update: {
          auth_user_id?: string | null
          email?: string | null
          id?: string
          joined?: string
          name?: string
          phone?: string | null
          role?: string
          stokvel_id?: string
          total_contributed?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_stokvel_id_fkey"
            columns: ["stokvel_id"]
            isOneToOne: false
            referencedRelation: "stokvels"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          date: string
          id: string
          member_id: string | null
          read: boolean
          title: string
          type: string
        }
        Insert: {
          body: string
          date?: string
          id?: string
          member_id?: string | null
          read?: boolean
          title: string
          type: string
        }
        Update: {
          body?: string
          date?: string
          id?: string
          member_id?: string | null
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          merchant_name: string
          threshold_amount: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          id?: string
          merchant_name: string
          threshold_amount?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          merchant_name?: string
          threshold_amount?: number
        }
        Relationships: []
      }
      stokvels: {
        Row: {
          balance: number
          contribution_amount: number
          created_at: string
          created_by: string
          frequency: string
          id: string
          invite_code: string | null
          monthly_target: number
          name: string
          next_contribution: string | null
          payout_cycle: string
        }
        Insert: {
          balance?: number
          contribution_amount?: number
          created_at?: string
          created_by?: string
          frequency?: string
          id?: string
          invite_code?: string | null
          monthly_target?: number
          name: string
          next_contribution?: string | null
          payout_cycle?: string
        }
        Update: {
          balance?: number
          contribution_amount?: number
          created_at?: string
          created_by?: string
          frequency?: string
          id?: string
          invite_code?: string | null
          monthly_target?: number
          name?: string
          next_contribution?: string | null
          payout_cycle?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          date: string
          id: string
          member_id: string | null
          stokvel_id: string
          type: string
        }
        Insert: {
          amount: number
          balance_after: number
          date?: string
          id?: string
          member_id?: string | null
          stokvel_id: string
          type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          date?: string
          id?: string
          member_id?: string | null
          stokvel_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_stokvel_id_fkey"
            columns: ["stokvel_id"]
            isOneToOne: false
            referencedRelation: "stokvels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_contribution: { Args: { _id: string }; Returns: undefined }
      create_stokvel: {
        Args: {
          _amount: number
          _member_name: string
          _name: string
          _target: number
        }
        Returns: string
      }
      is_stokvel_admin: { Args: { _stokvel: string }; Returns: boolean }
      is_stokvel_member: { Args: { _stokvel: string }; Returns: boolean }
      join_stokvel: {
        Args: { _code: string; _member_name: string }
        Returns: string
      }
      member_stokvel: { Args: { _member: string }; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
