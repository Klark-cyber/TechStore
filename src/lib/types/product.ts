import { ProductCollection, ProductStatus } from "../enums/product.enum";
import { ObjectId } from 'mongoose';

//.  TECHSTROE
export interface Product{
    _id: ObjectId;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productBrand: string;
    productMemory: number;
    productRam: number;
    productLikes: number,
    productRating: number,
    productReviewCount:number,
    productDesc?: string;
    productImages: string[];
    productViews: number;
    createdAt: Date;
    updatedAt: Date;
}



export interface ProductInput{
    productStatus?: ProductStatus;
    productCollection: ProductCollection; //Product Type
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productBrand: string,
    productMemory?: number;
    productRam?: number;
    productDesc?: string;
    productImages: string[];
    productViews?: number;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
  productRam?: string;       // 🔥 new
  productMemory?: string;    // 🔥 new
  productBrand?: string;
}

