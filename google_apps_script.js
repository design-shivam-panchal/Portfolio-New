// ═══════════════════════════════════════════════════════════
// Google Apps Script — Website Leads Data Sheet
// ═══════════════════════════════════════════════════════════
// SETUP INSTRUCTIONS:
// 1. Apni Google Sheet kholo:
//    https://docs.google.com/spreadsheets/d/1V-Z9nSiaqtbOPuusLRRqILjXvsAzglcQ6pOZHxH3HNU/edit
// 2. Top menu: Extensions -> Apps Script
// 3. Iss poore code ko wahan paste karo (purana sab delete karke)
// 4. Save karo (Ctrl+S)
// 5. Deploy -> New deployment -> Web app
//    - Description: Website Leads Webhook
//    - Execute as: Me (aapka email)
//    - Who has access: Anyone (taki website se data aa sake)
// 6. Deploy button click karo -> Google permission maangega:
//    - "Authorize Access" -> Choose Account -> "Advanced" -> "Go to (unsafe)" -> "Allow"
// 7. Jo Web App URL milega (ending in /exec), use copy karo
// 8. D:\Shivam Portolio\index.html me SHEET_URL me paste karo
// ═══════════════════════════════════════════════════════════

const SHEET_NAME = 'Leads';

function doGet(e) {
  return ContentService.createTextOutput("Shivam Portfolio Lead Webhook is Active & Ready!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['#', 'Date & Time', 'Name', 'Email', 'Mobile', 'Project Type', 'Message']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#c8a96e').setFontColor('#0e0e0e');
      sheet.setFrozenRows(1);
    }

    const lastRow = sheet.getLastRow();
    const nextNum = lastRow <= 1 ? 1 : lastRow;

    sheet.appendRow([
      nextNum,
      data.date    || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name    || '',
      data.email   || '',
      data.phone   || '',
      data.project || '',
      data.message || ''
    ]);

    sheet.autoResizeColumns(1, 7);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', row: nextNum }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}