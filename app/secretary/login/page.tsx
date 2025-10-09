// Caminho: app/(secretary)/login/page.tsx

import { LoginForm } from "@/components/LoginForm"

export default function SecretaryLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <LoginForm
        title="Área da Secretária"
        description="Acesse o sistema de gerenciamento"
        role="secretary"
        themeColor="blue"
        redirectPath="/secretary/pacientes"
      />
    </div>
  )
}