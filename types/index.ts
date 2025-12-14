// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== ADMIN PARAMS
export type AdminParams = {
  Name: string;
  Email: string;
  Role: string;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export interface ProductParams {
  title: string;
  description: string;
  images: {
    imageUrl: string;
  }[];
  price: string;
  oldPrice?: string;
  buyingPrice?: string;
  stock: string;
  category: string;
  subCategory?: string[];
  brand?: string;
  features?: string[];
  sku: string;
  variations?: {
    name: string;
    value: string;
    additionalPrice?: string;
  }[];
  link?: string;
}

export interface CategoryParams {
  title: string;
}

export interface BrandParams {
  title: string;
}

export interface CartParams {
  productId: string;
  title: string;
  images: string;
  price: number;
  quantity: number;
  category: string;
  brand?: string;
  sku: string;
  variations?: {
    name: string;
    value: string;
  }[];
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerParams {
  name: string;
  district: string;
  address: string;
  areaOfDelivery: string;
  number: string;
  email: string;
  addedBy: string;
  totalOrders?: string;
  totalSpend?: string;
  successfulOrder?: string;
  canceledOrder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BannerParams {
  title: string;
  image: string;
}

export type Variation = {
  name: string;
  value: string;
};

export type ProductInOrder = {
  productId: string;
  title: string;
  images: string;
  price: number;
  sellingPrice?: number;
  quantity: number;
  category: string;
  brand?: string;
  sku: string;
  variations?: Variation[];
};

export type CustomerInfo = {
  name: string;
  district: string;
  address: string;
  areaOfDelivery: string;
  number: string;
  email: string;
};

export type OrderParams = {
  orderId?: string;
  customer: CustomerInfo;
  products: ProductInOrder[];
  email: string;

  subtotal: number;
  shipping: number;
  totalAmount: number;
  advancePaid?: number;

  paymentMethod?: "bkash" | "cod";
  paymentStatus?: "pending" | "paid";
  transactionId: string;
  orderStatus?: string;

  shippingMethod?: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDeliveryDate?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  isRefundRequested?: boolean;
  refundStatus?: string;
  returnReason?: string;

  note?: string;
  adminNote?: string;
};

// ====== SETTING PARAMS
export type SettingParams = {
  logo: string;
  favicon: string;
  name: string;
  tagline?: string;
  description?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  facebookGroup?: string;
  youtube?: string;
  aboutUs?: string;
  returnPolicy?: string;
  termsOfService?: string;
  privacyPolicy?: string;
  registrationAmount?: string;
  deliveryCharge: {
    insideDhaka?: string;
    outSideDhaka?: string;
    PickupPoint?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  _id: string;
  productId: string;
  title: string;
  images: string;
  price: number;
  sellingPrice: number;
  quantity: number;
  category: string;
  brand: string;
  sku: string;
  variations?: {
    name: string;
    value: string;
  }[];
};

export type Customer = {
  name: string;
  email: string;
  number: string;
  address: string;
  areaOfDelivery: string;
  district: string;
};

export type StorePendingPaymentInput = {
  customer: Customer;
  cartItems: CartItem[];
  note: string;
  shipping: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  userEmail: string;
  reference: string;
  status?: "pending" | "completed" | "failed";
};

export type StorePendingRegisterPaymentInput = {
  name: string;
  email: string;
  number: number;
  address: string;
  district: string;
  shopName: string;
  shopLogo: string;
  website?: string;
  amount: number;
  reference: string;
  status: "pending" | "completed" | "failed";
};
