import { type Product } from "@/payload-types";

export type CartProduct = {
  id: Product["id"];
  quantity: number;
  choosenVariantSlug?: string;
};

export type Cart = CartProduct[];
