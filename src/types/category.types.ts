export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder: number;
  status: 'active' | 'inactive';
  children?: Category[];
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTree extends Category {
  children?: CategoryTree[];
}

export interface CategoryFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  parentId?: string;
  rootOnly?: boolean;
  sortBy?: 'sortOrder' | 'name' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}
