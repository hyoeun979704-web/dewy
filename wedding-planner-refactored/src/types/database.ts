// =====================================================
// 웨딩 플래너 ERD 기반 TypeScript 타입 정의
// 모든 타입은 wedding_planner_dataset.sql ERD 컬럼명 기준
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── 1. 사용자 및 인증 ───────────────────────────────

export interface User {
  user_id: number;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  region_code: string | null;
  wedding_date: string | null;
  total_budget: number | null;
  created_at: string;
}

export interface UserBudget {
  budget_id: number;
  user_id: number;
  category: string; // '웨딩홀'|'스드메'|'혼수'|'예물'|'예복'|'허니문'|'기타'
  target_amount: number;
  spent_amount: number;
}

export interface Schedule {
  schedule_id: number;
  user_id: number;
  title: string;
  category: string | null;
  scheduled_date: string;
  status: string; // '예정'|'완료'|'취소'
  memo: string | null;
  created_at: string;
}

export interface Diary {
  diary_id: number;
  user_id: number;
  title: string;
  content: string | null;
  diary_date: string;
  mood: string | null; // '행복'|'설렘'|'걱정'|'피곤'|'기대'
  created_at: string;
}

export interface AIPlannerSession {
  session_id: number;
  user_id: number;
  conversation_log: Json;
  recommendations: Json;
  created_at: string;
  updated_at: string;
}

// ─── 2. 핵심 웨딩 서비스 (Vendors 슈퍼타입) ─────────

export type VendorCategoryType =
  | '웨딩홀'
  | '스튜디오'
  | '드레스'
  | '메이크업'
  | '예물'
  | '한복'
  | '예복'
  | '허니문'
  | '식당';

export interface Vendor {
  vendor_id: number;
  name: string;
  category_type: VendorCategoryType;
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
}

