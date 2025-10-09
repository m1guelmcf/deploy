// Caminho: app/(doctor)/login/page.tsx

import { LoginForm } from "@/components/LoginForm"

export default function DoctorLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <LoginForm
        title="Área do Médico"
        description="Acesse o sistema médico"
        role="doctor"
        themeColor="green"
        redirectPath="/doctor/medicos"
      />
    </div>
  )
}