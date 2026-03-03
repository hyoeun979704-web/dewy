# 웨딩 플래너 리팩터링 가이드

## 1. 페이지 → ERD 테이블 매핑표

| 페이지 (기존) | 기존 Supabase 테이블 | 신규 ERD 테이블 | 비고 |
|---|---|---|---|
| **Venues.tsx** | `venues` | `vendors` (category_type='웨딩홀') | 통합 vendors 슈퍼타입 |
| **VenueDetail.tsx** | `venues` + `venue_halls` + `venue_special_points` | `vendors` + `wedding_halls` + `hall_rooms` + `vendor_highlights` + `images` + `reviews` | 1:1 확장 테이블 |
| **Studios.tsx** | `studios` | `vendors` (category_type='스튜디오') | |
| **StudioDetail.tsx** | `studios` | `vendors` + `sudeme_products` + `studio_details` + `images` + `reviews` | |
| **Honeymoon.tsx** | `honeymoon` | `vendors` (category_type='허니문') | |
| **HoneymoonDetail.tsx** | `honeymoon` | `vendors` + `honeymoon_packages` + `honeymoon_schedules` + `images` | |
| **HoneymoonGifts.tsx** | `honeymoon_gifts` | `shopping_products` + `brands` | vendors가 아닌 쇼핑상품 |
| **Appliances.tsx** | `appliances` | `shopping_products` + `brands` | 가전 카테고리 |
| **Suit.tsx** | `suits` | `vendors` (category_type='예복') | |
| **SuitDetail.tsx** | `suits` | `vendors` + `products` (category_sub='예복') + `formal_wear` + `images` | |
| **Hanbok.tsx** | `hanbok` | `vendors` (category_type='한복') | |
| **HanbokDetail.tsx** | `hanbok` | `vendors` + `products` (category_sub='한복') + `hanbok` + `images` | |
| **InvitationVenues.tsx** | `invitation_venues` | `vendors` (category_type='식당') | |
| **InvitationVenueDetail.tsx** | `invitation_venues` | `vendors` + `restaurants` + `restaurant_menus` + `images` | |
| **Community.tsx** | `community_posts` | `posts` + `images` (ref_type='POST') | |
| **CommunityPostDetail.tsx** | `community_posts` + `community_comments` + `community_likes` | `posts` + `images` + `user_actions` (target_type='POST') | 댓글 테이블 ERD 미포함 |
| **Favorites.tsx** | `favorites` | `user_actions` | 복합 PK 방식 |
| **Budget.tsx** | `budget_settings` + `budget_items` | `users.total_budget` + `user_budgets` | 구조 변경 |
| **Schedule.tsx** | `user_schedule_items` + `user_wedding_settings` | `schedules` + `users` | |
| **CoupleDiary.tsx** | `couple_diary` + `couple_diary_photos` | `diaries` + `images` (ref_type='DIARY') | |
| **Deals.tsx** | `partner_deals` + `deal_claims` | `events` + `user_actions` (target_type='EVENT') | |
| **Store.tsx** | `products` | `shopping_products` | |
| **Cart.tsx** | `cart_items` + `products` | `cart` + `shopping_products` | |
| **Orders.tsx** | `orders` + `order_items` | `orders` + `order_items` | 유사 구조 |
| **FAQ.tsx** | (하드코딩) | `faq` | |
| **AIPlanner.tsx** | Edge Function | `ai_planner_sessions` + Edge Function | |
| **Magazine.tsx** | (하드코딩) | `contents` | |
| **Reviews.tsx** | (venues 내장) | `reviews` + `images` (ref_type='REVIEW') | 통합 리뷰 |
| **Auth.tsx** | Supabase Auth | Supabase Auth + `users` | |
| **Profile.tsx** | `profiles` + `user_wedding_settings` | `users` | 통합 |
| **MyPage.tsx** | `profiles` | `users` | |
| **Influencers.tsx** | `influencers` | ERD 미포함 (TODO) | `contents` 활용 검토 |

## 2. 핵심 아키텍처 변경 요약

### 2.1 Vendors 슈퍼타입 패턴
- **이전**: 카테고리마다 별도 테이블 (venues, studios, honeymoon, suits, hanbok, invitation_venues)
- **이후**: 단일 `vendors` 테이블 + `category_type` 필드로 구분
- **서브타입 확장**: `wedding_halls`, `restaurants` 등 1:1 관계 테이블로 상세 정보 저장

