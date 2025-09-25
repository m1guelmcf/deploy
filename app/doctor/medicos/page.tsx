import DoctorLayout from "@/components/doctor-layout";

export default function MedicosPage() {
  // Exemplo de variáveis (substitua pelas suas reais)
  const carregando = false;
  const erro = null;
  const pacientes: any[] = [];

  return (
    <DoctorLayout>
      <div className="espaço-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Lista de pacientes protegidos</p>
        </div>

        <div className="bg-branco arredondado-lg borda border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 borda-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Nome</th>
                  <th className="text-left p-4 font-medium text-gray-700">Telefone</th>
                  <th className="text-left p-4 font-medium text-gray-700">Cidade</th>
                  <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-700">Último atendimento</th>
                  <th className="text-left p-4 font-medium text-gray-700">Próximo atendimento</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-gray-600">
                      Carregando...
                    </td>
                  </tr>
                ) : erro ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-red-600">
                      Erro: {erro}
                    </td>
                  </tr>
                ) : pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-gray-600">
                      Nenhum paciente encontrado.
                    </td>
                  </tr>
                ) : (
                  pacientes.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{p.nome}</td>
                      <td className="p-4 text-gray-600">{p.telefone}</td>
                      <td className="p-4 text-gray-600">{p.cidade}</td>
                      <td className="p-4 text-gray-600">{p.estado}</td>
                      <td className="p-4 text-gray-600">{p.ultimo_atendimento}</td>
                      <td className="p-4 text-gray-600">{p.proximo_atendimento}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
