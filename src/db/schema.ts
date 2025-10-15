import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable(
  "users_love",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull(),
    created_at: timestamp({ withTimezone: true }),
    nickname: varchar({ length: 255 }),
    avatar_url: varchar({ length: 255 }),
    locale: varchar({ length: 50 }),
    signin_type: varchar({ length: 50 }),
    signin_ip: varchar({ length: 255 }),
    signin_provider: varchar({ length: 50 }),
    signin_openid: varchar({ length: 255 }),
    invite_code: varchar({ length: 255 }).notNull().default(""),
    updated_at: timestamp({ withTimezone: true }),
    invited_by: varchar({ length: 255 }).notNull().default(""),
    is_affiliate: boolean().notNull().default(false),
  },
  (table) => [
    uniqueIndex("email_love_provider_unique_idx").on(
      table.email,
      table.signin_provider
    ),
  ]
);

// Orders table
export const orders = pgTable("orders_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_no: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp({ withTimezone: true }),
  user_uuid: varchar({ length: 255 }).notNull().default(""),
  user_email: varchar({ length: 255 }).notNull().default(""),
  amount: integer().notNull(),
  interval: varchar({ length: 50 }),
  expired_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }).notNull(),
  stripe_session_id: varchar({ length: 255 }),
  credits: integer().notNull(),
  currency: varchar({ length: 50 }),
  sub_id: varchar({ length: 255 }),
  sub_interval_count: integer(),
  sub_cycle_anchor: integer(),
  sub_period_end: integer(),
  sub_period_start: integer(),
  sub_times: integer(),
  product_id: varchar({ length: 255 }),
  product_name: varchar({ length: 255 }),
  valid_months: integer(),
  order_detail: text(),
  paid_at: timestamp({ withTimezone: true }),
  paid_email: varchar({ length: 255 }),
  paid_detail: text(),
});

// API Keys table
export const apikeys = pgTable("apikeys_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  api_key: varchar({ length: 255 }).notNull().unique(),
  title: varchar({ length: 100 }),
  user_uuid: varchar({ length: 255 }).notNull(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
});

// Credits table
export const credits = pgTable("credits_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  trans_no: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp({ withTimezone: true }),
  user_uuid: varchar({ length: 255 }).notNull(),
  trans_type: varchar({ length: 50 }).notNull(),
  credits: integer().notNull(),
  order_no: varchar({ length: 255 }),
  expired_at: timestamp({ withTimezone: true }),
});

// Posts table
export const posts = pgTable("posts_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: varchar({ length: 255 }).notNull().unique(),
  slug: varchar({ length: 255 }),
  title: varchar({ length: 255 }),
  description: text(),
  content: text(),
  created_at: timestamp({ withTimezone: true }),
  updated_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
  cover_url: varchar({ length: 255 }),
  author_name: varchar({ length: 255 }),
  author_avatar_url: varchar({ length: 255 }),
  locale: varchar({ length: 50 }),
});

// Affiliates table
export const affiliates = pgTable("affiliates_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_uuid: varchar({ length: 255 }).notNull(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }).notNull().default(""),
  invited_by: varchar({ length: 255 }).notNull(),
  paid_order_no: varchar({ length: 255 }).notNull().default(""),
  paid_amount: integer().notNull().default(0),
  reward_percent: integer().notNull().default(0),
  reward_amount: integer().notNull().default(0),
});

// Feedbacks table
export const feedbacks = pgTable("feedbacks_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp({ withTimezone: true }),
  status: varchar({ length: 50 }),
  user_uuid: varchar({ length: 255 }),
  content: text(),
  rating: integer(),
});

// Quiz Questions table (题目表) - 滑动量表式
export const quizQuestions = pgTable(
  "quiz_questions_love",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    question_number: integer().notNull(), // 题号 1-20
    category: varchar({ length: 2 }).notNull(), // EI, SN, TF, JP
    locale: varchar({ length: 50 }).notNull(), // ja, en, zh, pt, ms
    question_text: text().notNull(), // 题目陈述："我偏好比自己更成熟的人"
    option_a_label: varchar({ length: 50 }).notNull(), // 左端标签："是"
    option_b_label: varchar({ length: 50 }).notNull(), // 右端标签："否"
    option_a_value: varchar({ length: 1 }).notNull(), // 'E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'
    option_b_value: varchar({ length: 1 }).notNull(), // 对应的另一端值
    weight: integer().notNull().default(1), // 权重
    is_active: boolean().notNull().default(true),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("question_number_locale_unique_idx").on(
      table.question_number,
      table.locale
    ),
  ]
);

// Personality Types table (性格类型表) - 每个语言一条记录
export const personalityTypes = pgTable(
  "personality_types_love",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    mbti_type: varchar({ length: 4 }).notNull(), // ENFP, INTJ, etc.
    locale: varchar({ length: 50 }).notNull(), // ja, en, zh, pt, ms
    title: varchar({ length: 255 }).notNull(), // "ENFP - 浪漫冒险家"
    subtitle: varchar({ length: 255 }), // 副标题
    type_code: varchar({ length: 10 }), // 类型代码，如 "LARE"
    basic_personality: text().notNull(), // 基本性格
    love_characteristics: text().notNull(), // 恋爱特征
    suitable_partner: text().notNull(), // 适合对象
    matching_advice: text().notNull(), // 匹配建议
    strengths: text(), // JSON string: ["优势1", "优势2"]
    weaknesses: text(), // JSON string: ["注意点1", "注意点2"]
    compatibility_best: text(), // JSON string: ["INTJ", "INFJ"]
    compatibility_good: text(), // JSON string: ["ENFJ", "ENTP"]
    compatibility_challenging: text(), // JSON string: ["ISTJ", "ESTJ"]
    famous_people: text(), // JSON string: ["名人1", "名人2"]
    keywords: text(), // JSON string: ["关键词1", "关键词2"]
    icon_url: varchar({ length: 255 }), // 类型图标URL
    cover_image_url: varchar({ length: 255 }), // 封面图片URL
    is_active: boolean().notNull().default(true),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("mbti_type_locale_unique_idx").on(
      table.mbti_type,
      table.locale
    ),
  ]
);

// Quiz Results table (测试结果表)
export const quizResults = pgTable("quiz_results_love", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uuid: varchar({ length: 255 }).notNull().unique(),
  mbti_type: varchar({ length: 4 }).notNull(), // ENFP, INTJ, etc.
  type_code: varchar({ length: 10 }), // LARE, 等
  scores: text().notNull(), // JSON string: { EI: 10, SN: -5, TF: 15, JP: -8 }
  answers: text().notNull(), // JSON string: [0, 1, 0, 1, ...]
  locale: varchar({ length: 50 }).notNull(), // 用户测试时的语言
  share_count: integer().notNull().default(0),
  view_count: integer().notNull().default(0),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  ip_address: varchar({ length: 255 }),
  user_uuid: varchar({ length: 255 }), // 关联到用户（可选）
});