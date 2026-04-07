import { configureStore, ThunkAction, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import HomePageReducer from "./screen/homePage/slice";
import reduxLogger from "redux-logger"
import ProductsPageReducer from "./screen/productsPage/slice";
import OrdersPageReducer from "./screen/ordersPage/slice";


export const store = configureStore({
  middleware: (getDefaultMiddleware) => 
    //@ts-ignore
    getDefaultMiddleware().concat(reduxLogger),
  reducer: {
    homePage: HomePageReducer,
    productsPage: ProductsPageReducer, //productsPage nomi ostida productsPagega tegishli reducerlarni storega saqlab oldik
    ordersPage: OrdersPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
