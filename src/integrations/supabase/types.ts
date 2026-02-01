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
      store_banners: {
        Row: {
          id: string
          title: string | null
          image_url: string
          redirect_link: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          image_url: string
          redirect_link?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          image_url?: string
          redirect_link?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_sections: {
        Row: {
          id: string
          section_key: string
          title: string
          is_active: boolean
          display_order: number
          config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          title: string
          is_active?: boolean
          display_order?: number
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          title?: string
          is_active?: boolean
          display_order?: number
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ads_management: {
        Row: {
          id: string
          ads_title: string
          ads_vendor: string | null
          media_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          ads_title: string
          ads_vendor?: string | null
          media_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          ads_title?: string
          ads_vendor?: string | null
          media_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          id: string
          code: string
          name: string
          price: number
          headline: string | null
          description: string | null
          features: Json | null
          bonus: string | null
          level: number | null
          color_theme: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          price: number
          headline?: string | null
          description?: string | null
          features?: Json | null
          bonus?: string | null
          level?: number | null
          color_theme?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          price?: number
          headline?: string | null
          description?: string | null
          features?: Json | null
          bonus?: string | null
          level?: number | null
          color_theme?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      agent_income: {
        Row: {
          id: string
          user_id: string
          wallet: number
          referral_income: number
          level_income: number
          share_income: number
          task_income: number
          total_income: number
          withdrawn_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet?: number
          referral_income?: number
          level_income?: number
          share_income?: number
          task_income?: number
          total_income?: number
          withdrawn_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet?: number
          referral_income?: number
          level_income?: number
          share_income?: number
          task_income?: number
          total_income?: number
          withdrawn_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_tasks: {
        Row: {
          id: string
          task_title: string
          task_description: string | null
          requirements: string | null
          optional_url_1: string | null
          optional_url_2: string | null
          file_url: string | null
          task_amount: number
          proof_type: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task_title: string
          task_description?: string | null
          requirements?: string | null
          optional_url_1?: string | null
          optional_url_2?: string | null
          file_url?: string | null
          task_amount?: number
          proof_type?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task_title?: string
          task_description?: string | null
          requirements?: string | null
          optional_url_1?: string | null
          optional_url_2?: string | null
          file_url?: string | null
          task_amount?: number
          proof_type?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      completed_app_tasks: {
        Row: {
          id: string
          task_id: string
          user_id: string
          file_paths: string[] | null
          user_id_proof: string | null
          payment_status: string
          admin_notes: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          file_paths?: string[] | null
          user_id_proof?: string | null
          payment_status?: string
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          file_paths?: string[] | null
          user_id_proof?: string | null
          payment_status?: string
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_app_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "app_tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      completed_whatsapp_tasks: {
        Row: {
          id: string
          task_id: string
          user_id: string
          file_paths: string[] | null
          screenshot_url: string | null
          status: string | null
          payment_status: string
          admin_notes: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string | null
          processed_at: string | null
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          file_paths?: string[] | null
          screenshot_url?: string | null
          status?: string | null
          payment_status?: string
          admin_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string | null
          processed_at?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          file_paths?: string[] | null
          screenshot_url?: string | null
          status?: string | null
          payment_status?: string
          admin_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string | null
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_whatsapp_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "whatsapp_tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          episode_id: string
          completed: boolean
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          episode_id: string
          completed?: boolean
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          episode_id?: string
          completed?: boolean
          completed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      courses: {
        Row: {
          id: string
          course_name: string
          description: string | null
          price: number
          category: string | null
          level: string | null
          duration: string | null
          package: string | null
          course_file: string | null
          thumbnail: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_name: string
          description?: string | null
          price?: number
          category?: string | null
          level?: string | null
          duration?: string | null
          package?: string | null
          course_file?: string | null
          thumbnail?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_name?: string
          description?: string | null
          price?: number
          category?: string | null
          level?: string | null
          duration?: string | null
          package?: string | null
          course_file?: string | null
          thumbnail?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_episodes: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_episodes_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      course_submissions: {
        Row: {
          id: string
          user_id: string
          username: string
          contact_number: string
          whatsapp_number: string
          email: string
          course_link: string
          course_description: string | null
          status: string
          admin_notes: string | null
          price: number | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          contact_number: string
          whatsapp_number: string
          email: string
          course_link: string
          course_description?: string | null
          status?: string
          admin_notes?: string | null
          price?: number | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          contact_number?: string
          whatsapp_number?: string
          email?: string
          course_link?: string
          course_description?: string | null
          status?: string
          admin_notes?: string | null
          price?: number | null
          created_at?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          email: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          email: string
          token: string
          expires_at?: string
          created_at?: string
        }
        Update: {
          email?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
      income_settings: {
        Row: {
          id: string
          package_name: string
          referral_commission: number
          level_1_income: number
          level_2_income: number
          level_3_income: number
          level_4_income: number
          level_5_income: number
          level_6_income: number
          level_7_income: number
          level_8_income: number
          level_9_income: number
          level_10_income: number
          level_11_income: number
          level_12_income: number
          spillover_level_1: number
          spillover_level_2: number
          spillover_level_3: number
          spillover_level_4: number
          revenue_share_level_1: number
          revenue_share_level_2: number
          revenue_share_level_3: number
          revenue_share_level_4: number
          revenue_share_level_5: number
          revenue_share_level_6: number
          revenue_share_level_7: number
          revenue_share_level_8: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_name: string
          referral_commission?: number
          level_1_income?: number
          level_2_income?: number
          level_3_income?: number
          level_4_income?: number
          level_5_income?: number
          level_6_income?: number
          level_7_income?: number
          level_8_income?: number
          level_9_income?: number
          level_10_income?: number
          level_11_income?: number
          level_12_income?: number
          spillover_level_1?: number
          spillover_level_2?: number
          spillover_level_3?: number
          spillover_level_4?: number
          revenue_share_level_1?: number
          revenue_share_level_2?: number
          revenue_share_level_3?: number
          revenue_share_level_4?: number
          revenue_share_level_5?: number
          revenue_share_level_6?: number
          revenue_share_level_7?: number
          revenue_share_level_8?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_name?: string
          referral_commission?: number
          level_1_income?: number
          level_2_income?: number
          level_3_income?: number
          level_4_income?: number
          level_5_income?: number
          level_6_income?: number
          level_7_income?: number
          level_8_income?: number
          level_9_income?: number
          level_10_income?: number
          level_11_income?: number
          level_12_income?: number
          spillover_level_1?: number
          spillover_level_2?: number
          spillover_level_3?: number
          spillover_level_4?: number
          revenue_share_level_1?: number
          revenue_share_level_2?: number
          revenue_share_level_3?: number
          revenue_share_level_4?: number
          revenue_share_level_5?: number
          revenue_share_level_6?: number
          revenue_share_level_7?: number
          revenue_share_level_8?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          plan_name: string
          transaction_id: string | null
          screenshot_url: string | null
          status: string | null
          admin_notes: string | null
          approved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          plan_name: string
          transaction_id?: string | null
          screenshot_url?: string | null
          status?: string | null
          admin_notes?: string | null
          approved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          plan_name?: string
          transaction_id?: string | null
          screenshot_url?: string | null
          status?: string | null
          admin_notes?: string | null
          approved_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          id: string
          user_id: string
          amount: number
          payment_type: string
          transaction_id: string | null
          proof_image: string | null
          status: string | null
          admin_notes: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          payment_type: string
          transaction_id?: string | null
          proof_image?: string | null
          status?: string | null
          admin_notes?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          payment_type?: string
          transaction_id?: string | null
          proof_image?: string | null
          status?: string | null
          admin_notes?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string | null
          student_id: string | null
          email: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          phone_number: string | null
          role: string
          wallet_balance: number
          total_earnings: number
          referral_code: string | null
          referred_by: string | null
          sponsor_id: string | null
          status: string | null
          is_active: boolean
          package: string | null
          purchased_plan: string | null
          downline_count: number | null
          has_purchased: boolean | null
          country: string | null
          state: string | null
          address: string | null
          pincode: string | null
          dob: string | null
          created_at: string
          updated_at: string
          joined_at: string | null
        }
        Insert: {
          id: string
          user_id?: string | null
          student_id?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          phone_number?: string | null
          role?: string
          wallet_balance?: number
          total_earnings?: number
          referral_code?: string | null
          referred_by?: string | null
          sponsor_id?: string | null
          status?: string | null
          is_active?: boolean
          package?: string | null
          purchased_plan?: string | null
          downline_count?: number | null
          has_purchased?: boolean | null
          country?: string | null
          state?: string | null
          address?: string | null
          pincode?: string | null
          dob?: string | null
          created_at?: string
          updated_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          student_id?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          phone_number?: string | null
          role?: string
          wallet_balance?: number
          total_earnings?: number
          referral_code?: string | null
          referred_by?: string | null
          sponsor_id?: string | null
          status?: string | null
          is_active?: boolean
          package?: string | null
          purchased_plan?: string | null
          downline_count?: number | null
          has_purchased?: boolean | null
          country?: string | null
          state?: string | null
          address?: string | null
          pincode?: string | null
          dob?: string | null
          created_at?: string
          updated_at?: string
          joined_at?: string | null
        }
        Relationships: []
      }
      wallet_history: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          description: string
          income_type: string | null
          level_number: number | null
          from_user_id: string | null
          reference_id: string | null
          reference_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: string
          description: string
          income_type?: string | null
          level_number?: number | null
          from_user_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          description?: string
          income_type?: string | null
          level_number?: number | null
          from_user_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string
        }
        Relationships: []
      }
      whatsapp_tasks: {
        Row: {
          id: string
          task_title: string
          task_description: string | null
          requirements: string | null
          media_url: string | null
          task_amount: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task_title: string
          task_description?: string | null
          requirements?: string | null
          media_url?: string | null
          task_amount?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task_title?: string
          task_description?: string | null
          requirements?: string | null
          media_url?: string | null
          task_amount?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount: number
          payment_method: string | null
          payment_details: string | null
          bank_details: Json | null
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string | null
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          payment_method?: string | null
          payment_details?: string | null
          bank_details?: Json | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string | null
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          payment_method?: string | null
          payment_details?: string | null
          bank_details?: Json | null
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string | null
          processed_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          short_description: string | null
          image_url: string | null
          gallery_images: string[] | null
          mrp: number
          price: number
          cashback_amount: number
          cashback_percentage: number
          stock_quantity: number
          is_featured: boolean
          is_active: boolean
          tags: string[] | null
          specifications: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          gallery_images?: string[] | null
          mrp?: number
          price: number
          cashback_amount?: number
          cashback_percentage?: number
          stock_quantity?: number
          is_featured?: boolean
          is_active?: boolean
          tags?: string[] | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          gallery_images?: string[] | null
          mrp?: number
          price?: number
          cashback_amount?: number
          cashback_percentage?: number
          stock_quantity?: number
          is_featured?: boolean
          is_active?: boolean
          tags?: string[] | null
          specifications?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      affiliate_applications: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          address: string | null
          why_join: string | null
          experience: string | null
          status: string
          admin_notes: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          address?: string | null
          why_join?: string | null
          experience?: string | null
          status?: string
          admin_notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          why_join?: string | null
          experience?: string | null
          status?: string
          admin_notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_links: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          referral_code: string
          clicks: number
          conversions: number
          total_commission: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          referral_code: string
          clicks?: number
          conversions?: number
          total_commission?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          referral_code?: string
          clicks?: number
          conversions?: number
          total_commission?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      affiliate_clicks: {
        Row: {
          id: string
          affiliate_link_id: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          affiliate_link_id: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          clicked_at?: string
        }
        Update: {
          id?: string
          affiliate_link_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          clicked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_link_id_fkey"
            columns: ["affiliate_link_id"]
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          }
        ]
      }
      shopping_orders: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          affiliate_user_id: string | null
          quantity: number
          unit_price: number
          total_price: number
          cashback_amount: number
          affiliate_commission: number
          status: string
          payment_status: string
          shipping_address: Json | null
          tracking_number: string | null
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          affiliate_user_id?: string | null
          quantity?: number
          unit_price: number
          total_price: number
          cashback_amount?: number
          affiliate_commission?: number
          status?: string
          payment_status?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          affiliate_user_id?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          cashback_amount?: number
          affiliate_commission?: number
          status?: string
          payment_status?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_orders_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          description?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          is_shopping_enabled: boolean
          upi_id: string | null
          usdt_address: string | null
          qr_code_url: string | null
          whatsapp_number: string | null
          payment_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          is_shopping_enabled?: boolean
          upi_id?: string | null
          usdt_address?: string | null
          qr_code_url?: string | null
          whatsapp_number?: string | null
          payment_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_shopping_enabled?: boolean
          upi_id?: string | null
          usdt_address?: string | null
          qr_code_url?: string | null
          whatsapp_number?: string | null
          payment_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'moderator' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      generate_affiliate_code: {
        Args: {
          p_user_id: string
          p_product_id: string
        }
        Returns: string
      }
      create_affiliate_link: {
        Args: {
          p_user_id: string
          p_product_id: string
        }
        Returns: string
      }
      track_affiliate_click: {
        Args: {
          p_referral_code: string
          p_ip?: string
          p_user_agent?: string
        }
        Returns: void
      }
      process_affiliate_commission: {
        Args: {
          p_order_id: string
        }
        Returns: void
      }
      has_role: {
        Args: {
          _user_id: string
          _role: string
        }
        Returns: boolean
      }
      verify_email_token: {
        Args: {
          token_input: string
        }
        Returns: {
          success: boolean
          message: string
        }
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
