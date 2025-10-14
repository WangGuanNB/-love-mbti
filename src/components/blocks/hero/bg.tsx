export default function Bg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* 响应式背景图片 - 移动端和桌面端使用不同图片 */}
      <picture>
        {/* 桌面端：768px 以上使用桌面版图片 */}
        <source 
          media="(min-width: 768px)" 
          srcSet="/imgs/features/hero-bg-desktop.jpeg" 
        />
        {/* 移动端：768px 以下使用移动版图片 */}
        <source 
          media="(max-width: 767px)" 
          srcSet="/imgs/features/hero-bg-mobile.jpeg" 
        />
        {/* 默认图片（兜底） */}
        <img
          src="/imgs/features/hero-bg-desktop.jpeg"
          alt="Love MBTI Background"
          className="w-full h-full object-cover opacity-40 object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>
      
      {/* 渐变遮罩 - 让文字更清晰可读，底部完全淡出 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 via-60% to-background" />
      
      {/* 可选：添加粉色叠加层增强恋爱氛围 */}
      <div className="absolute inset-0 bg-pink-500/5" />
    </div>
  );
}
