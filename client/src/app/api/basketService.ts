import { createId } from "@paralleldrive/cuid2";
import type { Dispatch } from "redux";
import type { Product } from "../models/product";
import type { Basket, BasketItem } from "../models/basket";
import { setBasket } from "../../features/basket/basketSlice";

function readBasket(): Basket | null {
  try {
    const basket = JSON.parse(localStorage.getItem("basket") ?? "null") as Basket | null;
    return basket && typeof basket.id === "string" && Array.isArray(basket.items) && basket.items.length
      ? basket : null;
  } catch {
    return null;
  }
}

async function persist(items: BasketItem[], dispatch: Dispatch) {
  const basket = items.length ? { id: createId(), items } : null;
  if (basket) localStorage.setItem("basket", JSON.stringify(basket));
  else localStorage.removeItem("basket");
  localStorage.removeItem("basket_id");
  dispatch(setBasket(basket));
  return basket;
}

function changeQuantity(id: number, difference: number, dispatch: Dispatch) {
  const items = readBasket()?.items ?? [];
  return persist(items.map(item => item.id === id
    ? { ...item, quantity: Math.max(1, Math.min(99, item.stock ?? 99, item.quantity + difference)) }
    : item), dispatch);
}

export default {
  get: async () => readBasket(),
  addItem: async (product: Product, dispatch: Dispatch, amount = 1) => {
    const items = readBasket()?.items ?? [];
    const existing = items.find(item => item.id === product.id);
    if (!existing && items.length >= 50) throw new Error("Maximum 50 different products per order");
    const quantity = (existing?.quantity ?? 0) + amount;
    if (!Number.isInteger(amount) || amount < 1) throw new Error("Choose a valid quantity");
    if (quantity > Math.min(99, product.stock)) throw new Error("Stock limit reached");
    return { basket: await persist([...items.filter(item => item.id !== product.id), { ...product, quantity }], dispatch) };
  },
  removeItem: (id: number, dispatch: Dispatch) => persist((readBasket()?.items ?? []).filter(item => item.id !== id), dispatch),
  incrementItemQuantity: (id: number, quantity: number, dispatch: Dispatch) => changeQuantity(id, quantity, dispatch),
  decrementItemQuantity: (id: number, quantity: number, dispatch: Dispatch) => changeQuantity(id, -quantity, dispatch),
  replace: persist,
  clear: (id: string, dispatch: Dispatch) => readBasket()?.id === id ? persist([], dispatch) : Promise.resolve(null),
};
