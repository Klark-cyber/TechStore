import React from "react";
import { Route, Switch, useRouteMatch, } from "react-router-dom";
import { Container } from "@mui/material";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";

//Products ichiga parentdan keladigan function yoki hooklarni import qilganda import boladigan props uchun typeni shakllantiramiz
interface ProductsPageProps {
  onAdd: (item: CartItem) => void //onAdd function qollanilganda u osha productga tegishli itemni yani CartItemni qabul qiladi
}

// Nested routing tizimini hosil qildik
export default function ProductsPage(props: ProductsPageProps) {
  const {onAdd} = props
  const products = useRouteMatch(); //req kelayotgan urlga tegishli pathni ushladik
  console.log("products:", products)

  return <div className="products-page">
    {/* Agar url endpointini tekshiryapmiz */}
    <Switch> 
      <Route path={`${products.path}/:productId`}> {/**Agar productdan keyin mahsulotga tegishli id ham mavjud bolsa ayni osha mahsulotni boshqa sahifada chosenProduct pageda korsatamiz */}
        <ChosenProduct onAdd={onAdd}/> {/**onAddni chosen hamda products sectional componentda foydalanish uchun uni childga export qildik */}

      </Route>
      <Route path={`${products.path}`}> {/**Agar eendpointda faqat products bolsa products screen compga yonaltiramiz */}
        <Products onAdd={onAdd}/>
      </Route>
    </Switch>
  </div>
}