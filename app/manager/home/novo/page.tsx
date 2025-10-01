"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, ChevronDown, Save, Loader2 } from "lucide-react" 
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ManagerLayout from "@/components/manager-layout"
import { doctorsService } from "services/doctorsApi.mjs"; 


const UF_LIST = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];



interface DoctorFormData {

  nomeCompleto: string; 
  crm: string;
  crmEstado: string;
  cpf: string;
  email: string; 
  especialidade: string; 
  telefoneCelular: string; 
  telefone2: string; 
  cep: string; 
  endereco: string; 
  numero: string; 
  complemento: string; 
  bairro: string; 
  cidade: string; 
  estado: string; 
  dataNascimento: string; 
  rg: string; 
  ativo: boolean; 
  observacoes: string;
  anexos: { id: number, name: string }[];
}


const apiMap: { [K in keyof DoctorFormData]: string | null } = {
  nomeCompleto: 'full_name', 
  crm: 'crm', 
  crmEstado: 'crm_uf', 
  cpf: 'cpf', 
  email: 'email', 
  
  especialidade: 'specialty',
  telefoneCelular: 'phone_mobile',
  telefone2: 'phone2',
  cep: 'cep',
  endereco: 'street',
  numero: 'number',
  complemento: 'complement',
  bairro: 'neighborhood',
  cidade: 'city',
  estado: 'state',
  dataNascimento: 'birth_date',
  rg: 'rg',
  ativo: 'active',
  
  observacoes: null, 
  anexos: null, 
};


const defaultFormData: DoctorFormData = {
  nomeCompleto: '', crm: '', crmEstado: '', cpf: '', email: '', 
  especialidade: '', telefoneCelular: '', telefone2: '', cep: '',
  endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  dataNascimento: '', rg: '', ativo: true,
  observacoes: '', anexos: [],
};




const cleanNumber = (value: string): string => value.replace(/\D/g, '');

