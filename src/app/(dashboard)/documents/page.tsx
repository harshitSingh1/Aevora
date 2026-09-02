"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { DocumentUploader } from "@/components/aevora/DocumentUploader"
import { DocumentCard } from "@/components/aevora/DocumentCard"

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <PageHeader 
        title="Documents" 
        description="Securely upload and manage your healthcare documents."
      />
      
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
          <DocumentUploader />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
          <div className="space-y-4">
            <DocumentCard 
              name="Hospital_Estimate_Oct.pdf"
              type="Estimate"
              status="analyzed"
              date="Oct 14, 2023"
            />
            <DocumentCard 
              name="Doctor_Prescription.jpg"
              type="Recommendation"
              status="analyzed"
              date="Oct 12, 2023"
            />
            <DocumentCard 
              name="Interim_Bill_01.pdf"
              type="Bill"
              status="processing"
              date="Today"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
