import winlineBanner1 from "@/assets/winline-banner-1.png";
import winlineBanner2 from "@/assets/winline-banner-2.png";

const AD_LINK = "https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg";

interface WinlineBannerProps {
  variant?: "horizontal" | "sidebar" | "inline";
  className?: string;
}

export const WinlineBanner = ({ variant = "horizontal", className = "" }: WinlineBannerProps) => {
  const banner = variant === "sidebar" ? winlineBanner2 : winlineBanner1;
  const alt =
    variant === "sidebar"
      ? "Winline — Фрибет 3000 рублей для новых игроков"
      : "Winline — Верни азарт в футбол, ставки на спорт";

  return (
    <a
      href={AD_LINK}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`block overflow-hidden rounded-lg transition-transform hover:scale-[1.01] ${className}`}
      aria-label="Реклама Winline"
    >
      <img
        src={banner}
        alt={alt}
        className="w-full"
        loading="lazy"
        width={variant === "sidebar" ? 300 : 728}
        height={variant === "sidebar" ? 250 : 90}
      />
    </a>
  );
};