const formatCPF = (value: string): string => {
    const cleaned = cleanNumber(value).substring(0, 11);
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatCEP = (value: string): string => {
    const cleaned = cleanNumber(value).substring(0, 8);
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const formatPhoneMobile = (value: string): string => {
    const cleaned = cleanNumber(value).substring(0, 11);
    if (cleaned.length > 10) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};




export default function NovoMedicoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DoctorFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anexosOpen, setAnexosOpen] = useState(false);


  const handleInputChange = (key: keyof DoctorFormData, value: string | boolean | { id: number, name: string }[]) => {
    
    
    if (typeof value === 'string') {
        let maskedValue = value;
        if (key === 'cpf') maskedValue = formatCPF(value);
        if (key === 'cep') maskedValue = formatCEP(value);
        if (key === 'telefoneCelular' || key === 'telefone2') maskedValue = formatPhoneMobile(value);
        
        setFormData((prev) => ({ ...prev, [key]: maskedValue }));
    } else {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };
  
  
  const adicionarAnexo = () => {
    const newId = Date.now(); 
    handleInputChange('anexos', [...formData.anexos, { id: newId, name: `Documento ${formData.anexos.length + 1}` }]);
  }

  const removerAnexo = (id: number) => {
    handleInputChange('anexos', formData.anexos.filter((anexo) => anexo.id !== id));
  }
  

  const requiredFields = [
      { key: 'nomeCompleto', name: 'Nome Completo' },
      { key: 'crm', name: 'CRM' },
      { key: 'crmEstado', name: 'UF do CRM' },
      { key: 'cpf', name: 'CPF' },
      { key: 'email', name: 'E-mail' },
  ] as const;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);


    for (const field of requiredFields) {
        let valueToCheck = formData[field.key];
        
        
        if (!valueToCheck || String(valueToCheck).trim() === '') {
            setError(`O campo obrigatório "${field.name}" deve ser preenchido.`);
            setIsSaving(false);
            return;
        }
    }

    const finalPayload: { [key: string]: any } = {};
    const formKeys = Object.keys(formData) as Array<keyof DoctorFormData>;
    
    
    formKeys.forEach((key) => {
        const apiFieldName = apiMap[key];
        
        if (!apiFieldName) return; 

        let value = formData[key];

        if (typeof value === 'string') {
            let trimmedValue = value.trim();
            
            
            const isOptional = !requiredFields.some(f => f.key === key);
            
            if (isOptional && trimmedValue === '') {
                finalPayload[apiFieldName] = null;
                return;
            }
            
            
            if (key === 'crmEstado' || key === 'estado') {
                trimmedValue = trimmedValue.toUpperCase();
            }
            
            value = trimmedValue;
        }
        
        finalPayload[apiFieldName] = value;
    });

    
      try {
      
      const response = await doctorsService.create(finalPayload); 
      router.push("/manager/home"); 
    } catch (e: any) {
      console.error("Erro ao salvar o médico:", e);
      
      let detailedError = `Erro na requisição. Verifique se o **CRM** ou **CPF** já existem ou se as **Máscaras/Datas** estão incorretas.`;

      
      if (e.message && e.message.includes("duplicate key value violates unique constraint")) {
         
          detailedError = "O CPF ou CRM informado já está cadastrado no sistema. Por favor, verifique os dados de identificação.";
      } else if (e.message && e.message.includes("Detalhes:")) {
         
          detailedError = e.message.split("Detalhes:")[1].trim();
      } else if (e.message) {
          detailedError = e.message;
      }
        
      setError(`Erro ao cadastrar. Detalhes: ${detailedError}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ManagerLayout>
    <div className="w-full space-y-6 p-4 md:p-8"> 
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Médico</h1>
          <p className="text-sm text-gray-500">
            Preencha os dados do novo médico para cadastro.
          </p>
        </div>
        <Link href="/manager/home">
          <Button variant="outline">Cancelar</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
             <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
                 <p className="font-medium">Erro no Cadastro:</p>
                 <p className="text-sm">{error}</p>
            </div>
        )}
          
       
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Dados Principais e Pessoais
          </h2>
          
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                placeholder="Nome do Médico"
                required
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => handleInputChange("crm", e.target.value)}
                placeholder="Ex: 123456"
                required
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="crmEstado">UF do CRM *</Label>
              <Select value={formData.crmEstado} onValueChange={(v) => handleInputChange("crmEstado", v)}>
                <SelectTrigger id="crmEstado">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {UF_LIST.map(uf => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
         
          <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Input
                id="especialidade"
                value={formData.especialidade}
                onChange={(e) => handleInputChange("especialidade", e.target.value)}
                placeholder="Ex: Cardiologia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange("rg", e.target.value)}
                placeholder="00.000.000-0"
              />
            </div>
          </div>
          
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="exemplo@dominio.com"
                required
              />
            </div>
              <div className="space-y-2 col-span-1">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
              />
            </div>
          </div>
        </div>

       
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Contato e Endereço
          </h2>
          
         
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefoneCelular">Telefone Celular</Label>
              <Input
                id="telefoneCelular"
                value={formData.telefoneCelular}
                onChange={(e) => handleInputChange("telefoneCelular", e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone2">Telefone Adicional</Label>
              <Input
                id="telefone2"
                value={formData.telefone2}
                onChange={(e) => handleInputChange("telefone2", e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div className="space-y-2 flex items-end justify-center pb-1">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="ativo"
                        checked={formData.ativo}
                        onCheckedChange={(checked) => handleInputChange("ativo", checked === true)}
                    />
                    <Label htmlFor="ativo">Médico Ativo</Label>
                </div>
            </div>
          </div>

         
          <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2 col-span-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                      id="cep" 
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000" 
                      maxLength={9}
                  />
              </div>
              <div className="space-y-2 col-span-3">
                  <Label htmlFor="endereco">Rua</Label>
                  <Input 
                      id="endereco" 
                      value={formData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      placeholder="Rua, Avenida, etc." 
                  />
              </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="123"
              />
            </div>
            <div className="space-y-2 col-span-3">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => handleInputChange("complemento", e.target.value)}
                placeholder="Apto, Bloco, etc."
              />
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange("bairro", e.target.value)}
                      placeholder="Bairro"
                  />
              </div>
              <div className="space-y-2 col-span-1">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange("estado", e.target.value)}
                      placeholder="SP"
                  />
              </div>
              <div className="space-y-2 col-span-1">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      placeholder="São Paulo"
                  />
              </div>
          </div>
        </div>

        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Outras Informações (Internas)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (Apenas internas)</Label>
                <Textarea 
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Notas internas sobre o médico..."
                    className="min-h-[100px]"
                />
            </div>
            <div className="space-y-4">
                <Collapsible open={anexosOpen} onOpenChange={setAnexosOpen}>
                    <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center cursor-pointer pb-2 border-b">
                        <h2 className="text-md font-semibold text-gray-800">Anexos ({formData.anexos.length})</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${anexosOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-2">
                    <Button type="button" onClick={adicionarAnexo} variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Adicionar Documento
                    </Button>
                    {formData.anexos.map((anexo) => (
                        <div key={anexo.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                        <span className="text-sm text-gray-700">{anexo.name}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removerAnexo(anexo.id)}>
                            <X className="w-4 h-4 text-red-500" />
                        </Button>
                        </div>
                    ))}
                    </CollapsibleContent>
                </Collapsible>
            </div>
          </div>
        </div>


        <div className="flex justify-end gap-4 pb-8 pt-4">
          <Link href="/manager/home">
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={isSaving}
          >
            {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Salvando..." : "Salvar Médico"}
          </Button>
        </div>
      </form>
    </div>
    </ManagerLayout>
  );
}