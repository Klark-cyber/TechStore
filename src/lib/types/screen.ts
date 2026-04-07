//type integratsiyani amalga oshirish usullari: 1- screen componentlarga asoslangan holda yasash. 2-Target oriented type integration.

import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

/**REACT APP STATE- Butun App ichida ishlatiladigan malumotlarning typeintegratsiyasini yasab olamiz**/
export interface AppRootState {
    homePage: HomePageState; //homepagega dahldor Homepagestateni chaqiryapmiz.homePageda ishlailadigan jamiki datalarni type integratsiyasini HomePageState bilan belgilab olamiz
    productsPage: ProductsPageState;
    ordersPage: OrdersPageState;
}


/**HOMEPAGE scren componentga dahldor malumotlar */
export interface HomePageState { //homePageda foydalanilgan malumotlar (PopularDishes, Fresh Menu, Active Users kabi) va ularning type integratsiyasini hosil qilamiz
    popularDishes: Product[]; //popular dishesni hosil qilishda ishlatiladigan rasmlar Productdan iborat array boladi
    newDishes: Product[];
    topUsers: Member[]; //Active Users ni hosil qilishda type Member bolgan malumotlarda foydalanamiz
}

/*PRODUCTSPAGE scren componentga dahldor malumotlar */
export interface ProductsPageState {
    restaurant: Member | null;
    chosenProduct: Product | null;
    products: Product[];

}


/**ORDERSPAGE scren componentga dahldor type integratsiyalar malumotlar */
export interface OrdersPageState {
    pausedOrders: Order[];
    processOrders: Order[];
    finishedOrders: Order[];
}