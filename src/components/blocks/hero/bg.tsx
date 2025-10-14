export default function Bg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* 背景图片 */}
      <img
        src="/imgs/features/hero-bg-desktop.jpeg"
        alt="Love MBTI Background"
        className="w-full h-full object-cover opacity-40 object-center"
        loading="eager"
        fetchPriority="high"
      />
      
      {/* 渐变遮罩 - 让文字更清晰可读，底部完全淡出 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 via-60% to-background" />
      
      {/* 可选：添加粉色叠加层增强恋爱氛围 */}
      <div className="absolute inset-0 bg-pink-500/5" />
    </div>
  );
}
