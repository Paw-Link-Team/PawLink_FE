import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub?: string;          // ⭐ Spring Security 기본
  role?: string;
  exp?: number;
};

export function getMyUserId(): number | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub ? Number(decoded.sub) : null;
  } catch {
    return null;
  }
}

export function getMyRole(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role ?? null;
  } catch {
    return null;
  }
}
