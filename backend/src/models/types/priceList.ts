export type PriceService = {
  id: number;
  categoryId: number;
  name: string;
  volume: string;
  price: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PriceCategory = {
  id: number;
  title: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicPriceService = {
  id: number;
  name: string;
  volume: string;
  price: number;
};

export type PublicPriceCategory = {
  id: number;
  title: string;
  services: PublicPriceService[];
};

export type CreatePriceCategoryInput = {
  title: string;
  sortOrder?: number;
};

export type UpdatePriceCategoryInput = {
  title: string;
  sortOrder?: number;
};

export type CreatePriceServiceInput = {
  categoryId: number;
  name: string;
  volume?: string;
  price: number;
  sortOrder?: number;
};

export type UpdatePriceServiceInput = {
  name: string;
  volume?: string;
  price: number;
  sortOrder?: number;
};