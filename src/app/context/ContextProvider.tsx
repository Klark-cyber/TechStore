import React, { ReactNode, useState } from "react";
import Cookies from "universal-cookie";
import { Member } from "../../lib/types/member";
import { GlobalContext } from "../hooks/useGlobals";

const ContextProvider: React.FunctionComponent<{children: ReactNode}> = ({children}) => {
    //cookie ichidan kerakli malumotni olishimiz mumkin boladi buning uchun universalCookie package kerak boladi
    const cookies = new Cookies();
    if(!cookies.get("accessToken")) localStorage.removeItem("memberData") //browserdan memberDatani ochirishga sabab Acesstookenning yashash muddati mavjud u tugagach token ochadi lekin storeda memberData turaveradi shu sababli uni ochirib yuboryapmiz.Agar AccesToken mavjud bolsa memberDatani ochirishning keragi yoq

    const [authMember, setAuthMember] = useState<Member | null>( 
        //storeda aceestoken bor bolsa memberDatani yuklab olib objectga ogirdik.Agar accestoken mavjud bolmasa memberData ochiriladi va authMember useState orqali null qiymatni qabul qilish mantigi 
        localStorage.getItem("memberData") ? JSON.parse(localStorage.getItem("memberData") as string) : null 
    );
    
    const [orderBuilder, setOrderBuilder] = useState<Date>(new Date()); 
    console.log("===== verify ======") 
    return (<GlobalContext.Provider value={{authMember, setAuthMember, orderBuilder, setOrderBuilder}}>
        {children} {/**children Appt.tsx ichida ContextProvider ichiga wrap bolgan barcha componentlar */}
    </GlobalContext.Provider>);

//savatcha bosilganda ham basketda ham paused ordersga bir vaqtda pause orderni bajarish mantigi



}
export default ContextProvider;