import "./Header.css";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="global-header">
      <h2 className="global-title">{title}</h2>
    </header>
  );
}
