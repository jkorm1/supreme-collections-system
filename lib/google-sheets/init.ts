import { ensureSheetExists } from './client';

// Define all required sheets with their headers
const REQUIRED_SHEETS = {
  'Products': [
    'Product_ID',
    'Product_Name',
    'Category',
    'Price',
    'Description',
    'Image_URL',
  ],
  'Orders': [
    'Order_ID',
    'Date',
    'Customer_Name',
    'Phone',
    'Delivery_Address',
    'Product_ID',
    'Product_Name',
    'Size',
    'Quantity',
    'Unit_Price',
    'Total_Price',
    'Special_Instructions'
  ],
  'Sales': [
    'ID',
    'Date',
    'Employee',
    'Product',
    'Quantity',
    'Price',
    'Total Sales',
    'Event',
    'Production Cost',
    'Business Savings',
    'Sales Payroll',
    'Tithe'
  ],
  'Expenses': [
    'ID',
    'Date',
    'Category',
    'Description',
    'Amount',
    'Notes'
  ],
  'Customers': [
    'Customer_ID',
    'Full_Name',
    'Phone',
    'Location',
  ]
};

// Initialize all required sheets
export async function initializeGoogleSheets() {
  console.log('Initializing Google Sheets...');
  
  for (const [sheetName, headers] of Object.entries(REQUIRED_SHEETS)) {
    try {
      await ensureSheetExists(sheetName, headers);
      console.log(`✓ Sheet "${sheetName}" is ready`);
    } catch (error) {
      console.error(`✗ Failed to initialize sheet "${sheetName}":`, error);
    }
  }
  
  console.log('Google Sheets initialization complete');
}
