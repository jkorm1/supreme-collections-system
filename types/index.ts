// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface AuthToken {
  token: string
  expiresIn: number
}

export interface AuthPayload {
  admin: true
  iat: number
  exp: number
}

// Product Types
export interface Product {
  Product_ID: string
  Product_Name: string
  Category: string
  Price: number
  Cost?: number
  Description?: string
  Sizes: string // comma-separated
  Stock_Quantity: number
  Image_URL?: string
  Status: 'Active' | 'Inactive'
  Date_Added: Date
}

export interface ProductCategory {
  name: string
  id: string
  icon?: string
}

// Order Types
export interface Order {
  Order_ID: string
  Date: Date
  Customer_Name: string
  Phone: string
  Location: string
  Delivery_Address: string
  Product_ID: string
  Product_Name: string
  Size: string
  Color?: string
  Quantity: number
  Unit_Price: number
  Total_Price: number
  Status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'
  Special_Instructions?: string
  Payment_Status?: 'Paid' | 'Pending' | 'COD'
  Date_Delivered?: Date
}

export interface OrderRequest {
  Product_ID: string
  Customer_Name: string
  Phone: string
  Location: string
  Delivery_Address: string
  Size: string
  Color?: string
  Quantity: number
  Special_Instructions?: string
}

// Sales Types
export interface Sale {
  Sale_ID: string
  Date: Date
  Order_ID: string
  Product_ID: string
  Product_Name: string
  Quantity: number
  Unit_Price: number
  Total_Amount: number
  Payment_Method: string
  Payment_Provider?: string
  Notes?: string
}

// Expense Types
export interface Expense {
  Expense_ID: string
  Date: Date
  Category: string
  Amount: number
  Description: string
  Paid_To?: string
  Payment_Method: string
  Receipt?: string
  Approved_By?: string
  Notes?: string
}

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
}

// Customer Types
export interface Customer {
  Customer_ID: string
  Full_Name: string
  Phone: string
  Location: string
  Email?: string
  Date_Joined: Date
  Total_Orders?: number
  Total_Spent?: number
  Last_Purchase_Date?: Date
  Status: 'Active' | 'Inactive'
}

// Inventory Types
export interface InventoryItem {
  Inventory_ID: string
  Product_ID: string
  Product_Name: string
  Stock_Quantity: number
  Min_Stock_Level?: number
  Max_Stock_Level?: number
  Last_Restocked?: Date
  Restock_Quantity?: number
  Supplier?: string
  Cost_Per_Unit?: number
  Location?: string
}

// Dashboard Types
export interface DashboardMetrics {
  totalRevenue: number
  totalSales: number
  pendingOrders: number
  productsInStock: number
  todaysSales: number
  thisWeeksSales: number
  topSellingProduct: string
  lowStockAlerts: number
}

export interface ChartDataPoint {
  name: string
  value: number
  date?: string
}

// Excel Schema Types
export interface ExcelColumn {
  name: string
  type: 'Text' | 'Number' | 'Currency' | 'Date' | 'Boolean' | 'Dropdown'
  required: boolean
  description?: string
  validation?: {
    minLength?: number
    maxLength?: number
    minValue?: number
    maxValue?: number
    pattern?: string
    allowedValues?: string[]
  }
  defaultValue?: any
}

export interface ExcelSheet {
  name: string
  columns: ExcelColumn[]
  description?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  pageSize: number
  error?: string
}

// Form Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
}
