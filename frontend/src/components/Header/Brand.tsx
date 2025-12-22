import "./Brand.css";
export default function Header({ variant }: { variant?: "brand" }) {
  if (variant === "brand") {
    return <div className="header-brand">PawLink</div>;
  }
  return null;
}