import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";


const initialState: ProductsPageState = {
    restaurant: null,
    chosenProduct: null,
    products: []
}

const productsPageSlice = createSlice({
    name: "productsPage", //homePage Slice nomi name redux talab qilgan key, homePageni ozimiz yozamiz. 
        initialState: initialState, //initial State ichida 3 ta bosh array mavjud
        reducers: {
            setRestaurant: (state, action) => { 
                state.restaurant = action.payload; 
            },
            setChosenProduct: (state, action) => {
                state.chosenProduct = action.payload;
            },
            setProducts: (state, action) => {
                state.products = action.payload;
            }
            }
    });

    export const { setRestaurant, setChosenProduct, setProducts} = productsPageSlice.actions;

    const ProductsPageReducer = productsPageSlice.reducer;
    export default ProductsPageReducer;