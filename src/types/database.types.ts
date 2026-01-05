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
        PostgrestVersion: "14.1"
    },
    public: {
        Tables: {
            ACCOUNT: {
                Row: {
                    account_address: string
                    account_business_total_earnings: number
                    account_clicker_total_earnings: number
                    account_current_stage: number | null
                    account_email: string
                    account_fname: string
                    account_id: number
                    account_investment_total_earnings: number
                    account_lname: string | null
                    account_mname: string | null
                    account_pin: string
                    account_pword: string
                    account_registered_device: string | null
                    account_status: number
                    account_total_clicks: number
                    account_uname: string
                    type_id: number
                }
                Insert: {
                    account_address: string
                    account_business_total_earnings?: number
                    account_clicker_total_earnings?: number
                    account_current_stage?: number | null
                    account_email: string
                    account_fname: string
                    account_id?: number
                    account_investment_total_earnings?: number
                    account_lname?: string | null
                    account_mname?: string | null
                    account_pin: string
                    account_pword: string
                    account_registered_device?: string | null
                    account_status?: number
                    account_total_clicks?: number
                    account_uname: string
                    type_id: number
                }
                Update: {
                    account_address?: string
                    account_business_total_earnings?: number
                    account_clicker_total_earnings?: number
                    account_current_stage?: number | null
                    account_email?: string
                    account_fname?: string
                    account_id?: number
                    account_investment_total_earnings?: number
                    account_lname?: string | null
                    account_mname?: string | null
                    account_pin?: string
                    account_pword?: string
                    account_registered_device?: string | null
                    account_status?: number
                    account_total_clicks?: number
                    account_uname?: string
                    type_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "ACCOUNT_type_id_fkey"
                        columns: ["type_id"]
                        isOneToOne: false
                        referencedRelation: "TYPE"
                        referencedColumns: ["type_id"]
                    },
                ]
            }
            ASSET: {
                Row: {
                    asset_detail_name: string
                    asset_detail_short_desc: string
                    asset_id: number
                    asset_image_path: string
                    asset_location: string
                    asset_max_upgrades: number
                    asset_monthly_maintenance: number
                    asset_price: number
                    asset_status: number
                    asset_type_id: number
                    tax_type_id: number
                }
                Insert: {
                    asset_detail_name: string
                    asset_detail_short_desc: string
                    asset_id?: number
                    asset_image_path: string
                    asset_location: string
                    asset_max_upgrades: number
                    asset_monthly_maintenance: number
                    asset_price: number
                    asset_status: number
                    asset_type_id: number
                    tax_type_id: number
                }
                Update: {
                    asset_detail_name?: string
                    asset_detail_short_desc?: string
                    asset_id?: number
                    asset_image_path?: string
                    asset_location?: string
                    asset_max_upgrades?: number
                    asset_monthly_maintenance?: number
                    asset_price?: number
                    asset_status?: number
                    asset_type_id?: number
                    tax_type_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "ASSET_asset_type_id_fkey"
                        columns: ["asset_type_id"]
                        isOneToOne: false
                        referencedRelation: "ASSET_TYPE"
                        referencedColumns: ["asset_type_id"]
                    },
                ]
            }
            ASSET_CATEGORY: {
                Row: {
                    asset_category_desc: string
                    asset_category_id: number
                    asset_category_name: string
                    asset_category_status: number
                }
                Insert: {
                    asset_category_desc: string
                    asset_category_id?: number
                    asset_category_name: string
                    asset_category_status: number
                }
                Update: {
                    asset_category_desc?: string
                    asset_category_id?: number
                    asset_category_name?: string
                    asset_category_status?: number
                }
                Relationships: []
            }
            ASSET_DETAIL: {
                Row: {
                    asset_detail_id: number
                    asset_id: number
                    detail_id: number
                }
                Insert: {
                    asset_detail_id?: number
                    asset_id: number
                    detail_id: number
                }
                Update: {
                    asset_detail_id?: number
                    asset_id?: number
                    detail_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "ASSET_DETAIL_asset_id_fkey"
                        columns: ["asset_id"]
                        isOneToOne: false
                        referencedRelation: "ASSET"
                        referencedColumns: ["asset_id"]
                    },
                    {
                        foreignKeyName: "ASSET_DETAIL_detail_id_fkey"
                        columns: ["detail_id"]
                        isOneToOne: false
                        referencedRelation: "DETAIL"
                        referencedColumns: ["detail_id"]
                    },
                ]
            }
            ASSET_TYPE: {
                Row: {
                    asset_category_id: number
                    asset_type_desc: string
                    asset_type_id: number
                    asset_type_name: string
                    asset_type_status: number
                }
                Insert: {
                    asset_category_id: number
                    asset_type_desc: string
                    asset_type_id?: number
                    asset_type_name: string
                    asset_type_status: number
                }
                Update: {
                    asset_category_id?: number
                    asset_type_desc?: string
                    asset_type_id?: number
                    asset_type_name?: string
                    asset_type_status?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "ASSET_TYPE_asset_category_id_fkey"
                        columns: ["asset_category_id"]
                        isOneToOne: false
                        referencedRelation: "ASSET_CATEGORY"
                        referencedColumns: ["asset_category_id"]
                    },
                ]
            }
            BUSINESS: {
                Row: {
                    business_id: number
                    business_type_id: number
                    tax_type_id: number
                    total_earnings: number
                }
                Insert: {
                    business_id?: number
                    business_type_id: number
                    tax_type_id: number
                    total_earnings?: number
                }
                Update: {
                    business_id?: number
                    business_type_id?: number
                    tax_type_id?: number
                    total_earnings?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "BUSINESS_business_type_id_fkey"
                        columns: ["business_type_id"]
                        isOneToOne: false
                        referencedRelation: "BUSINESS_TYPE"
                        referencedColumns: ["business_type_id"]
                    },
                ]
            }
            BUSINESS_TYPE: {
                Row: {
                    business_type_desc: string
                    business_type_id: number
                    business_type_name: string
                    business_type_status: number
                }
                Insert: {
                    business_type_desc: string
                    business_type_id?: number
                    business_type_name: string
                    business_type_status?: number
                }
                Update: {
                    business_type_desc?: string
                    business_type_id?: number
                    business_type_name?: string
                    business_type_status?: number
                }
                Relationships: []
            }
            BUSINESS_TYPE_DETAIL: {
                Row: {
                    business_type_detail_desc: string | null
                    business_type_detail_id: number
                    business_type_detail_max_employees: number
                    business_type_detail_min_employees: number
                    business_type_detail_name: string
                    business_type_id: number
                    image_path: string
                    initial_cost: number
                    location: string | null
                    maintenance_cost: number
                    monthly_earnings: number
                }
                Insert: {
                    business_type_detail_desc?: string | null
                    business_type_detail_id?: number
                    business_type_detail_max_employees: number
                    business_type_detail_min_employees: number
                    business_type_detail_name: string
                    business_type_id: number
                    image_path: string
                    initial_cost: number
                    location?: string | null
                    maintenance_cost: number
                    monthly_earnings: number
                }
                Update: {
                    business_type_detail_desc?: string | null
                    business_type_detail_id?: number
                    business_type_detail_max_employees?: number
                    business_type_detail_min_employees?: number
                    business_type_detail_name?: string
                    business_type_id?: number
                    image_path?: string
                    initial_cost?: number
                    location?: string | null
                    maintenance_cost?: number
                    monthly_earnings?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "BUSINESS_TYPE_DETAIL_business_type_id_fkey"
                        columns: ["business_type_id"]
                        isOneToOne: false
                        referencedRelation: "BUSINESS_TYPE"
                        referencedColumns: ["business_type_id"]
                    },
                ]
            }
            CARD: {
                Row: {
                    account_id: number
                    card_balance: number
                    card_cvv: string
                    card_expiry: string
                    card_id: number
                    card_limit: number | null
                    card_number: string
                    card_status: number
                    card_type_id: number
                }
                Insert: {
                    account_id: number
                    card_balance?: number
                    card_cvv: string
                    card_expiry: string
                    card_id?: number
                    card_limit?: number | null
                    card_number: string
                    card_status?: number
                    card_type_id: number
                }
                Update: {
                    account_id?: number
                    card_balance?: number
                    card_cvv?: string
                    card_expiry?: string
                    card_id?: number
                    card_limit?: number | null
                    card_number?: string
                    card_status?: number
                    card_type_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "CARD_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                    {
                        foreignKeyName: "CARD_card_type_id_fkey"
                        columns: ["card_type_id"]
                        isOneToOne: false
                        referencedRelation: "CARD_TYPE"
                        referencedColumns: ["card_type_id"]
                    },
                ]
            }
            CARD_TYPE: {
                Row: {
                    card_type_desc: string
                    card_type_id: number
                    card_type_name: string
                    color: string
                    daily_withdrawal_limit: number
                    interest_rate: number
                    monthly_fee: number
                    status: number
                }
                Insert: {
                    card_type_desc: string
                    card_type_id?: number
                    card_type_name: string
                    color: string
                    daily_withdrawal_limit: number
                    interest_rate: number
                    monthly_fee?: number
                    status?: number
                }
                Update: {
                    card_type_desc?: string
                    card_type_id?: number
                    card_type_name?: string
                    color?: string
                    daily_withdrawal_limit?: number
                    interest_rate?: number
                    monthly_fee?: number
                    status?: number
                }
                Relationships: []
            }
            DETAIL: {
                Row: {
                    detail: string
                    detail_id: number
                    detail_label: string
                }
                Insert: {
                    detail: string
                    detail_id?: number
                    detail_label: string
                }
                Update: {
                    detail?: string
                    detail_id?: number
                    detail_label?: string
                }
                Relationships: []
            }
            INVESTMENT: {
                Row: {
                    account_id: number
                    investment_id: number
                    investment_type_id: number
                    total_earnings: number
                }
                Insert: {
                    account_id: number
                    investment_id?: number
                    investment_type_id: number
                    total_earnings?: number
                }
                Update: {
                    account_id?: number
                    investment_id?: number
                    investment_type_id?: number
                    total_earnings?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "INVESTMENT_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                    {
                        foreignKeyName: "INVESTMENT_investment_type_id_fkey"
                        columns: ["investment_type_id"]
                        isOneToOne: false
                        referencedRelation: "INVESTMENT_TYPE"
                        referencedColumns: ["investment_type_id"]
                    },
                ]
            }
            INVESTMENT_TYPE: {
                Row: {
                    investment_type_desc: string
                    investment_type_id: number
                    investment_type_name: string
                    investment_type_roi: number
                    investment_type_status: number
                }
                Insert: {
                    investment_type_desc: string
                    investment_type_id?: number
                    investment_type_name: string
                    investment_type_roi: number
                    investment_type_status?: number
                }
                Update: {
                    investment_type_desc?: string
                    investment_type_id?: number
                    investment_type_name?: string
                    investment_type_roi?: number
                    investment_type_status?: number
                }
                Relationships: []
            }
            INVOICE: {
                Row: {
                    account_id: number
                    invoice_amount: number
                    invoice_desc: string
                    invoice_due_date: string
                    invoice_id: number
                    invoice_status: number
                    issued_date: string
                }
                Insert: {
                    account_id: number
                    invoice_amount: number
                    invoice_desc: string
                    invoice_due_date: string
                    invoice_id?: number
                    invoice_status?: number
                    issued_date?: string
                }
                Update: {
                    account_id?: number
                    invoice_amount?: number
                    invoice_desc?: string
                    invoice_due_date?: string
                    invoice_id?: number
                    invoice_status?: number
                    issued_date?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "INVOICE_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                ]
            }
            TRANSACTION: {
                Row: {
                    account_id: number
                    transaction_amount: number
                    transaction_date: string
                    transaction_desc: string
                    transaction_id: number
                    transaction_status: number
                    transaction_type_id: number
                }
                Insert: {
                    account_id: number
                    transaction_amount: number
                    transaction_date?: string
                    transaction_desc: string
                    transaction_id?: number
                    transaction_status?: number
                    transaction_type_id: number
                }
                Update: {
                    account_id?: number
                    transaction_amount?: number
                    transaction_date?: string
                    transaction_desc?: string
                    transaction_id?: number
                    transaction_status?: number
                    transaction_type_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "TRANSACTION_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                    {
                        foreignKeyName: "TRANSACTION_transaction_type_id_fkey"
                        columns: ["transaction_type_id"]
                        isOneToOne: false
                        referencedRelation: "TRANSACTION_TYPE"
                        referencedColumns: ["transaction_type_id"]
                    },
                ]
            }
            TRANSACTION_TYPE: {
                Row: {
                    transaction_type_desc: string
                    transaction_type_id: number
                    transaction_type_name: string
                    transaction_type_status: number
                }
                Insert: {
                    transaction_type_desc: string
                    transaction_type_id?: number
                    transaction_type_name: string
                    transaction_type_status?: number
                }
                Update: {
                    transaction_type_desc?: string
                    transaction_type_id?: number
                    transaction_type_name?: string
                    transaction_type_status?: number
                }
                Relationships: []
            }
            TYPE: {
                Row: {
                    status: number
                    type_desc: string
                    type_id: number
                    type_max_stage: number | null
                    type_name: string
                }
                Insert: {
                    status?: number
                    type_desc: string
                    type_id?: number
                    type_max_stage?: number | null
                    type_name: string
                }
                Update: {
                    status?: number
                    type_desc?: string
                    type_id?: number
                    type_max_stage?: number | null
                    type_name?: string
                }
                Relationships: []
            }
            USER_ASSET: {
                Row: {
                    account_id: number
                    asset_detail_id: number
                    last_maintenance_paid: string
                    last_tax_collection: string
                    user_asset_current_upgrade: number
                    user_asset_custom_name: string
                    user_asset_id: number
                    user_asset_market_value: number
                    user_asset_monthly_maintenance: number
                    user_asset_monthly_tax: number
                    user_asset_status: number
                }
                Insert: {
                    account_id: number
                    asset_detail_id: number
                    last_maintenance_paid: string
                    last_tax_collection: string
                    user_asset_current_upgrade: number
                    user_asset_custom_name: string
                    user_asset_id?: number
                    user_asset_market_value: number
                    user_asset_monthly_maintenance: number
                    user_asset_monthly_tax: number
                    user_asset_status: number
                }
                Update: {
                    account_id?: number
                    asset_detail_id?: number
                    last_maintenance_paid?: string
                    last_tax_collection?: string
                    user_asset_current_upgrade?: number
                    user_asset_custom_name?: string
                    user_asset_id?: number
                    user_asset_market_value?: number
                    user_asset_monthly_maintenance?: number
                    user_asset_monthly_tax?: number
                    user_asset_status?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "USER_ASSET_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                    {
                        foreignKeyName: "USER_ASSET_asset_detail_id_fkey"
                        columns: ["asset_detail_id"]
                        isOneToOne: false
                        referencedRelation: "ASSET_DETAIL"
                        referencedColumns: ["asset_detail_id"]
                    },
                ]
            }
            USER_BUSINESS: {
                Row: {
                    account_id: number
                    business_type_detail_id: number
                    last_maintenance_collection: string
                    last_tax_collection: string
                    user_business_current_level: number
                    user_business_desc: string
                    user_business_earnings: number
                    user_business_id: number
                    user_business_location: string
                    user_business_monthly_income: number
                    user_business_monthly_maintenance: number
                    user_business_monthly_tax: number
                    user_business_name: string
                    user_business_status: number
                    user_business_worth: number
                }
                Insert: {
                    account_id: number
                    business_type_detail_id: number
                    last_maintenance_collection?: string
                    last_tax_collection?: string
                    user_business_current_level: number
                    user_business_desc: string
                    user_business_earnings: number
                    user_business_id?: number
                    user_business_location: string
                    user_business_monthly_income: number
                    user_business_monthly_maintenance: number
                    user_business_monthly_tax: number
                    user_business_name: string
                    user_business_status: number
                    user_business_worth: number
                }
                Update: {
                    account_id?: number
                    business_type_detail_id?: number
                    last_maintenance_collection?: string
                    last_tax_collection?: string
                    user_business_current_level?: number
                    user_business_desc?: string
                    user_business_earnings?: number
                    user_business_id?: number
                    user_business_location?: string
                    user_business_monthly_income?: number
                    user_business_monthly_maintenance?: number
                    user_business_monthly_tax?: number
                    user_business_name?: string
                    user_business_status?: number
                    user_business_worth?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "USER_BUSINESS_account_id_fkey"
                        columns: ["account_id"]
                        isOneToOne: false
                        referencedRelation: "ACCOUNT"
                        referencedColumns: ["account_id"]
                    },
                    {
                        foreignKeyName: "USER_BUSINESS_business_type_detail_id_fkey"
                        columns: ["business_type_detail_id"]
                        isOneToOne: false
                        referencedRelation: "BUSINESS_TYPE_DETAIL"
                        referencedColumns: ["business_type_detail_id"]
                    },
                ]
            }
        },
        Views: {
            [_ in never]: never
        },
        Functions: {
            [_ in never]: never
        },
        Enums: {
            [_ in never]: never
        },
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: Exclude<keyof Database, "__InternalSupabase"> },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: Exclude<keyof Database, "__InternalSupabase">
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, "__InternalSupabase"> }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
