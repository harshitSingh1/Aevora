import * as React from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { FinancialCharge } from "@/types"
import { motion } from "motion/react"
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SyntheticBillViewerProps {
  charges: FinancialCharge[]
  patientName: string
  selectedChargeId?: string
  onChargeClick?: (chargeId: string) => void
}

export function SyntheticBillViewer({ charges, patientName, selectedChargeId, onChargeClick }: SyntheticBillViewerProps) {
  const [zoom, setZoom] = React.useState(1)

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5))
  const handleResetZoom = () => setZoom(1)

  const total = charges.reduce((acc, curr) => acc + curr.billedAmount, 0)

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden relative shadow-sm">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-md border border-border shadow-sm">
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
        <div className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</div>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleResetZoom}><RotateCcw className="w-4 h-4" /></Button>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 p-8 flex justify-center items-start">
        
        {/* The Document */}
        <motion.div 
          className="bg-white text-black p-8 md:p-12 shadow-md w-full max-w-[600px] min-h-[800px] origin-top"
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="border-b-2 border-black/10 pb-6 mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">CITYCARE HOSPITAL</h1>
            <p className="text-sm font-medium tracking-widest text-slate-500 mt-1 uppercase">Invoice / Final Bill</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
            <div>
              <p className="text-slate-500 font-medium mb-1">Patient Name</p>
              <p className="font-bold text-slate-900">{patientName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Invoice Number</p>
              <p className="font-bold text-slate-900">CL-DEMO-2026-001</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Admission Date</p>
              <p className="font-bold text-slate-900">12 Aug 2026</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Discharge Date</p>
              <p className="font-bold text-slate-900">20 Aug 2026</p>
            </div>
          </div>

          <div className="mb-4 bg-amber-500/10 text-amber-800 text-xs font-bold py-1 px-3 inline-block rounded border border-amber-500/20">
            SYNTHETIC DEMO DOCUMENT
          </div>

          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b border-black/20">
                <th className="text-left font-semibold text-slate-600 pb-3">DESCRIPTION</th>
                <th className="text-right font-semibold text-slate-600 pb-3 w-20">QTY</th>
                <th className="text-right font-semibold text-slate-600 pb-3 w-32">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((charge, i) => {
                const isSelected = selectedChargeId === charge.id
                return (
                  <tr 
                    key={charge.id} 
                    className={cn(
                      "border-b border-black/5 cursor-pointer transition-colors relative",
                      isSelected ? "bg-amber-100" : "hover:bg-slate-50"
                    )}
                    onClick={() => onChargeClick?.(charge.id)}
                  >
                    <td className="py-4 font-medium text-slate-800">
                      {charge.description}
                      {isSelected && (
                        <motion.div 
                          layoutId="highlight" 
                          className="absolute inset-0 border-2 border-amber-500 z-10 pointer-events-none" 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </td>
                    <td className="py-4 text-right text-slate-600">
                      {charge.description === "Room Charges" ? "5" : 
                       charge.description === "Doctor Consultation" ? "4" : 
                       charge.description === "Medicines" || charge.description === "Additional Care" ? "-" : "1"}
                    </td>
                    <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(charge.billedAmount)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="pt-6 pb-2 text-right font-bold text-slate-600">TOTAL</td>
                <td className="pt-6 pb-2 text-right font-bold text-xl text-slate-900">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-16 pt-8 border-t border-black/10 text-xs text-slate-500 text-center">
            <p>This is a computer generated invoice and does not require a physical signature.</p>
            <p className="mt-1">Page 1 / 1</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
