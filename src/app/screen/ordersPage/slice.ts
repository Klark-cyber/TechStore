import { createSlice } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";


const initialState: OrdersPageState = { //Storeda homepagega dahldor datalarning dastlabki holati mavjud bolishi shart.Ularning dastlabki qiymatini bosh array shaklda belgiladik.
    pausedOrders: [],
    processOrders: [],
    finishedOrders: [],
}

const ordersPageSlice = createSlice({ //homePageSlice bu action hamda reducerni oz ichiga oladi
    name: "ordersPage", //homePage Slice nomi name redux talab qilgan key, homePageni ozimiz yozamiz. 
    initialState: initialState, //initial State ichida 3 ta bosh array mavjud
    reducers: {
        setPausedOrders: (state, action) => { //setPopularDishes reducer ishga tushganda (state:HomePageState, action:Backenddan yuborilgan data)
            state.pausedOrders = action.payload; //initialState ichidagi popularDishes[] ga payloadni joylaydi  action.payload yani data.body niinitialState ichida joylashgan popularDishes nomli keyning valuesiga tenglashtirish mantigi
        },
        setProcessOrders: (state, action) => {
            state.processOrders = action.payload;
        },
        setFinishedOrders: (state, action) => {
            state.finishedOrders = action.payload;
        }
        }
});

export const {setPausedOrders, setProcessOrders, setFinishedOrders} = ordersPageSlice.actions;  //homePageSlice.actions ichidagi hosi bolgan actionlarni export qildik.action va reducerni bir xil nomlaymiz

const OrdersPageReducer = ordersPageSlice.reducer; //homePageSlice ichida hosil bolgan reducerlarni yaxlitligicha export qilib uni store.ts ichidagi reducer ichiga qoshishimiz kerak.Maqsad: hosil qilgan reducerlarimizni Store bian boglash
export default OrdersPageReducer