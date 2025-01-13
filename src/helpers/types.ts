import type { CollectionNames } from './enums'

export type MenuItemType = {
  id: string
  name: string
  price: number
  currency: string
  ingredients?: string[]
}

export type IngredientsType = {
  id: string
  name: string
  price: number
  currency: string
}

export type CollectionNamesType = (typeof CollectionNames)[keyof typeof CollectionNames]

export type CollectionTypeMap = {
  [CollectionNames.pizzas]: MenuItemType
  [CollectionNames.paninos]: MenuItemType
  [CollectionNames.calzones]: MenuItemType
  [CollectionNames.sauces]: MenuItemType
  [CollectionNames.ingredients]: IngredientsType
}

export type CartItemType = {
  id: string
  menuItem: MenuItemType
  quantity: number
  sauces: (MenuItemType & { quantity: number })[]
  aditionalIngredients: (IngredientsType & { quantity: number })[]
  finalItemPrice: number
}
