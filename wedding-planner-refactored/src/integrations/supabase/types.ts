/**
 * Supabase Database 타입 정의
 * wedding_planner_dataset.sql ERD 기준 (37 tables)
 *
 * NOTE: Supabase CLI `supabase gen types` 로 재생성하면 이 파일을 덮어씁니다.
 *       수동 수정이 필요하면 src/types/database.ts 를 사용하세요.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number;
          email: string;
          password_hash: string;
          name: string;
          phone: string | null;
          region_code: string | null;
          wedding_date: string | null;
          total_budget: number | null;
          created_at: string;
        };
        Insert: {
          user_id?: number;
          email: string;
          password_hash: string;
          name: string;
          phone?: string | null;
          region_code?: string | null;
          wedding_date?: string | null;
          total_budget?: number | null;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          email?: string;
          password_hash?: string;
          name?: string;
          phone?: string | null;
          region_code?: string | null;
          wedding_date?: string | null;
          total_budget?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_budgets: {
        Row: {
          budget_id: number;
          user_id: number;
          category: string;
          target_amount: number;
          spent_amount: number;
        };
        Insert: {
          budget_id?: number;
          user_id: number;
          category: string;
          target_amount?: number;
          spent_amount?: number;
        };
        Update: {
          budget_id?: number;
          user_id?: number;
          category?: string;
          target_amount?: number;
          spent_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_ub_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      schedules: {
        Row: {
          schedule_id: number;
          user_id: number;
          title: string;
          category: string | null;
          scheduled_date: string;
          status: string;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          schedule_id?: number;
          user_id: number;
          title: string;
          category?: string | null;
          scheduled_date: string;
          status?: string;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          schedule_id?: number;
          user_id?: number;
          title?: string;
          category?: string | null;
          scheduled_date?: string;
          status?: string;
          memo?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_sch_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      diaries: {
        Row: {
          diary_id: number;
          user_id: number;
          title: string;
          content: string | null;
          diary_date: string;
          mood: string | null;
          created_at: string;
        };
        Insert: {
          diary_id?: number;
          user_id: number;
          title: string;
          content?: string | null;
          diary_date: string;
          mood?: string | null;
          created_at?: string;
        };
        Update: {
          diary_id?: number;
          user_id?: number;
          title?: string;
          content?: string | null;
          diary_date?: string;
          mood?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_diary_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      ai_planner_sessions: {
        Row: {
          session_id: number;
          user_id: number;
          conversation_log: Json;
          recommendations: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_id?: number;
          user_id: number;
          conversation_log?: Json;
          recommendations?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          session_id?: number;
          user_id?: number;
          conversation_log?: Json;
          recommendations?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_ai_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      vendors: {
        Row: {
          vendor_id: number;
          name: string;
          category_type: string;
          region: string | null;
          address: string | null;
          thumbnail_url: string | null;
          tel: string | null;
          business_hours: string | null;
          parking_location: string | null;
          parking_hours: string | null;
          sns_info: Json | null;
          keywords: string | null;
          amenities: string | null;
          avg_rating: number;
          review_count: number;
        };
        Insert: {
          vendor_id?: number;
          name: string;
          category_type: string;
          region?: string | null;
          address?: string | null;
          thumbnail_url?: string | null;
          tel?: string | null;
          business_hours?: string | null;
          parking_location?: string | null;
          parking_hours?: string | null;
          sns_info?: Json | null;
          keywords?: string | null;
          amenities?: string | null;
          avg_rating?: number;
          review_count?: number;
        };
        Update: {
          vendor_id?: number;
          name?: string;
          category_type?: string;
          region?: string | null;
          address?: string | null;
          thumbnail_url?: string | null;
          tel?: string | null;
          business_hours?: string | null;
          parking_location?: string | null;
          parking_hours?: string | null;
          sns_info?: Json | null;
          keywords?: string | null;
          amenities?: string | null;
          avg_rating?: number;
          review_count?: number;
        };
        Relationships: [];
      };
      vendor_highlights: {
        Row: {
          highlight_id: number;
          vendor_id: number;
          title: string;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          highlight_id?: number;
          vendor_id: number;
          title: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: {
          highlight_id?: number;
          vendor_id?: number;
          title?: string;
          description?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_vh_vendor";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      wedding_halls: {
        Row: {
          hall_id: number;
          meal_cost_range: string | null;
          rental_cost_range: string | null;
          meal_type: string | null;
          parking_info: string | null;
        };
        Insert: {
          hall_id: number;
          meal_cost_range?: string | null;
          rental_cost_range?: string | null;
          meal_type?: string | null;
          parking_info?: string | null;
        };
        Update: {
          hall_id?: number;
          meal_cost_range?: string | null;
          rental_cost_range?: string | null;
          meal_type?: string | null;
          parking_info?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_wh_vendor";
            columns: ["hall_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      hall_rooms: {
        Row: {
          room_id: number;
          hall_id: number;
          room_name: string;
          rental_fee: number | null;
          meal_price: number | null;
          meal_type: string | null;
          min_guest: number | null;
          time_interval: number | null;
          flower_cost: number | null;
          concierge: string | null;
          event_options: string | null;
        };
        Insert: {
          room_id?: number;
          hall_id: number;
          room_name: string;
          rental_fee?: number | null;
          meal_price?: number | null;
          meal_type?: string | null;
          min_guest?: number | null;
          time_interval?: number | null;
          flower_cost?: number | null;
          concierge?: string | null;
          event_options?: string | null;
        };
        Update: {
          room_id?: number;
          hall_id?: number;
          room_name?: string;
          rental_fee?: number | null;
          meal_price?: number | null;
          meal_type?: string | null;
          min_guest?: number | null;
          time_interval?: number | null;
          flower_cost?: number | null;
          concierge?: string | null;
          event_options?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_hr_hall";
            columns: ["hall_id"];
            referencedRelation: "wedding_halls";
            referencedColumns: ["hall_id"];
          }
        ];
      };
      sudeme_products: {
        Row: {
          product_id: number;
          vendor_id: number;
          service_type: string;
          product_name: string;
          composition: string | null;
          price: number;
        };
        Insert: {
          product_id?: number;
          vendor_id: number;
          service_type: string;
          product_name: string;
          composition?: string | null;
          price: number;
        };
        Update: {
          product_id?: number;
          vendor_id?: number;
          service_type?: string;
          product_name?: string;
          composition?: string | null;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_sp_vendor";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      products: {
        Row: {
          item_id: number;
          vendor_id: number | null;
          category_sub: string;
          name: string;
          model_no: string | null;
          price: number;
          original_price: number | null;
          delivery_period: string | null;
          as_warranty: string | null;
          specs: Json | null;
          purchase_url: string | null;
        };
        Insert: {
          item_id?: number;
          vendor_id?: number | null;
          category_sub: string;
          name: string;
          model_no?: string | null;
          price: number;
          original_price?: number | null;
          delivery_period?: string | null;
          as_warranty?: string | null;
          specs?: Json | null;
          purchase_url?: string | null;
        };
        Update: {
          item_id?: number;
          vendor_id?: number | null;
          category_sub?: string;
          name?: string;
          model_no?: string | null;
          price?: number;
          original_price?: number | null;
          delivery_period?: string | null;
          as_warranty?: string | null;
          specs?: Json | null;
          purchase_url?: string | null;
        };
        Relationships: [];
      };
      product_options: {
        Row: {
          option_id: number;
          item_id: number;
          option_name: string;
          features: string | null;
          extra_price: number;
          sort_order: number;
        };
        Insert: {
          option_id?: number;
          item_id: number;
          option_name: string;
          features?: string | null;
          extra_price?: number;
          sort_order?: number;
        };
        Update: {
          option_id?: number;
          item_id?: number;
          option_name?: string;
          features?: string | null;
          extra_price?: number;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_po_item";
            columns: ["item_id"];
            referencedRelation: "products";
            referencedColumns: ["item_id"];
          }
        ];
      };
      honeymoon_packages: {
        Row: {
          package_id: number;
          vendor_id: number;
          destination: string;
          visit_cities: string | null;
          title: string;
          duration: string | null;
          price: number;
          detail_url: string | null;
          kakao_channel: string | null;
          inclusions: string | null;
        };
        Insert: {
          package_id?: number;
          vendor_id: number;
          destination: string;
          visit_cities?: string | null;
          title: string;
          duration?: string | null;
          price: number;
          detail_url?: string | null;
          kakao_channel?: string | null;
          inclusions?: string | null;
        };
        Update: {
          package_id?: number;
          vendor_id?: number;
          destination?: string;
          visit_cities?: string | null;
          title?: string;
          duration?: string | null;
          price?: number;
          detail_url?: string | null;
          kakao_channel?: string | null;
          inclusions?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_hp_vendor";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      restaurants: {
        Row: {
          restaurant_id: number;
          cuisine_genre: string | null;
          price_per_person: number | null;
          best_menu: string | null;
          signature_menu: string | null;
        };
        Insert: {
          restaurant_id: number;
          cuisine_genre?: string | null;
          price_per_person?: number | null;
          best_menu?: string | null;
          signature_menu?: string | null;
        };
        Update: {
          restaurant_id?: number;
          cuisine_genre?: string | null;
          price_per_person?: number | null;
          best_menu?: string | null;
          signature_menu?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_rest_vendor";
            columns: ["restaurant_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      brands: {
        Row: {
          brand_id: number;
          brand_name: string;
          country: string | null;
          sns_info: Json | null;
          homepage_url: string | null;
          customer_service: string | null;
        };
        Insert: {
          brand_id?: number;
          brand_name: string;
          country?: string | null;
          sns_info?: Json | null;
          homepage_url?: string | null;
          customer_service?: string | null;
        };
        Update: {
          brand_id?: number;
          brand_name?: string;
          country?: string | null;
          sns_info?: Json | null;
          homepage_url?: string | null;
          customer_service?: string | null;
        };
        Relationships: [];
      };
      shopping_products: {
        Row: {
          shopping_product_id: number;
          brand_id: number;
          product_name: string;
          discount_rate: number;
          price: number;
          original_price: number | null;
          keywords: string | null;
          rating: number;
          review_count: number;
          sales_count: number;
          thumbnail_url: string | null;
          detail_url: string | null;
          cautions: string | null;
        };
        Insert: {
          shopping_product_id?: number;
          brand_id: number;
          product_name: string;
          discount_rate?: number;
          price: number;
          original_price?: number | null;
          keywords?: string | null;
          rating?: number;
          review_count?: number;
          sales_count?: number;
          thumbnail_url?: string | null;
          detail_url?: string | null;
          cautions?: string | null;
        };
        Update: {
          shopping_product_id?: number;
          brand_id?: number;
          product_name?: string;
          discount_rate?: number;
          price?: number;
          original_price?: number | null;
          keywords?: string | null;
          rating?: number;
          review_count?: number;
          sales_count?: number;
          thumbnail_url?: string | null;
          detail_url?: string | null;
          cautions?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_shp_brand";
            columns: ["brand_id"];
            referencedRelation: "brands";
            referencedColumns: ["brand_id"];
          }
        ];
      };
      contents: {
        Row: {
          content_id: number;
          type: string;
          title: string;
          body_url: string | null;
          view_count: number;
          created_at: string;
        };
        Insert: {
          content_id?: number;
          type: string;
          title: string;
          body_url?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          content_id?: number;
          type?: string;
          title?: string;
          body_url?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          event_id: number;
          vendor_id: number | null;
          category: string | null;
          title: string;
          vendor_name: string | null;
          benefit_detail: string | null;
          description: string | null;
          conditions: string | null;
          cautions: string | null;
          start_date: string | null;
          end_date: string | null;
          status: string;
          view_count: number;
        };
        Insert: {
          event_id?: number;
          vendor_id?: number | null;
          category?: string | null;
          title: string;
          vendor_name?: string | null;
          benefit_detail?: string | null;
          description?: string | null;
          conditions?: string | null;
          cautions?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          view_count?: number;
        };
        Update: {
          event_id?: number;
          vendor_id?: number | null;
          category?: string | null;
          title?: string;
          vendor_name?: string | null;
          benefit_detail?: string | null;
          description?: string | null;
          conditions?: string | null;
          cautions?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          view_count?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          post_id: number;
          user_id: number;
          category: string;
          title: string;
          content: string | null;
          view_count: number;
          like_count: number;
          created_at: string;
        };
        Insert: {
          post_id?: number;
          user_id: number;
          category: string;
          title: string;
          content?: string | null;
          view_count?: number;
          like_count?: number;
          created_at?: string;
        };
        Update: {
          post_id?: number;
          user_id?: number;
          category?: string;
          title?: string;
          content?: string | null;
          view_count?: number;
          like_count?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_post_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      reviews: {
        Row: {
          review_id: number;
          target_type: string;
          target_id: number;
          user_id: number;
          rating: number;
          content: string | null;
          ai_summary: string | null;
          created_at: string;
        };
        Insert: {
          review_id?: number;
          target_type: string;
          target_id: number;
          user_id: number;
          rating: number;
          content?: string | null;
          ai_summary?: string | null;
          created_at?: string;
        };
        Update: {
          review_id?: number;
          target_type?: string;
          target_id?: number;
          user_id?: number;
          rating?: number;
          content?: string | null;
          ai_summary?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_rev_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      images: {
        Row: {
          image_id: number;
          ref_type: string;
          ref_id: number;
          image_url: string;
          sort_order: number;
        };
        Insert: {
          image_id?: number;
          ref_type: string;
          ref_id: number;
          image_url: string;
          sort_order?: number;
        };
        Update: {
          image_id?: number;
          ref_type?: string;
          ref_id?: number;
          image_url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          reservation_id: number;
          user_id: number;
          vendor_id: number;
          preferred_date: string | null;
          status: string;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          reservation_id?: number;
          user_id: number;
          vendor_id: number;
          preferred_date?: string | null;
          status?: string;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          reservation_id?: number;
          user_id?: number;
          vendor_id?: number;
          preferred_date?: string | null;
          status?: string;
          memo?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_res_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "fk_res_vendor";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["vendor_id"];
          }
        ];
      };
      user_actions: {
        Row: {
          user_id: number;
          target_type: string;
          target_id: number;
          created_at: string;
        };
        Insert: {
          user_id: number;
          target_type: string;
          target_id: number;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          target_type?: string;
          target_id?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_ua_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      cart: {
        Row: {
          cart_id: number;
          user_id: number;
          product_type: string;
          product_id: number;
          option_id: number | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          cart_id?: number;
          user_id: number;
          product_type: string;
          product_id: number;
          option_id?: number | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          cart_id?: number;
          user_id?: number;
          product_type?: string;
          product_id?: number;
          option_id?: number | null;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_cart_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      orders: {
        Row: {
          order_id: number;
          user_id: number;
          order_number: string;
          total_amount: number;
          delivery_address: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          order_id?: number;
          user_id: number;
          order_number: string;
          total_amount: number;
          delivery_address?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          order_id?: number;
          user_id?: number;
          order_number?: string;
          total_amount?: number;
          delivery_address?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_ord_user";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      order_items: {
        Row: {
          order_item_id: number;
          order_id: number;
          product_type: string;
          product_id: number;
          option_id: number | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Insert: {
          order_item_id?: number;
          order_id: number;
          product_type: string;
          product_id: number;
          option_id?: number | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Update: {
          order_item_id?: number;
          order_id?: number;
          product_type?: string;
          product_id?: number;
          option_id?: number | null;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_oi_order";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["order_id"];
          }
        ];
      };
      faq: {
        Row: {
          faq_id: number;
          category: string;
          question: string;
          answer: string;
          sort_order: number;
          view_count: number;
        };
        Insert: {
          faq_id?: number;
          category: string;
          question: string;
          answer: string;
          sort_order?: number;
          view_count?: number;
        };
        Update: {
          faq_id?: number;
          category?: string;
          question?: string;
          answer?: string;
          sort_order?: number;
          view_count?: number;
        };
        Relationships: [];
      };
      chatbot_conversations: {
        Row: {
          conversation_id: number;
          user_id: number | null;
          session_id: string;
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          conversation_id?: number;
          user_id?: number | null;
          session_id: string;
          messages: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          conversation_id?: number;
          user_id?: number | null;
          session_id?: string;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
