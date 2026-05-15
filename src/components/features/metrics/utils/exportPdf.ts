import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

type ExportOptions = {
  element: HTMLElement
  filename: string
  title?: string
}

export async function exportElementToPdf({ element, filename, title }: ExportOptions) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
      '--surface-base',
    ),
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const margin = 32
  const availableWidth = pageWidth - margin * 2
  const availableHeight = pageHeight - margin * 2 - (title ? 32 : 0)

  const ratio = Math.min(availableWidth / canvas.width, availableHeight / canvas.height)
  const drawWidth = canvas.width * ratio
  const drawHeight = canvas.height * ratio

  const x = (pageWidth - drawWidth) / 2
  const y = title ? margin + 32 : (pageHeight - drawHeight) / 2

  if (title) {
    pdf.setFontSize(16)
    pdf.text(title, margin, margin + 16)
    pdf.setFontSize(10)
    pdf.setTextColor(120)
    pdf.text(
      `Exported ${new Date().toLocaleString()}`,
      pageWidth - margin,
      margin + 16,
      { align: 'right' },
    )
  }

  pdf.addImage(imgData, 'PNG', x, y, drawWidth, drawHeight)
  pdf.save(filename)
}
