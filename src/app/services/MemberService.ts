import { serverApi } from "../../lib/config";
import axios from "axios";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../../lib/types/member";


class MemberService {
    private readonly path: string;

    constructor(){
        this.path = serverApi
    }

    public async getTopUsers(): Promise<Member[]> {
        try{
            const url = this.path + "/member/top-users";
            const result = await axios.get(url);
            console.log("top users:", result);
            return result.data;
        }catch(err){
            console.log("Error, getTopUsers:", err);
            throw err;
        }
    }


    public async getRestaurant(): Promise<Member> {
        try{
            const url = this.path + "/member/restaurant";
            const result = await axios.get(url);
            console.log("getRestaurant:", result);

            const restaurant: Member = result.data
            return restaurant;
        }catch(err){
            console.log("Error, getRestaurant:", err);
            throw err;
        }
    }

    
    public async signup(input: MemberInput):Promise<Member>{
        try{
            const url = this.path + "/member/signup";
            const result = await axios.post(url, input, {withCredentials: true}); //withCredentials: true serverga session, tooken kabi malumotlarni request orqali yuboradi
            console.log("signup:", result);

            const member: Member = result.data.member;
            console.log("member:", member);
            localStorage.setItem("memberData", JSON.stringify(member)) //backenddan kelgan natijani localStoragega yukladik.Backenddan object holatda data keldi stringify orqali store json korinishda saqladik
            return member;

        }catch(err) {console.log("Error, signup:", err);
            throw err;}
    }

    public async login(input: LoginInput):Promise<Member>{
        try{
            const url = this.path + "/member/login";
            const result = await axios.post(url, input, {withCredentials: true}); //withCredentials: true browserga session, tooken kabi malumotlarni response orqali yuboradi.yoki aksincha.Agar https protokol orqali server run bolmasa withcredentials true bolsa ham cookkielar yoki sessiolarni oldi berdi qilib bolmaydi.Ammo browser ham backend ham bir hil qurulmada run bolsa muammo sodir bolmaydi
            console.log("login:", result);

            const member: Member = result.data.member;
            console.log("member:", member);
            localStorage.setItem("memberData", JSON.stringify(member)) //backenddan kelgan natijani localStoragega yukladik.Backenddan object holatda data keldi stringify orqali store json korinishda saqladik
            return member;

        }catch(err) {console.log("Error, login:", err);
            throw err;}
    }

    public async logout():Promise<void>{
        try{
            const url = this.path + "/member/logout";
            const result = await axios.post(url, {},  {withCredentials: true}); //withCredentials: true browserga session, tooken kabi malumotlarni response orqali yuboradi.yoki aksincha.Agar https protokol orqali server run bolmasa withcredentials true bolsa ham cookkielar yoki sessiolarni oldi berdi qilib bolmaydi.Ammo browser ham backend ham bir hil qurulmada run bolsa muammo sodir bolmaydi
            console.log("logout:", result);

            localStorage.removeItem("memberData") //backenddan kelgan natijani localStoragega yukladik.Backenddan object holatda data keldi stringify orqali store json korinishda saqladik
            //return result.data.logout; //backenddan logout:true qaytadi shuni ichidan true ni return qildik

        }catch(err) {console.log("Error, logout:", err);
            throw err;}
    }

public async updateMember(input: MemberUpdateInput):Promise<Member>{
        try{
            const formData = new FormData();
            formData.append("memberNick", input.memberNick || "");
            formData.append("memberPhone", input.memberPhone || "");
            formData.append("memberAddres", input.memberAddres || "");
            formData.append("memberDesc", input.memberDesc || "");
            formData.append("memberImage", input.memberImage || "");

            const result = await axios(`${serverApi}/member/update`, {
                method: "POST",
                data: formData,
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("updateMember:", result);
            const member: Member = result.data;
            localStorage.setItem("memberData", JSON.stringify(member));
            return member
        }catch(err) {console.log("Error, signup:", err);
            throw err;}
    }

}

export default MemberService;