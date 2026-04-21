import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Advertisement from "./Advirtesement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import TopBrands from "./TopBrands";
import NewArrivals from "./Newarrivals";
import "../../../css/home.css";

import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { CartItem } from "../../../lib/types/search";

/** REDUX */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage(props: HomePageProps) {
  const { onAdd } = props;
  const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(useDispatch());

  useEffect(() => {
    const product = new ProductService();

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.LAPTOPS,
      })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.list ?? [];
        setPopularDishes(list);
      })
      .catch((err) => console.log(err));

    product
      .getProducts({
        page: 1,
        limit: 5,
        order: "createdAt",
        productCollection: ProductCollection.TELEPHONE,
      })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.list ?? [];
        setNewDishes(list);
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={"homepage"}>
      <Statistics />
      <TopBrands />
      <NewArrivals onAdd={onAdd} />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}