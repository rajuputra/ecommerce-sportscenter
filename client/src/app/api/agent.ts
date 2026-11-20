import axios from "axios";
import basketService from "./basketService";
import type { Product } from "../models/product";
import type { Brand } from "../models/brand";
import type { Type } from "../models/type";
import type { Checkout, Order, OrderDetail, OrderStatus } from "../models/order";
import type { Credentials, Profile, Registration, User } from "../models/user";

export interface Page<T> {
  content: T[];
  page: { totalElements: number; totalPages: number };
}

export interface AdminProduct {
  id?: number;
  version?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  pictureUrl: string;
  brandId: number;
  typeId: number;
  active: boolean;
}

const http = axios.create({ baseURL: "/api/" });

export function authToken() {
  return sessionStorage.getItem("sportscenter-token");
}

export function storeToken(token: string | null) {
  if (token) sessionStorage.setItem("sportscenter-token", token);
  else sessionStorage.removeItem("sportscenter-token");
}

http.interceptors.request.use((config) => {
  const token = authToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(undefined, (error) => {
  const token = authToken();
  if (axios.isAxiosError(error) && error.response?.status === 401 && token &&
      error.config?.headers.Authorization === `Bearer ${token}` && error.config.url !== "auth/login") {
    storeToken(null);
    window.dispatchEvent(new Event("sportscenter-session-expired"));
  }
  return Promise.reject(error);
});

export function errorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  return error.response?.data?.detail || fallback;
}

export function errorStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export default {
  Store: {
    list: (page: number, size: number, filters?: { keyword: string; brandId?: number; typeId?: number; sort: string; order: string }, signal?: AbortSignal) =>
      http.get<Page<Product>>("products", { params: { page: page - 1, size, ...filters }, signal }).then(response => response.data),
    details: (id: number) => http.get<Product>(`products/${id}`).then(response => response.data),
    brands: () => http.get<Brand[]>("products/brands").then(response => response.data),
    types: () => http.get<Type[]>("products/types").then(response => response.data),
  },
  Basket: basketService,
  Account: {
    login: (values: Credentials) => http.post<User>("auth/login", values).then(response => response.data),
    register: (values: Registration) => http.post("auth/register", values),
    profile: () => http.get<Profile>("auth/user").then(response => response.data),
  },
  Orders: {
    list: (page: number) => http.get<Page<Order>>("orders", { params: { page: page - 1 } }).then(response => response.data),
    fetch: (id: number) => http.get<OrderDetail>(`orders/${id}`).then(response => response.data),
    create: (values: Checkout) => http.post<number>("orders", values).then(response => response.data),
    cancel: (id: number) => http.post(`orders/${id}/cancel`),
  },
  Admin: {
    products: (page: number) => http.get<Page<AdminProduct>>("admin/products", { params: { page: page - 1 } }).then(response => response.data),
    saveProduct: (product: AdminProduct) => {
      const { id, ...values } = product;
      return id ? http.put(`admin/products/${id}`, values) : http.post("admin/products", values);
    },
    orders: (page: number) => http.get<Page<Order>>("admin/orders", { params: { page: page - 1 } }).then(response => response.data),
    order: (id: number) => http.get<OrderDetail>(`admin/orders/${id}`).then(response => response.data),
    status: (id: number, status: OrderStatus) => http.patch(`admin/orders/${id}/status`, { status }),
  },
};
