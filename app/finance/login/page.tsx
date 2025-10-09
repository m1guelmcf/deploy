// Caminho: app/(finance)/login/page.tsx

import { LoginForm } from "@/components/LoginForm";

export default function FinanceLoginPage() {
    return (
        // Fundo com gradiente laranja, como no seu código original
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
            <LoginForm title="Área Financeira" description="Acesse o sistema de faturamento" role="finance" themeColor="orange" redirectPath="/finance/home" />
        </div>
    );
}