export interface VendorHighlight {
  highlight_id: number;
  vendor_id: number;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface WeddingHall {
  hall_id: number;
  meal_cost_range: string | null;
  rental_cost_range: string | null;
  meal_type: string | null;
  parking_info: string | null;
}

export interface HallRoom {
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
}

export interface SudemeProduct {
  product_id: number;
  vendor_id: number;
  service_type: string; // '드레스'|'스튜디오'|'메이크업'|'스드메'|'드메'|'토탈스튜디오'
  product_name: string;
  composition: string | null;
  price: number;
}

export interface DressDetail {
  dress_detail_id: number;
  product_id: number;
  button_name: string;
  basic_composition: string | null;
  upgrade_cost: Json | null;
  additional_options: Json | null;
  accessories: string | null;
  sort_order: number;
}

export interface StudioDetail {
  studio_detail_id: number;
  product_id: number;
  concept_name: string;
  basic_composition: string | null;
  props: string | null;
  upgrade_options: Json | null;
  additional_options: Json | null;
  dress_rental: string | null;
  makeup: string | null;
  sort_order: number;
}

export interface MakeupDetail {
  makeup_detail_id: number;
  product_id: number;
  service_name: string;
  basic_composition: string | null;
  labor_cost_extra: Json | null;
  makeup_extra: Json | null;
  service_extra: Json | null;
  sort_order: number;
}

export interface PackageConnection {
  connection_id: number;
  package_product_id: number;
  connected_vendor_id: number;
  connection_type: string; // 'STUDIO'|'DRESS'|'MAKEUP'
  cautions: string | null;
}

// ─── 3. 상품 (혼수/예물/예복) ────────────────────────

export interface Product {
  item_id: number;
  vendor_id: number | null;
  category_sub: string; // '가전'|'가구'|'예물'|'한복'|'예복'
  name: string;
  model_no: string | null;
  price: number;
  original_price: number | null;
  delivery_period: string | null;
  as_warranty: string | null;
  specs: Json | null;
  purchase_url: string | null;
}

export interface ProductOption {
  option_id: number;
  item_id: number;
  option_name: string;
  features: string | null;
  extra_price: number;
  sort_order: number;
}

export interface FormalWear {
  formal_wear_id: number;
  item_id: number;
  composition_name: string;
  custom_price: number | null;
  rental_price: number | null;
  composition: string | null;
  fabric_option1: string | null;
  fabric1_price: number | null;
  fabric_option2: string | null;
  fabric2_price: number | null;
  additional_options: Json | null;
}

export interface HanbokItem {
  hanbok_id: number;
  item_id: number;
  composition_name: string;
  custom_price: number | null;
  rental_price: number | null;
  composition: string | null;
  fabric_option1: string | null;
  fabric1_price: number | null;
  fabric_option2: string | null;
  fabric2_price: number | null;
  additional_options: Json | null;
}

export interface JewelryGift {
  jewelry_id: number;
  vendor_id: number;
  product_name: string;
  main_product1: string | null;
  main_product1_price: number | null;
  main_product2: string | null;
  main_product2_price: number | null;
  composition_price: Json | null;
  production_period: string | null;
  delivery_period: string | null;
  as_info: string | null;
}

// ─── 4. 허니문 ───────────────────────────────────────

export interface HoneymoonPackage {
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
}

export interface HoneymoonSchedule {
  schedule_id: number;
  package_id: number;
  schedule_name: string;
  schedule_summary: string | null;
  transportation: string | null;
  accommodation: string | null;
  additional_options: Json | null;
  avg_extra_cost: number | null;
  cautions: string | null;
  sort_order: number;
}

// ─── 5. 식당 ─────────────────────────────────────────

export interface Restaurant {
  restaurant_id: number;
  cuisine_genre: string | null;
  price_per_person: number | null;
  best_menu: string | null;
  signature_menu: string | null;
}

export interface RestaurantMenu {
  menu_id: number;
  restaurant_id: number;
  menu_category: string | null;
  menu_name: string;
  price: number | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

// ─── 6. 쇼핑 브랜드/상품 ────────────────────────────

export interface Brand {
  brand_id: number;
  brand_name: string;
  country: string | null;
  sns_info: Json | null;
  homepage_url: string | null;
  customer_service: string | null;
}

export interface ShoppingProduct {
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
}

// ─── 7. 콘텐츠/이벤트/커뮤니티 ──────────────────────

export interface Content {
  content_id: number;
  type: string; // '블로그'|'숏폼'|'롱폼'
  title: string;
  body_url: string | null;
  view_count: number;
  created_at: string;
}

export interface Event {
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
  status: string; // '진행중'|'종료'
  view_count: number;
}

export interface Post {
  post_id: number;
  user_id: number;
  category: string; // '자유'|'후기'|'질문'|'정보공유'
  title: string;
  content: string | null;
  view_count: number;
  like_count: number;
  created_at: string;
}

// ─── 8. 리뷰/이미지 ─────────────────────────────────

export interface Review {
  review_id: number;
  target_type: string; // 'VENDOR'|'PRODUCT'
  target_id: number;
  user_id: number;
  rating: number;
  content: string | null;
  ai_summary: string | null;
  created_at: string;
}

export type ImageRefType = 'VENDOR' | 'REVIEW' | 'POST' | 'PRODUCT' | 'EVENT' | 'CONTENT';

export interface ImageRecord {
  image_id: number;
  ref_type: ImageRefType;
  ref_id: number;
  image_url: string;
  sort_order: number;
}

// ─── 9. 예약/찜/좋아요 ──────────────────────────────

export interface Reservation {
  reservation_id: number;
  user_id: number;
  vendor_id: number;
  preferred_date: string | null;
  status: string; // '신청'|'확정'|'취소'
  memo: string | null;
  created_at: string;
}

export type UserActionTargetType = 'VENDOR' | 'PRODUCT' | 'POST' | 'EVENT' | 'SHOPPING';

export interface UserAction {
  user_id: number;
  target_type: UserActionTargetType;
  target_id: number;
  created_at: string;
}

// ─── 10. 장바구니/주문 ──────────────────────────────

export interface CartItem {
  cart_id: number;
  user_id: number;
  product_type: string; // 'SHOPPING'|'TROUSSEAU'
  product_id: number;
  option_id: number | null;
  quantity: number;
  created_at: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  delivery_address: string | null;
  status: string; // '주문완료'|'배송준비'|'배송중'|'배송완료'|'취소'
  created_at: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_type: string; // 'SHOPPING'|'TROUSSEAU'
  product_id: number;
  option_id: number | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// ─── 11. FAQ / ChatBot ──────────────────────────────

export interface FAQ {
  faq_id: number;
  category: string; // '예약'|'결제'|'환불'|'서비스이용'|'계정'|'배송'
  question: string;
  answer: string;
  sort_order: number;
  view_count: number;
}

export interface ChatBotConversation {
  conversation_id: number;
  user_id: number | null;
  session_id: string;
  messages: Json;
  created_at: string;
  updated_at: string;
}

// ─── 공통 유틸리티 타입 ──────────────────────────────

/** Vendor + 관련 이미지 목록 (목록 페이지용) */
export interface VendorWithImages extends Vendor {
  images?: ImageRecord[];
}

/** Vendor + WeddingHall 확장 (웨딩홀 상세용) */
export interface VendorWithHallDetail extends Vendor {
  wedding_hall?: WeddingHall;
  hall_rooms?: HallRoom[];
  highlights?: VendorHighlight[];
  images?: ImageRecord[];
  reviews?: Review[];
}

/** Vendor + Honeymoon 확장 */
export interface VendorWithHoneymoonDetail extends Vendor {
  honeymoon_packages?: HoneymoonPackage[];
  images?: ImageRecord[];
}

/** Vendor + Restaurant 확장 */
export interface VendorWithRestaurantDetail extends Vendor {
  restaurant?: Restaurant;
  restaurant_menus?: RestaurantMenu[];
  images?: ImageRecord[];
}

/** 카테고리 필터 매핑 */
export const VENDOR_CATEGORY_MAP = {
  venues: '웨딩홀' as VendorCategoryType,
  studios: '스튜디오' as VendorCategoryType,
  dress: '드레스' as VendorCategoryType,
  makeup: '메이크업' as VendorCategoryType,
  jewelry: '예물' as VendorCategoryType,
  hanbok: '한복' as VendorCategoryType,
  suits: '예복' as VendorCategoryType,
  honeymoon: '허니문' as VendorCategoryType,
  restaurants: '식당' as VendorCategoryType,
} as const;

export type PageCategoryKey = keyof typeof VENDOR_CATEGORY_MAP;
