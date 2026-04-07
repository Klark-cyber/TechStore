import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { URL } from "url";
import { Filter, Padding } from "@mui/icons-material";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { setProducts } from "./slice";
import { retreiveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR */

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),  //setPopulraDishes comanda nomi bolib uni setPopularDishes reducer orqali hosil qilib oldik, dispatch ichida esa setPopularDishes reducerimiz.comanda va reducer nomlarini bir xil nomlab oldik
});


const productsRetriever = createSelector(
  retreiveProducts, 
  (products) => ({products}))


// backenddan datani chaqirib olib uni redux storega joylaymiz.Bunda use effectdan foydalanamiz

  interface ProductsProps {
    onAdd: (item: CartItem) => void //onAdd function qollanilganda u osha productga tegishli itemni yani CartItemni qabul qiladi
  }
  

  export default function Products(props: ProductsProps ) {
    const {onAdd} = props //props ichidan onAdd ni olib berishhini talab qilamiz
    const { setProducts } = actionDispatch(useDispatch());
    const {products} = useSelector(productsRetriever);

// handlerlar orqali maxsus object yaratib olamiz bu object bizga interactionlar bilan ishlash imkonini beradi
    const [productSearch, setProductSearch] = useState<ProductInquiry>({ //productSearch oddiy object, setProductSearch esa osha productSearchga tegishli stateni ozgartiruvchi function.useState
      page: 1,
        limit: 8,
        order: "createdAt",
        productCollection: ProductCollection.DISH,
        search: "",
    })

    //search orqali productni topishga moljallangan hendler
    const [searchText, setSearchText] = useState<string>("")
    const history = useHistory(); //use history react-dom hooki 

    useEffect( () => {
      const product = new ProductService();
      product.getProducts((
        productSearch
      )).then(data => setProducts(data))
      .catch(err => console.log(err))
    }, [productSearch]); //<= productsearchga oid biror qiymat ozgarganda useEffect ishga tushadi va backendga yangi sorov yuboriladi


    //x bosilganda search ichidagi matnni bosh stringga aylantirish mantigi
    useEffect(() => {
      if(searchText === "" ){
        productSearch.search = "";
        setProductSearch({...productSearch})
      }
    }, [searchText])

/**HANDLER SECTION */ 

const searchCollectionHanler = (collection: ProductCollection) => { //Bu functionni productCollectionga tegishli qiymatlarni qabul qilib useState ichidagai default qiymatni almashtirishda ishlatamiz 
  productSearch.page = 1; //user collectionni tanlaganda page avtomatik 1 pagega otsin
  productSearch.productCollection = collection; //user ustiga bosgan collection productSearch ichidagi collectionga qiymat sifatida berildin
  //yuqoridagi ozgrishlar objectning stateni ozgartiryapti xolos.Bu yangi objectni hosil qilmaydi.Agar yangi object hosil bolmasa useEffect yangilanmaydi.Shu sababli referenceni yangilab yangi object hosil qilishimiz shart
  setProductSearch({ ...productSearch }) //yangi referencedagi productSearch objectini hosil qilamiz buni natijasida useEffect ishga tushadi va backendga yangi sorov yuboradi
}

const searchOrderHandler = (order: string) => {
  productSearch.page = 1; //user collectionni tanlaganda page avtomatik 1 pagega otsin
  productSearch.order = order;
  setProductSearch({...productSearch})
}


const searchProductHandler = () => {
  productSearch.search = searchText;
  setProductSearch({...productSearch})
}

//pagenation uchun handler
const paginationHandler = (e: ChangeEvent<any>, value: number) => {
  productSearch.page = value;
  setProductSearch({...productSearch});
}

//tanlagan taomni id orqali aniqlab bizga yuborish kerak
const chooseDishHandler = (id: string) => { //ushbu handler products pageda rasmi korinib turgan product ustiga bosilganda unga tegishli id ni tanlab params orqai kerakli urlga yonaltirib beradi.Bu handlerni view ichida ishlatganmiz
  history.push(`/products/${id}`) //historyning push methodi ustiga bosilgan elementning kerakli malumotini tanlab uni paramga qoyib kerakli urlga yonaltiradi
}

  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
             {/**Bumarak restaurant va poiskga tegishli staack */}
            <Stack className="avatar-big-box">
                <Stack className="top-text">
                    <Box><p>Burak Restaurant</p></Box>
                   <Box className="search-big-box">

                          {/* input */}
                          <input
                            type = {"search"}
                            className = {"single-search-input"}
                            name={"singleResearch"}
                            placeholder="Type here"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                              if(e.key === "Enter") searchProductHandler(); //search maydoniga matin kiritilgach Enter tugma bosilganda DidUpdate bolish mantigi huddi 133 qator singari
                            }}
                          />
                          {/* search button */}
                          
                              <Button
                            variant="contained"
                            className="single-button-search"
                            onClick={searchProductHandler}
                          >
                            SEARCH
                            <Box className="prev-btn">
                              <SearchIcon sx={{PaddingLeft:"9px"}}/>
                            </Box>
                          </Button>
                          
                        </Box>
                </Stack>
            </Stack>

            <Stack className="dishes-filter-section"> {/* */}
            
          <Stack className={"dishes-filter-box"} >
            <Button
              variant={"contained"}
              color={productSearch.order === "createdAt" ? "primary" : "secondary" }
              className={"order"}
              onClick={() => searchOrderHandler("createdAt")}
            >
              New
            </Button>
            <Button
              variant={"contained"}
              color={productSearch.order === "productPrice" ? "primary" : "secondary" }
              className={"order"}
              onClick={() => searchOrderHandler("productPrice")}
            >
              Price
            </Button>
            <Button
              variant={"contained"}
              color={productSearch.order === "productViews" ? "primary" : "secondary" }
              className={"order"}
              onClick={() => searchOrderHandler("productViews")}
            >
              Views
            </Button>
          </Stack>
            </Stack>

            <Stack className="list-category-section" flexDirection={"row"} >
                <Stack className={"product-category"} >
                    <Stack className={"category-main"}>
                        <Button variant={"contained"} color={
                          productSearch.productCollection === ProductCollection.OTHER ? "primary" : "secondary" 
                        } onClick={() => searchCollectionHanler(ProductCollection.OTHER)}>
                        Other
                        </Button>
                        <Button variant={"contained"} color={
                          productSearch.productCollection === ProductCollection.DESSERT ? "primary" : "secondary"  } onClick={() => searchCollectionHanler(ProductCollection.DESSERT)}>
                        Dessert
                        </Button>
                        <Button variant={"contained"} color={
                          productSearch.productCollection === ProductCollection.DRINK ? "primary" : "secondary" } onClick={() => searchCollectionHanler(ProductCollection.DRINK)}>
                        Drink
                        </Button>
                        <Button variant={"contained"} color={
                          productSearch.productCollection === ProductCollection.SALAD ? "primary" : "secondary" } onClick={() => searchCollectionHanler(ProductCollection.SALAD)}>
                        Salad
                        </Button>
                        <Button variant={"contained"} color={
                          productSearch.productCollection === ProductCollection.DISH ? "primary" : "secondary" } onClick={() => searchCollectionHanler(ProductCollection.DISH)}>
                        Dish
                        </Button>
                    </Stack>
                </Stack>
        <Stack className="product-wrapper" >
                {products.length !== 0 ? (
            products.map((product: Product) => {
        const imagePath = `${serverApi}/${product.productImages[0]}`
        const sizeVolume = product.productCollection === ProductCollection.DRINK ? product.productVolume + " liter" : product.productSize + " size"
              return (
                <Stack key={product._id} className={"product-card"} onClick={() => chooseDishHandler(product._id)}>
                  <Stack
                    className={"product-img"}
                    sx={{ backgroundImage: `url(${imagePath})`}}
                  >
                    <div className={"product-sale"}>{sizeVolume}</div>
                    <Button className={"shop-btn"} 
                    onClick={(e) => {
                      onAdd({
                        _id: product._id,
                        quantity:1,
                        name: product.productName,
                        price: product.productPrice,
                        image: product.productImages[0], //imagening faqat 1 elementi korinib tursa yetarli.productImages type string belgilangan 
                      });
                      e.stopPropagation()}}> {/**product click bolganda eventni qolga kiritib e objectning stoppropogation methodini ishlatdik. Bu method ushbu buttunga tegishli card absolute maydon ozi joylashgan parentga tegishli style ayni shu maydon uchun amal qilmaydi */}
                      <img
                        src={"/icons/shopping-cart.svg"}
                        style={{ display: "flex" }}
                      />
                    </Button>
                    <Button className={"view-btn"} sx={{ right: "36px" }}>
                      <Badge badgeContent={product.productViews} color="secondary">
                        <RemoveRedEyeIcon
                          sx={{
                            color: product.productViews === 0 ? "gray" : "white",
                          }}
                        />
                      </Badge>
                    </Button>
                  </Stack>
                  <Box className={"product-desc"}>
                    <span className={"product-title"}>
                      {product.productName}
                    </span>
                    <div className={"product-desc"}>
                      <MonetizationOnIcon />
                      {product.productPrice}
                    </div>
                  </Box>
                  </Stack>
              );
            })
        ):(
            <Box className="no-data">Products are not available</Box>
        )}
            </Stack>
        </Stack>





            <Stack className="pagination-section">
                <Pagination
          count={products.length !==0 ? productSearch.page + 1 : productSearch.page}
          page={productSearch.page}
          renderItem={(item) => (
            <PaginationItem
              components={{
                previous: ArrowBackIcon,
                next: ArrowForwardIcon,
              }}
              {...item}
              color={"secondary"}
            />
          )}
          onChange={paginationHandler}
        />
            </Stack>
       </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Container className="family-brands">
            <Box className="category-title">Our Family Brands</Box>
            <Stack className="brand-list">
                <Box className="review-box"><img src={"/img/gurme.webp"}/></Box>
                <Box className="review-box"><img src={"/img/gurme.webp"}/></Box>
                <Box className="review-box"><img src={"/img/gurme.webp"}/></Box>
                <Box className="review-box"><img src={"/img/gurme.webp"}/></Box>
            </Stack>
        </Container>
      </div>
      <div className={"addres"}>
        <Container>
            <Stack className="address-area">
                <Box className="title">Our Addres</Box>
        <iframe
            style={{ marginTop: "60px" }}
            src="https://maps.google.com/maps?q=Abdulla%20Kahhar%20Street%2022%20Tashkent&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="600"
            height="450"
/>
        </Stack>
      </Container>
      </div>
    </div>
  );
}