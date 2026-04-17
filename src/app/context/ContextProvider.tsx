import React, { ReactNode, useState } from "react";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {

  // ❌ OLIB TASHLANDI:
  // const cookies = new Cookies();
  // if (!cookies.get("accessToken")) localStorage.removeItem("memberData");
  //
  // Sabab: backend cookie ni httpOnly:true bilan yuboradi.
  // httpOnly cookie ni JavaScript o'qiy olmaydi.
  // Shuning uchun cookies.get("accessToken") har doim undefined qaytardi,
  // va memberData har refresh da o'chib ketardi → logout ko'rinardi.
  //
  // Logout da MemberService.logout() o'zi localStorage.removeItem("memberData") qiladi ✅

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