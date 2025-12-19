interface ChipBannerProps {
  text: string;
}

export default function ChipBanner({ text }: ChipBannerProps) {
  return (
    <section className="home-chip-wrap">
      <div className="home-chip">
        <span className="home-chip-icon">🐾</span>
        <span className="home-chip-text">{text}</span>
      </div>
    </section>
  );
}
