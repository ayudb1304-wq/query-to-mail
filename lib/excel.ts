import Excel from "exceljs"
import { PassThrough } from "stream"

interface BuildOptions {
  sheetName?: string
  columns: string[]
  rows: unknown[][]
}

/**
 * Builds an Excel file using ExcelJS streaming writer.
 * Rows are written one at a time — avoids holding the full spreadsheet in memory.
 */
export function buildExcelBuffer(options: BuildOptions): Promise<Buffer> {
  const { columns, rows, sheetName = "Report" } = options

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const passthrough = new PassThrough()

    passthrough.on("data", (chunk: Buffer) => chunks.push(chunk))
    passthrough.on("end", () => resolve(Buffer.concat(chunks)))
    passthrough.on("error", reject)

    const workbook = new Excel.stream.xlsx.WorkbookWriter({
      stream: passthrough,
      useStyles: true,
    })

    const sheet = workbook.addWorksheet(sheetName)

    // Set column widths based on header length (streaming writer can't auto-size)
    sheet.columns = columns.map((col) => ({
      header: col,
      key: col,
      width: Math.max(12, Math.min(col.length + 4, 40)),
    }))

    // Style the header row
    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A1A1A" },
    }
    headerRow.commit()

    // Write data rows
    for (const row of rows) {
      sheet.addRow(row).commit()
    }

    workbook.commit().catch(reject)
  })
}
