import { useState } from "react";
import { AuthContext } from "./AuthContext";

/**
 * 로그인 상태를 앱 전체가 공유하도록 감싸는 컴포넌트.
 * 새로고침해도 유지되도록 localStorage 에 저장한다.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      // 저장된 값이 깨져 있으면 로그아웃 상태로 시작한다.
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
