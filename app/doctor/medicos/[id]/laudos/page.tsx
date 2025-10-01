"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DoctorLayout from "@/components/doctor-layout";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("@/components/ui/tiptap-editor"), { ssr: false });

export default function LaudoEditorPage() {
  const [laudoContent, setLaudoContent] = useState("");
  const [paciente, setPaciente] = useState<{ id: string; nome: string } | null>(null);
  const params = useParams();
  const router = useRouter();
  const pacienteId = params.id;

  useEffect(() => {
    if (pacienteId) {
      // Em um caso real, você faria uma chamada de API para buscar os dados do paciente
      setPaciente({ id: pacienteId as string, nome: `Paciente ${pacienteId}` });
      setLaudoContent(`<p>Laudo para o paciente ${paciente?.nome || ""}</p>`);
    }
  }, [pacienteId, paciente?.nome]);

  const handleSave = () => {
    console.log("Salvando laudo para o paciente ID:", pacienteId);
    console.log("Conteúdo:", laudoContent);
    // Aqui você implementaria a lógica para salvar o laudo no backend
    alert("Laudo salvo com sucesso!");
  };

  const handleContentChange = (richText: string) => {
    setLaudoContent(richText);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Laudo</h1>
          {paciente && <p className="text-gray-600">Editando laudo de: {paciente.nome}</p>}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Tiptap content={laudoContent} onChange={handleContentChange} />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Laudo</Button>
        </div>
      </div>
    </DoctorLayout>
  );
}