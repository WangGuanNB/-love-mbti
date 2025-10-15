// MBTI 16种性格类型
export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// 滑动量表的选项值（0-5，对应6个心形）
export type SliderValue = 0 | 1 | 2 | 3 | 4 | 5;

// 问题（从数据库读取后的格式）
export interface QuizQuestion {
  id: number;
  question_number: number;
  category: 'EI' | 'SN' | 'TF' | 'JP';
  locale: string;
  question_text: string;
  
  // 两端标签
  option_a_label: string; // "是"
  option_b_label: string; // "否"
  
  // 评分映射
  option_a_value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  option_b_value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  
  weight: number;
  is_active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

// 用户答案（滑动量表值：0-5）
export interface QuizAnswer {
  question_id: number;
  slider_value: SliderValue; // 0=完全A，5=完全B
}

// 性格类型描述（对应数据库结构）
export interface PersonalityType {
  id: number;
  mbti_type: MBTIType;
  locale: string;
  
  // 基本信息
  title: string;
  subtitle: string | null;
  type_code: string | null;
  
  // 核心字段（对应参考网站）
  basic_personality: string; // 基本性格
  love_characteristics: string; // 恋爱特征
  suitable_partner: string; // 适合对象
  matching_advice: string; // 匹配建议
  
  // 扩展字段（从 JSON 解析后）
  strengths?: string[];
  weaknesses?: string[];
  compatibility_best?: MBTIType[];
  compatibility_good?: MBTIType[];
  compatibility_challenging?: MBTIType[];
  famous_people?: string[];
  keywords?: string[];
  
  // 媒体
  icon_url?: string | null;
  cover_image_url?: string | null;
  
  // 状态
  is_active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

// 测试结果
export interface QuizResult {
  id: number;
  uuid: string;
  mbti_type: MBTIType;
  type_code: string | null;
  scores: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  }; // 从 JSON string 解析后
  answers: SliderValue[]; // 每道题的滑动值 [0, 2, 4, 1, ...]
  locale: string;
  share_count: number;
  view_count: number;
  created_at: Date | null;
  ip_address: string | null;
  user_uuid: string | null;
}


