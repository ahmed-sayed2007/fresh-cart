export interface IBrand {
  _id: string;
  name: string;
  slug?: string;
  image: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  brand?: {
    _id: string;
    name: string;
  };
}

export interface IBrandsResponse {
  data: IBrand[];
}

export interface IBrandProductsResponse {
  data: IProduct[];
}
