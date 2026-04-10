import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Advertisement from "./Advirtesement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import "../../../css/home.css"

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { retrivePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";

import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
/** REDUX SLICE & SELECTOR */

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),  //setPopulraDishes comanda nomi bolib uni setPopularDishes reducer orqali hosil qilib oldik, dispatch ichida esa setPopularDishes reducerimiz.comanda va reducer nomlarini bir xil nomlab oldik
  setNewDishes: (data:Product[]) => dispatch(setNewDishes(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data))
});

//retriever orqali storega yuklangan malumotni togridan togri chaqirib olish
const popularDishesRetriever = createSelector(
  retrivePopularDishes, 
  (popularDishes) => ({popularDishes}))

export default function HomePage() {
  const {setPopularDishes, setNewDishes, setTopUsers} = actionDispatch(useDispatch());
  const {popularDishes} = useSelector(popularDishesRetriever);


useEffect(() => {
  // Backend server data fetch => Data. Datani backenddan togridan togri olmaymiz.Yaxshsisi kerakli servise ni joriy qilamiz
 const product = new ProductService;
product.getProducts(
{page: 1,
limit: 4,
order: "productViews",
productCollection: ProductCollection.DISH}

).then(data => {
  console.log("data passed here:", data)
  setPopularDishes(data)
}).catch(err => console.log(err))


product.getProducts(
{page: 1,
limit: 4,
order: "createdAt",
productCollection: ProductCollection.DISH}

).then(data => {
  setNewDishes(data)
}).catch(err => console.log(err))
},[])


const member = new MemberService();
member
.getTopUsers()
.then((data) => {
    setTopUsers(data);
})
.catch(
  (err) => console.log(err))


  return (
  <div className={"homepage"}> {/**Barcha section complar homepage schreen components ichida joylashtirildi sababi ular faqat HomePage schreen comp ichida foydalaniladi */}
   
    <PopularDishes/>
    <NewDishes/>
    <Advertisement/>
    <ActiveUsers/>
    <Events/>
  </div>
  );
}
