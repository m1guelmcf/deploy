// Caminho: app/(manager)/login/page.tsx

import { LoginForm } from "@/components/LoginForm"

export default function ManagerLoginPage() {
  return (
    // Mantemos o seu plano de fundo original
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <LoginForm
        title="Área do Gestor"
        description="Acesse o sistema médico"
        role="manager"
        themeColor="blue"
        redirectPath="/manager/home"
      />
    </div>
  )
}