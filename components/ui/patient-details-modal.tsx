'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";

interface PatientDetailsModalProps {
  isOpen: boolean;
  patient: any;
  onClose: () => void;
}

export function PatientDetailsModal({ patient, isOpen, onClose }: PatientDetailsModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Paciente</DialogTitle>
          <DialogDescription>Informações detalhadas sobre o paciente.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome Completo</p>
              <p>{patient.nome}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>{patient.email}</p>
            </div>
            <div>
              <p className="font-semibold">Telefone</p>
              <p>{patient.telefone}</p>
            </div>
            <div>
              <p className="font-semibold">Data de Nascimento</p>
              <p>{patient.birth_date}</p>
            </div>
            <div>
              <p className="font-semibold">CPF</p>
              <p>{patient.cpf}</p>
            </div>
            <div>
              <p className="font-semibold">Tipo Sanguíneo</p>
              <p>{patient.blood_type}</p>
            </div>
            <div>
              <p className="font-semibold">Peso (kg)</p>
              <p>{patient.weight_kg}</p>
            </div>
            <div>
              <p className="font-semibold">Altura (m)</p>
              <p>{patient.height_m}</p>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Rua</p>
                <p>{`${patient.street}, ${patient.number}`}</p>
              </div>
              <div>
                <p className="font-semibold">Complemento</p>
                <p>{patient.complement}</p>
              </div>
              <div>
                <p className="font-semibold">Bairro</p>
                <p>{patient.neighborhood}</p>
              </div>
              <div>
                <p className="font-semibold">Cidade</p>
                <p>{patient.cidade}</p>
              </div>
              <div>
                <p className="font-semibold">Estado</p>
                <p>{patient.estado}</p>
              </div>
              <div>
                <p className="font-semibold">CEP</p>
                <p>{patient.cep}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button type="button" className="px-4 py-2 bg-gray-200 rounded-md">Fechar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
