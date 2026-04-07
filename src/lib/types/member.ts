import { MemberStatus, MemberType } from "../enums/member.enum";

export interface MemberInput { //Bu type newMember uchun yani har bir yangi memberni shakllantirib beruvchi newMemberni type hisoblanadi.BU type member schema talablariga javob berishi kerak
    memberType?: MemberType;//MemberType va MemberStatus enum bolgani sababli uni member.enumdan import
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAddres?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number
}

export interface Member { //Bu type MongoDb member collectionga borib yozilib memberModelga qaytarilgan return resultning Promise<Member> returned type hisoblanadi 
    _id: string; 
    memberType: MemberType;//MemberType va MemberStatus enum bolgani sababli uni member.enumdan import
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string; //Data collectionga yozilgan malumot natijasi password va manzil kabi maxfiy malumotlarni result orqali console qilishini oldini olishimiz kerak 
    memberAddres?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface LoginInput { //Bu type royxatdan otgan restoran adminini login yani tekshirish uchun foydalanamiz
    memberNick: string;
    memberPassword: string;
}

export interface MemberUpdateInput {
    memberNick?: string;
    memberPhone?: string;
    memberPassword?: string;
    memberAddres?: string;
    memberDesc?: string;
    memberImage?: string;
}


