import { Endpoints } from "../enums/endpoints";

export const API_BASE_URL: string = "http://localhost:5050";

type endpointType = {
  products: string;
  categories: string;
  auth: string;
  orders: string;
  reviews: string;
};

export const endpoints: endpointType = {
  products: Endpoints.products,
  categories: Endpoints.categories,
  auth: Endpoints.auth,
  orders: Endpoints.orders,
  reviews: Endpoints.reviews,
};