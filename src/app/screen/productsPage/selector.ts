import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";
import ProductsPage from ".";

const selectProductsPage = (state: AppRootState) => state.productsPage; //AppRootState ichidagi productsPage ga tegishli reducerlarni qolga olmoqchimiz 


export const retreiveRestaurant = createSelector(
    selectProductsPage, 
    (productsPage) => productsPage.restaurant //retreiveRestaurant nomli selector productsPage ichidagi restaurant keyning valuelarini qolga oladi 
);

export const retreiveChosenProduct = createSelector(
    selectProductsPage, 
    (productsPage) => productsPage.chosenProduct
);

export const retreiveProducts = createSelector(
    selectProductsPage, 
    (productsPage) => productsPage.products
);