import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";


const selectOrdersPage = (state:AppRootState) => state.ordersPage; //homePagega dahldor bolgan storageni qolga olish uchun selector hosil qilamiz.Bundan retrive qilish jarayonida foydalanamiz

export const retrivePausedOrders = createSelector(selectOrdersPage, (ordersPage) => ordersPage.pausedOrders);

export const retriveProcessOrders = createSelector(selectOrdersPage, (ordersPage) => ordersPage.processOrders);

export const retriveFinishedOrders = createSelector(selectOrdersPage, (ordersPage) => ordersPage.finishedOrders);

