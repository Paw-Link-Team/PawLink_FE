import "./Header.css";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="global-header">
      <h1 className="global-title">{title}</h1>
    </header>
  );
}
