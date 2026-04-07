import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";


const initialState: HomePageState = { //Storeda homepagega dahldor datalarning dastlabki holati mavjud bolishi shart.Ularning dastlabki qiymatini bosh array shaklda belgiladik.
    popularDishes: [],
    newDishes: [],
    topUsers: []
}

const homePageSlice = createSlice({ //homePageSlice bu action hamda reducerni oz ichiga oladi
    name: "homePage", //homePage Slice nomi name redux talab qilgan key, homePageni ozimiz yozamiz. 
    initialState: initialState, //initial State ichida 3 ta bosh array mavjud
    reducers: {
        setPopularDishes: (state, action) => { //setPopularDishes reducer ishga tushganda (state:HomePageState, action:Backenddan yuborilgan data)
            state.popularDishes = action.payload; //initialState ichidagi popularDishes[] ga payloadni joylaydi  action.payload yani data.body niinitialState ichida joylashgan popularDishes nomli keyning valuesiga tenglashtirish mantigi
        },
        setNewDishes: (state, action) => {
            state.newDishes = action.payload;
        },
        setTopUsers: (state, action) => {
            state.topUsers = action.payload;
        }
        }
});

export const {setPopularDishes, setNewDishes, setTopUsers} = homePageSlice.actions;  //homePageSlice.actions ichidagi hosi bolgan actionlarni export qildik.action va reducerni bir xil nomlaymiz

const HomePageReducer = homePageSlice.reducer; //homePageSlice ichida hosil bolgan reducerlarni yaxlitligicha export qilib uni store.ts ichidagi reducer ichiga qoshishimiz kerak.Maqsad: hosil qilgan reducerlarimizni Store bian boglash
export default HomePageReducer