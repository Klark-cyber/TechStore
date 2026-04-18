import React, { ReactNode, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {

  const [authMember, setAuthMemberState] = useState<Member | null>(
    localStorage.getItem("memberData")
      ? JSON.parse(localStorage.getItem("memberData") as string)
      : null
  );

  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  // setAuthMember wrapper — state + localStorage birga yangilanadi
  const setAuthMember = (member: Member | null) => {
    if (member) {
      localStorage.setItem("memberData", JSON.stringify(member));
    } else {
      localStorage.removeItem("memberData");
    }
    setAuthMemberState(member);
  };

  console.log("===== verify ======");

  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;