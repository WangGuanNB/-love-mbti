export const CODE_TO_MBTI = {
  LCRO: 'ESTP',
  LCRE: 'ESTJ',
  LCPO: 'ESFP',
  LCPE: 'ESFJ',
  LARO: 'ENTP',
  LARE: 'ENTJ',
  LAPO: 'ENFP',
  LAPE: 'ENFJ',
  FCRO: 'ISTP',
  FCRE: 'ISTJ',
  FCPO: 'ISFP',
  FCPE: 'ISFJ',
  FARO: 'INTP',
  FARE: 'INTJ',
  FAPO: 'INFP',
  FAPE: 'INFJ',
} as const;

export const MBTI_TO_CODE = Object.fromEntries(
  Object.entries(CODE_TO_MBTI).map(([code, mbti]) => [mbti, code])
) as Record<string, keyof typeof CODE_TO_MBTI>;

export const ALL_TYPE_CODES = Object.keys(CODE_TO_MBTI) as (keyof typeof CODE_TO_MBTI)[];


