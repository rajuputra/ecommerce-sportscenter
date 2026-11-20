export interface Basket {
    id: string
    items: BasketItem[]
}

export interface BasketItem {
    id: number
    name: string
    description: string
    price: number
    stock?: number
    pictureUrl: string
    productBrand: string
    productType: string
    quantity: number
}
