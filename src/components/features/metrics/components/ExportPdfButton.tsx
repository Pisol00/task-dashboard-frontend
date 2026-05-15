import { useState, type RefObject } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { exportElementToPdf } from '../utils/exportPdf'

type ExportPdfButtonProps = {
  targetRef: RefObject<HTMLElement | null>
  filename: string
}

export function ExportPdfButton({ targetRef, filename }: ExportPdfButtonProps) {
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    if (!targetRef.current || busy) return
    setBusy(true)
    try {
      await exportElementToPdf({ element: targetRef.current, filename })
    } catch (err) {
      console.error('[exportPdf] failed', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {t('chart.exportPdf')}
    </Button>
  )
}
