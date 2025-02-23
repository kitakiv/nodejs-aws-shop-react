import { Product } from '../interface/productInterface';


export const products: Product[] = [
    {
      description: "",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 24,
      title: "Lipstick",
      count: 10,
    },
    {
      description: "Short Product Description7",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      price: 15,
      title: "Shorts",
      count: 10,
    },
    {
      description: "T-shirt",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
      price: 23,
      title: "Product",
      count: 10,
    },
    {
      description: "Short Product Description4",
      id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
      price: 15,
      title: "Dress",
      count: 5,
    },
    {
      description: "Short Product Descriptio1",
      id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
      price: 23,
      title: "Skirt",
      count: 8,
    },
    {
      description: "Short Product Description7",
      id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
      price: 15,
      title: "Pants",
      count: 9,
    },
  ];

  export const getProductById = async (id: string) => {
    const product = products.find((product) => product.id === id) || null;
    return product;
  };