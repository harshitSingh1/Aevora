"use client"

import * as React from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { mockFinancialEvents } from "@/lib/mock-data"

export function FinancialChart() {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockFinancialEvents} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748B" }} 
            dy={10} 
          />
          <YAxis 
            hide 
            domain={["dataMin - 20000", "dataMax + 20000"]}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{data.day}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(data.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{data.event}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#19B5A5" 
            strokeWidth={3}
            dot={{ r: 4, fill: "#19B5A5", strokeWidth: 2, stroke: "#FFFFFF" }}
            activeDot={{ r: 6, fill: "#19B5A5", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
