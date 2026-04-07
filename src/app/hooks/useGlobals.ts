import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";

interface GlobalInterface {
    authMember: Member | null; //null login bolmagan userlar uchun
    setAuthMember: (member: Member | null) => void //null logout bolganda kerak.setAuthmember member malumotlarini ozgartiruvchi funksiya
    orderBuilder: Date;
    setOrderBuilder: (input: Date) => void;
}

export const GlobalContext = createContext<GlobalInterface | undefined >( // Bosh omboxona yaratildi.undefined GlobalContextning boshlangich qiymati.Global contextni createContext orqali hosil qilib oldik
    undefined //omborning ichi dastlab bosh
); 
export const useGlobals = () => { //useGlobals hookini hosil qildik.Bu omborga saqlangan malumotlarni chaqirish uchunkerak
    const context = useContext(GlobalContext); //useContext orqali GlobalContext ichidagi authmember va setAutjmember ni chaqirib olyapmiz
    if(context === undefined) throw new Error("useGlobals withit Provider") //context royxatga olinmagan bolsa eror
    return context
}