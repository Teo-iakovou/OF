type BrandIconProps = {
  size?: number;
  className?: string;
  variant?: "mono" | "color";
};

export function InstagramIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#ffd600" />
            <stop offset="30%" stopColor="#ff6930" />
            <stop offset="60%" stopColor="#e3198c" />
            <stop offset="100%" stopColor="#7f37c9" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
        <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        {/* cyan shadow offset */}
        <path d="M10.5 3.5h3c0 2.5 2 4 4 4.3v3c-1.4-.1-2.7-.6-3.75-1.4V14c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.35 0 .7.03 1.03.08V11.2c-.33-.08-.67-.12-1.03-.12-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V3.5z" fill="#25F4EE" transform="translate(-0.5, 0)" />
        {/* red main shape */}
        <path d="M10.5 3.5h3c0 2.5 2 4 4 4.3v3c-1.4-.1-2.7-.6-3.75-1.4V14c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.35 0 .7.03 1.03.08V11.2c-.33-.08-.67-.12-1.03-.12-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V3.5z" fill="#FE2C55" transform="translate(0.5, 0)" />
        {/* white overlay */}
        <path d="M10.5 3.5h3c0 2.5 2 4 4 4.3v3c-1.4-.1-2.7-.6-3.75-1.4V14c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.35 0 .7.03 1.03.08V11.2c-.33-.08-.67-.12-1.03-.12-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V3.5z" fill="white" />
        {/* top-right music note flag */}
        <path d="M17.5 7.8v3c-1.4-.1-2.7-.6-3.75-1.4" fill="none" stroke="#25F4EE" strokeWidth="0" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M10.5 3.5h3c0 2.5 2 4 4 4.3v3c-1.4-.1-2.7-.6-3.75-1.4V14c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.35 0 .7.03 1.03.08V11.2c-.33-.08-.67-.12-1.03-.12-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3V3.5z" />
    </svg>
  );
}

export function XIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="black" />
        <path d="M18 4.5 13.2 10.2 18.8 19.5H14.8L11.4 13.8 6.8 19.5H4L9.1 13.4 3.8 4.5H7.9L11 9.9 15.2 4.5H18Z" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18 4.5 13.2 10.2 18.8 19.5H14.8L11.4 13.8 6.8 19.5H4L9.1 13.4 3.8 4.5H7.9L11 9.9 15.2 4.5H18Z" />
    </svg>
  );
}

export function RedditIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#FF4500" />
        {/* antenna */}
        <circle cx="16.5" cy="4.5" r="1.5" fill="white" />
        <line x1="12" y1="7" x2="15.5" y2="5.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        {/* head */}
        <circle cx="12" cy="13" r="5.5" fill="white" />
        {/* ears */}
        <circle cx="6.8" cy="11.5" r="2" fill="white" stroke="#FF4500" strokeWidth="0.5" />
        <circle cx="17.2" cy="11.5" r="2" fill="white" stroke="#FF4500" strokeWidth="0.5" />
        {/* eyes */}
        <circle cx="10" cy="12.2" r="1" fill="#FF4500" />
        <circle cx="14" cy="12.2" r="1" fill="#FF4500" />
        {/* smile */}
        <path d="M9.5 14.5 Q12 16.5 14.5 14.5" fill="none" stroke="#FF4500" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {/* circle head */}
      <circle cx="12" cy="13" r="5.5" />
      {/* antenna dot */}
      <circle cx="16.5" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
      <line x1="12" y1="7.5" x2="15.8" y2="5.2" />
      {/* side ears */}
      <circle cx="6.8" cy="11.5" r="1.8" />
      <circle cx="17.2" cy="11.5" r="1.8" />
      {/* eyes as dots */}
      <circle cx="10" cy="12.2" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12.2" r="0.8" fill="currentColor" stroke="none" />
      {/* smile */}
      <path d="M9.5 14.5 Q12 16.5 14.5 14.5" />
    </svg>
  );
}

export function TelegramIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#229ED9" />
        <path d="M5.5 11.8 18 6.5l-2.5 12-4-3.5-2 2V14l7-6.5-8.5 5-2.5-0.7z" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M2.5 11.2 21 4l-3 15.5-5.5-4.5-2.5 2.5V15l9-8.5-11 6.5-2.5-0.8z" />
    </svg>
  );
}

export function OnlyFansIcon({ size = 16, className, variant = "mono" }: BrandIconProps) {
  if (variant === "color") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#00AFF0" />
        <text
          x="50%" y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="white"
        >OF</text>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="currentColor"
      >OF</text>
    </svg>
  );
}

export function BrandIcon({
  platform,
  size = 16,
  className,
  variant = "mono",
}: {
  platform: string;
  size?: number;
  className?: string;
  variant?: "mono" | "color";
}) {
  const p = platform.toLowerCase();
  const props = { size, className, variant };
  switch (p) {
    case "instagram": return <InstagramIcon {...props} />;
    case "tiktok":
    case "tik tok": return <TikTokIcon {...props} />;
    case "twitter":
    case "x": return <XIcon {...props} />;
    case "reddit": return <RedditIcon {...props} />;
    case "telegram": return <TelegramIcon {...props} />;
    case "onlyfans": return <OnlyFansIcon {...props} />;
    default: return null;
  }
}
