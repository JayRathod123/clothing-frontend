import { Product } from './product.types';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isFeatured: boolean;
  status: 'active' | 'inactive';
  sortOrder: number;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  isFeatured?: boolean;
  sortBy?: 'sortOrder' | 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}
