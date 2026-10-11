export interface IWishlistProduct {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  brand?: {
    name: string;
  };
}

export interface IWishlistResponse {
  data: IWishlistProduct[] | {
    products?: IWishlistProduct[];
  };
}