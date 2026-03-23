"use client";

import { createContext, useContext } from "react";

type UserInfo = {
  email: string;
  name?: string;
  plan?: string;
} | null;

const UserContext = createContext<UserInfo>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserInfo;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
