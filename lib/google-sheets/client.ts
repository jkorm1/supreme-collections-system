import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

export type SheetRow = Record<string, string>;

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

// Initialize the Google Sheets document
export async function getGoogleSheet() {
  const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);

  // Parse credentials from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      'GOOGLE_SHEETS_CREDENTIALS is missing or invalid (needs client_email and private_key)'
    );
  }

  // Authenticate with Google Sheets API
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key.replace(/\\n/g, '\n'),
  });

  // Load document info
  await doc.loadInfo();

  return doc;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSheetOrThrow(doc: GoogleSpreadsheet, sheetName: string) {
  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  return sheet;
}

/**
 * Converts a row into a PLAIN object using the header names.
 * (Returning the row itself, or copying its properties, drags in a hidden
 * link to the whole spreadsheet, which breaks JSON.stringify.)
 */
function rowToObject(headers: string[], row: any): SheetRow {
  const obj: SheetRow = {};
  for (const header of headers) {
    const value = row[header];
    obj[header] = value === undefined || value === null ? '' : String(value);
  }
  return obj;
}

/**
 * Makes sure every key in `needed` exists as a column header, adding any
 * missing ones to the end of row 1. Returns the final list of headers.
 */
async function syncHeaders(
  sheet: GoogleSpreadsheetWorksheet,
  needed: string[]
): Promise<string[]> {
  let current: string[] = [];
  try {
    await sheet.loadHeaderRow();
    current = sheet.headerValues;
  } catch {
    current = []; // empty header row
  }

  const missing = needed.filter((key) => key && !current.includes(key));
  if (missing.length === 0) return current;

  const next = [...current, ...missing];

  if (next.length > sheet.columnCount) {
    await sheet.resize({ rowCount: sheet.rowCount, columnCount: next.length });
  }

  await sheet.setHeaderRow(next);
  await sheet.loadHeaderRow();
  return sheet.headerValues;
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

// Read data from a specific sheet (returns plain objects)
export async function readSheet(sheetName: string): Promise<SheetRow[]> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle[sheetName];

    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found`);
      return [];
    }

    const rows = await sheet.getRows();
    const headers = sheet.headerValues;

    return rows.map((row) => rowToObject(headers, row));
  } catch (error) {
    console.error(`Error reading sheet "${sheetName}":`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

// Add a new row to a sheet (missing columns are created automatically)
export async function addRowToSheet(sheetName: string, rowData: any) {
  try {
    const doc = await getGoogleSheet();
    const sheet = getSheetOrThrow(doc, sheetName);

    await syncHeaders(sheet, Object.keys(rowData));
    await sheet.addRow(rowData);

    return rowData;
  } catch (error) {
    console.error(`Error adding row to sheet "${sheetName}":`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

// Update a row by its position (0 = first data row)
export async function updateRowInSheet(
  sheetName: string,
  rowIndex: number,
  rowData: any
) {
  try {
    const doc = await getGoogleSheet();
    const sheet = getSheetOrThrow(doc, sheetName);

    const headers = await syncHeaders(sheet, Object.keys(rowData));
    const rows = await sheet.getRows();

    if (rowIndex < 0 || rowIndex >= rows.length) {
      throw new Error(`Row index ${rowIndex} is out of bounds`);
    }

    const row: any = rows[rowIndex];
    for (const header of headers) {
      if (header in rowData) row[header] = rowData[header];
    }
    await row.save();

    return rowToObject(headers, row);
  } catch (error) {
    console.error(`Error updating row in sheet "${sheetName}":`, error);
    throw error;
  }
}

// Update the row whose `idColumn` equals `id`. Returns null if not found.
export async function updateRowById(
  sheetName: string,
  idColumn: string,
  id: string,
  rowData: any
): Promise<SheetRow | null> {
  try {
    const doc = await getGoogleSheet();
    const sheet = getSheetOrThrow(doc, sheetName);

    const headers = await syncHeaders(sheet, Object.keys(rowData));
    const rows = await sheet.getRows();

    const row: any = rows.find(
      (r: any) => String(r[idColumn] ?? '').trim() === id
    );
    if (!row) return null;

    for (const header of headers) {
      if (header !== idColumn && header in rowData) {
        row[header] = rowData[header];
      }
    }
    await row.save();

    return rowToObject(headers, row);
  } catch (error) {
    console.error(`Error updating row in sheet "${sheetName}":`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

// Delete a row by its position (0 = first data row)
export async function deleteRowFromSheet(sheetName: string, rowIndex: number) {
  try {
    const doc = await getGoogleSheet();
    const sheet = getSheetOrThrow(doc, sheetName);

    const rows = await sheet.getRows();
    if (rowIndex < 0 || rowIndex >= rows.length) {
      throw new Error(`Row index ${rowIndex} is out of bounds`);
    }

    await rows[rowIndex].delete();
    return true;
  } catch (error) {
    console.error(`Error deleting row from sheet "${sheetName}":`, error);
    throw error;
  }
}

// Delete the row whose `idColumn` equals `id`. Returns false if not found.
export async function deleteRowById(
  sheetName: string,
  idColumn: string,
  id: string
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    const sheet = getSheetOrThrow(doc, sheetName);

    const rows = await sheet.getRows();
    const row: any = rows.find(
      (r: any) => String(r[idColumn] ?? '').trim() === id
    );
    if (!row) return false;

    await row.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting row from sheet "${sheetName}":`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Sheet setup
// ---------------------------------------------------------------------------

// Ensure a sheet exists (creating it if needed) and has all the given headers
export async function ensureSheetExists(sheetName: string, headers: string[]) {
  try {
    const doc = await getGoogleSheet();

    const existing = doc.sheetsByTitle[sheetName];
    if (existing) {
      // Add any columns that are missing (e.g. a newly added "Sizes")
      await syncHeaders(existing, headers);
      console.log(`Sheet "${sheetName}" already exists`);
      return existing;
    }

    const sheet = await doc.addSheet({
      title: sheetName,
      headerValues: headers,
    });
    console.log(`Created sheet "${sheetName}" with headers:`, headers);

    return sheet;
  } catch (error) {
    console.error(`Error ensuring sheet "${sheetName}" exists:`, error);
    throw error;
  }
}