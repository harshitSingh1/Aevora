"use client"

import * as React from "react"
import { TalkExperience } from "@/components/talk/TalkExperience"

export default function TalkPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 h-full flex flex-col max-w-7xl">
      <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <TalkExperience />
      </React.Suspense>
    </div>
  )
}