### 2.2 ID 타입 변경
- **이전**: UUID string (`id: string`)
- **이후**: BIGINT auto-increment (`vendor_id: number`)
- **영향**: 모든 `useParams()` 에서 `parseInt()` 변환 필요

### 2.3 찜/좋아요 통합
- **이전**: `favorites` 테이블 (item_id + item_type)
- **이후**: `user_actions` 테이블 (복합 PK: user_id + target_type + target_id)
- **target_type**: 'VENDOR' | 'PRODUCT' | 'POST' | 'EVENT' | 'SHOPPING'

### 2.4 이미지 통합
- **이전**: 각 테이블에 thumbnail_url, images[] 직접 저장
- **이후**: 통합 `images` 테이블 (ref_type + ref_id 로 참조)
- **ref_type**: 'VENDOR' | 'REVIEW' | 'POST' | 'PRODUCT' | 'EVENT' | 'CONTENT'

### 2.5 리뷰 통합
- **이전**: 각 venue/studio 에 개별 리뷰 없음 (리뷰 수만 있음)
- **이후**: 통합 `reviews` 테이블 (target_type + target_id)

## 3. ERD에 없는 기존 기능 (TODO 목록)

| 기능 | 기존 테이블 | 대응 방안 |
|---|---|---|
| 커플 연결 | `couple_links` | 신규 테이블 추가 필요 |
| 커플 투표 | `couple_votes` | 신규 테이블 추가 필요 |
| 인플루언서 | `influencers`, `influencer_contents` | `contents` 테이블 활용 또는 신규 추가 |
| 구독/프리미엄 | `subscriptions` | 신규 테이블 추가 필요 |
| AI 일일 사용량 | `ai_usage_daily` | 신규 테이블 추가 필요 |
| 커뮤니티 댓글 | `community_comments`, `community_comment_likes` | 신규 테이블 추가 필요 |
| 커뮤니티 북마크 | `favorites` (item_type='community_post') | `user_actions` (target_type='POST') |
| 결제/결제수단 | `payments` | 신규 테이블 추가 필요 |

## 4. 리팩터링된 파일 목록

### 완성 파일 (이 패키지에 포함)
```
src/
├── types/database.ts              ← 전체 ERD 타입 정의 (NEW)
├── integrations/supabase/
│   ├── types.ts                   ← Supabase Database 타입 (전면 교체)
│   └── client.ts                  ← 클라이언트 (소폭 변경)
├── lib/
│   └── vendorQueries.ts           ← 공통 Vendor 조회 함수 (NEW)
├── hooks/
│   ├── useCategoryData.ts         ← 카테고리 목록 (전면 교체)
│   ├── useVenues.ts               ← 웨딩홀 (전면 교체)
│   ├── useVenueDetails.ts         ← 웨딩홀 상세 (전면 교체)
│   ├── useFavorites.ts            ← 찜하기 (전면 교체 → user_actions)
│   ├── useBudget.ts               ← 예산 (전면 교체 → user_budgets)
│   ├── useWeddingSchedule.ts      ← 일정 (전면 교체 → schedules)
│   ├── useCoupleDiary.ts          ← 다이어리 (전면 교체 → diaries)
│   ├── useCart.ts                 ← 장바구니 (전면 교체 → cart)
│   ├── usePartnerDeals.ts         ← 혜택 (전면 교체 → events)
│   ├── useRecommendedItems.ts     ← 추천 (전면 교체)
│   ├── useDefaultRegion.ts        ← 기본 지역 (users.region_code)
│   ├── useCoupleLink.ts           ← 커플 연결 (TODO stub)
│   ├── useInfluencers.ts          ← 인플루언서 (TODO stub)
│   ├── useCommentLikes.ts         ← 댓글 좋아요 (TODO stub)
│   └── useSubscription.ts         ← 구독 (TODO stub)
├── stores/                        ← 변경 없음
├── data/budgetData.ts             ← 변경 없음
└── contexts/AuthContext.tsx        ← 변경 없음
```

### 페이지/컴포넌트 변경 가이드 (다음 단계)
각 페이지에서 필요한 변경:
1. `id` (string) → `vendor_id` (number) 등 ID 필드명 변경
2. `is_partner` → 삭제 (ERD에 없음, keywords로 대체 가능)
3. `address` → `vendors.address` 또는 `vendors.region`
4. `rating` → `vendors.avg_rating`
5. `review_count` → `vendors.review_count`
6. `thumbnail_url` → `vendors.thumbnail_url` 또는 `images` 테이블
7. 배열 필드 (hall_types, meal_options 등) → `keywords` 문자열 또는 서브테이블
