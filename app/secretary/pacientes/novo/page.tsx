"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, X, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import SecretaryLayout from "@/components/secretary-layout";

// ==================================================================
// DADOS CONSTANTES: Listas de opções para os campos de seleção
// ==================================================================

const OPCOES_DOCUMENTOS = [ { value: "cnh", label: "CNH" }, { value: "passaporte", label: "Passaporte" }, { value: "carteira-trabalho", label: "Carteira de Trabalho" } ];

const OPCOES_ESTADO_CIVIL = [ { value: "solteiro", label: "Solteiro(a)" }, { value: "casado", label: "Casado(a)" }, { value: "divorciado", label: "Divorciado(a)" }, { value: "viuvo", label: "Viúvo(a)" } ];

const OPCOES_ETNIA = [ { value: "branca", label: "Branca" }, { value: "preta", label: "Preta" }, { value: "parda", label: "Parda" }, { value: "amarela", label: "Amarela" }, { value: "indigena", label: "Indígena" } ];

const OPCOES_RACA = OPCOES_ETNIA;

const OPCOES_CIDADES = [ { value: "aracaju", label: "Aracaju" }, { value: "salvador", label: "Salvador" }, { value: "recife", label: "Recife" } ];

const OPCOES_NACIONALIDADE = [ { value: "brasileira", label: "Brasileira" }, { value: "estrangeira", label: "Estrangeira" } ];

const OPCOES_ESTADOS = [ { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, { value: "AP", label: "Amapá" }, { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" }, { value: "CE", label: "Ceará" }, { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" }, { value: "GO", label: "Goiás" }, { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" }, { value: "MS", label: "Mato Grosso do Sul" }, { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" }, { value: "PB", label: "Paraíba" }, { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" }, { value: "PI", label: "Piauí" }, { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" }, { value: "RS", label: "Rio Grande do Sul" }, { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" }, { value: "SC", label: "Santa Catarina" }, { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" }, { value: "TO", label: "Tocantins" } ];

const OPCOES_TIPO_SANGUINEO = [ { value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" } ];

const OPCOES_CONVENIO = [ { value: "particular", label: "Particular" }, { value: "sus", label: "SUS" }, { value: "unimed", label: "Unimed" }, { value: "bradesco", label: "Bradesco Saúde" } ];


// ==================================================================
// COMPONENTES AUXILIARES: Pequenos componentes reutilizáveis
// ==================================================================

const CampoInput = ({ label, name, ...props }: { label: string, name: string, [key: string]: any }) => (
    <div>
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</Label>
        <Input id={name} name={name} className="mt-1" {...props} />
    </div>
);


const CampoSelect = ({ label, name, placeholder, opcoes, ...props }: { label: string, name: string, placeholder: string, opcoes: { value: string, label: string }[], [key: string]: any }) => (
    <div>
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</Label>
        <Select name={name} {...props}>
            <SelectTrigger className="mt-1">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {opcoes.map(opcao => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);


// ==================================================================
// FUNÇÕES DE MÁSCARA: Formatadores para campos de texto
// ==================================================================

const aplicarMascaraCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = valor;
};


const aplicarMascaraCelular = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
};


const aplicarMascaraTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = valor;
};


const aplicarMascaraCEP = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
};


// ==================================================================
// FUNÇÕES DE LÓGICA: Funções de apoio para o formulário
// ==================================================================

function criarPayloadDoFormulario(formData: FormData) {
    // --> LÓGICA: (Simulação) Converte os dados do formulário para um objeto.
    return {};
}


function validarPayload(payload: any): string[] {
    // --> LÓGICA: (Simulação) Valida o objeto de dados.
    return [];
}


async function cadastrarPacienteNaAPI(payload: any) {
    // --> LÓGICA: (Simulação) Envia os dados para a API.
    return "Paciente cadastrado com sucesso";
}


// ==================================================================
// COMPONENTE PRINCIPAL: NovoPacientePage
// ==================================================================
export default function NovoPacientePage() {

    // ----------------------------------------------
    // ESTADOS DO COMPONENTE (useState)
    // ----------------------------------------------

    const [anexosOpen, setAnexosOpen] = useState(false);

    const [anexos, setAnexos] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [dadosFormulario, setDadosFormulario] = useState({ raca: '' });

    const [dadosEndereco, setDadosEndereco] = useState({ logradouro: '', bairro: '', cidade: '', estado: '' });

    const [buscandoCEP, setBuscandoCEP] = useState(false);

    const [dadosMedicos, setDadosMedicos] = useState({ imc: '' });

    const [dadosConvenio, setDadosConvenio] = useState({ validadeIndeterminada: false });

    const router = useRouter();

    const { toast } = useToast();


    // ----------------------------------------------
    // FUNÇÕES DE MANIPULAÇÃO DE EVENTOS (HANDLERS)
    // ----------------------------------------------

    const handleEtniaChange = (valorEtnia: string) => {
        // --> ATUALIZAÇÃO: Sincroniza o campo 'Raça' com o valor de 'Etnia'.
        setDadosFormulario(prev => ({ ...prev, raca: valorEtnia }));
    };


    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // --> ATUALIZAÇÃO: Permite que o usuário edite os campos de endereço.
        const { name, value } = e.target;
        setDadosEndereco(prev => ({ ...prev, [name]: value }));
    };


    const adicionarAnexo = () => {
        // --> ATUALIZAÇÃO: Adiciona um novo item à lista de anexos.
        setAnexos([...anexos, `Documento ${anexos.length + 1}`]);
    };


    const removerAnexo = (index: number) => {
        // --> ATUALIZAÇÃO: Remove um item da lista de anexos pelo seu índice.
        setAnexos(anexos.filter((_, i) => i !== index));
    };


    const handlePesoAlturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // --> REFERÊNCIA: Pega o formulário ao qual o campo pertence.
        const form = e.currentTarget.form;
        if (!form) return;

        // --> LEITURA: Pega os valores de peso e altura do formulário.
        const peso = parseFloat(form.peso.value);
        const altura = parseFloat(form.altura.value);

        // --> VALIDAÇÃO: Checa se peso e altura são números válidos.
        if (peso > 0 && altura > 0) {
            // --> CÁLCULO: Calcula o IMC.
            const imcCalculado = (peso / (altura * altura)).toFixed(2);
            // --> ATUALIZAÇÃO: Salva o IMC no estado.
            setDadosMedicos({ imc: imcCalculado });
        } else {
            // --> LIMPEZA: Reseta o IMC se os valores forem inválidos.
            setDadosMedicos({ imc: '' });
        }
    };


    const handleValidadeIndeterminadaChange = (checked: boolean) => {
        // --> ATUALIZAÇÃO: Atualiza o estado do checkbox.
        setDadosConvenio({ validadeIndeterminada: checked });

        // --> LÓGICA CONDICIONAL: Se o checkbox for marcado...
        if (checked) {
            // --> REFERÊNCIA: Encontra o formulário na página.
            const form = document.querySelector('form');
            // --> LIMPEZA: Limpa e desabilita o campo de data de validade.
            if (form && form.validadeCarteira) {
                form.validadeCarteira.value = '';
            }
        }
    };


    const buscarEnderecoPorCEP = async (e: React.FocusEvent<HTMLInputElement>) => {
        // --> LEITURA: Pega o CEP e remove caracteres não numéricos.
        const cep = e.target.value.replace(/\D/g, "");

        // --> VALIDAÇÃO: Interrompe se o CEP não tiver 8 dígitos.
        if (cep.length !== 8) return;

        // --> ATUALIZAÇÃO: Ativa o indicador de carregamento.
        setBuscandoCEP(true);

        try {
            // --> API: Faz a chamada para a API ViaCEP.
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!res.ok) throw new Error("CEP não encontrado");

            // --> PROCESSAMENTO: Converte a resposta para JSON.
            const data = await res.json();
            if (data.erro) throw new Error("CEP inválido");

            // --> ATUALIZAÇÃO: Preenche os campos de endereço com os dados da API.
            setDadosEndereco({ logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf });

            // --> FEEDBACK: Mostra uma notificação de sucesso.
            toast({ title: "Sucesso", description: "Endereço preenchido automaticamente!" });

        } catch (err: any) {
            // --> FEEDBACK DE ERRO: Mostra uma notificação de erro.
            toast({ title: "Erro", description: err.message, variant: "destructive" });

        } finally {
            // --> ATUALIZAÇÃO: Desativa o indicador de carregamento, independente do resultado.
            setBuscandoCEP(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // --> PREVENÇÃO: Impede o recarregamento padrão da página.
        e.preventDefault();

        // --> VALIDAÇÃO: Impede múltiplos envios enquanto está carregando.
        if (isLoading) return;

        // --> ATUALIZAÇÃO: Ativa o estado de carregamento.
        setIsLoading(true);

        try {
            // --> PREPARAÇÃO: Coleta todos os dados do formulário.
            const formData = new FormData(e.currentTarget);
            const apiPayload = criarPayloadDoFormulario(formData);

            // --> VALIDAÇÃO: Verifica se há erros nos dados.
            const errosDeValidacao = validarPayload(apiPayload);
            if (errosDeValidacao.length > 0) {
                throw new Error(errosDeValidacao[0]);
            }

            // --> API: Envia os dados para serem salvos.
            const mensagemDeSucesso = await cadastrarPacienteNaAPI(apiPayload);

            // --> FEEDBACK: Mostra notificação de sucesso.
            toast({ title: "Sucesso!", description: mensagemDeSucesso });

            // --> NAVEGAÇÃO: Redireciona o usuário para a lista de pacientes.
            router.push("/secretary/pacientes");

        } catch (err: any) {
            // --> FEEDBACK DE ERRO: Mostra notificação de erro.
            toast({ title: "Erro ao cadastrar", description: err.message || "Ocorreu um problema.", variant: "destructive" });

        } finally {
            // --> ATUALIZAÇÃO: Desativa o estado de carregamento.
            setIsLoading(false);
        }
    };


    // ==================================================================
    // RENDERIZAÇÃO DO COMPONENTE (JSX)
    // ==================================================================
    return (
        <SecretaryLayout>
            <div className="space-y-6">

                {/* CABEÇALHO DA PÁGINA */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Novo Paciente</h1>
                        <p className="text-gray-600">Cadastre um novo paciente no sistema</p>
                    </div>
                </div>


                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* ============================================== */}
                    {/* SEÇÃO 1: DADOS PESSOAIS                       */}
                    {/* ============================================== */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados Pessoais</h2>
                        <div className="space-y-6">

                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <Button variant="outline" type="button" size="sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Carregar Foto
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoInput label="Nome *" name="nome" placeholder="Nome completo" required />
                                <CampoInput label="Nome Social" name="nomeSocial" placeholder="Nome social ou apelido" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <CampoInput label="CPF *" name="cpf" placeholder="000.000.000-00" required maxLength={14} onChange={aplicarMascaraCPF} />
                                <CampoInput label="RG" name="rg" placeholder="00.000.000-0" maxLength={12} />
                                <CampoSelect label="Outros Documentos" name="outrosDocumentos" placeholder="Selecione" opcoes={OPCOES_DOCUMENTOS} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Sexo *</Label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sexo" value="masculino" className="text-blue-600" required /><span className="text-sm">Masculino</span></label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sexo" value="feminino" className="text-blue-600" /><span className="text-sm">Feminino</span></label>
                                    </div>
                                </div>
                                <CampoInput label="Data de Nascimento *" name="dataNascimento" type="date" required max={new Date().toISOString().split("T")[0]} min="1900-01-01" />
                                <CampoSelect label="Estado Civil" name="estadoCivil" placeholder="Selecione" opcoes={OPCOES_ESTADO_CIVIL} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoSelect label="Etnia" name="etnia" placeholder="Selecione" opcoes={OPCOES_ETNIA} onValueChange={handleEtniaChange} />
                                <CampoSelect label="Raça" name="raca" placeholder="Selecione" opcoes={OPCOES_RACA} value={dadosFormulario.raca} onValueChange={(valor: string) => setDadosFormulario(prev => ({ ...prev, raca: valor }))} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoSelect label="Naturalidade" name="naturalidade" placeholder="Selecione" opcoes={OPCOES_CIDADES} />
                                <CampoSelect label="Nacionalidade" name="nacionalidade" placeholder="Selecione" opcoes={OPCOES_NACIONALIDADE} />
                            </div>

                            <CampoInput label="Profissão" name="profissao" placeholder="Profissão" />

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoInput label="Nome da Mãe" name="nomeMae" placeholder="Nome da mãe" />
                                <CampoInput label="Profissão da Mãe" name="profissaoMae" placeholder="Profissão da mãe" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoInput label="Nome do Pai" name="nomePai" placeholder="Nome do pai" />
                                <CampoInput label="Profissão do Pai" name="profissaoPai" placeholder="Profissão do pai" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoInput label="Nome do Responsável" name="nomeResponsavel" placeholder="Nome do responsável" />
                                <CampoInput label="CPF do Responsável" name="cpfResponsavel" placeholder="000.000.000-00" maxLength={14} onChange={aplicarMascaraCPF} />
                            </div>

                            <CampoInput label="Nome do Esposo(a)" name="nomeEsposo" placeholder="Nome do esposo(a)" />

                            <div className="flex items-center space-x-2">
                                <Checkbox id="rnGuia" name="rnGuia" />
                                <Label htmlFor="rnGuia" className="text-sm text-gray-700 cursor-pointer">RN na Guia do convênio</Label>
                            </div>

                            <CampoInput label="Código Legado" name="codigoLegado" placeholder="Código do sistema anterior" />

                            <div>
                                <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
                                <Textarea id="observacoes" name="observacoes" placeholder="Observações gerais sobre o paciente" className="min-h-[100px] mt-1" />
                            </div>

                            <Collapsible open={anexosOpen} onOpenChange={setAnexosOpen}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" type="button" className="w-full justify-between p-0 h-auto text-left">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center"><span className="text-white text-xs">📎</span></div>
                                            <span className="text-sm font-medium text-gray-700">Anexos do paciente</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${anexosOpen ? "rotate-180" : ""}`} />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-4 mt-4">
                                    {anexos.map((anexo, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <span className="text-sm">{anexo}</span>
                                            <Button variant="ghost" size="sm" onClick={() => removerAnexo(index)} type="button"><X className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={adicionarAnexo} type="button" size="sm"><Plus className="w-4 h-4 mr-2" />Adicionar Anexo</Button>
                                </CollapsibleContent>
                            </Collapsible>

                        </div>
                    </div>


                    {/* ============================================== */}
                    {/* SEÇÃO 2: CONTATO                              */}
                    {/* ============================================== */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato</h2>
                        <div className="space-y-4">

                            <div className="grid md:grid-cols-3 gap-4">
                                <CampoInput label="E-mail" name="email" type="email" placeholder="email@exemplo.com" />
                                <div>
                                    <Label htmlFor="celular" className="text-sm font-medium text-gray-700">Celular</Label>
                                    <div className="flex mt-1">
                                        <div className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-600">+55</div>
                                        <Input name="celular" placeholder="(XX) XXXXX-XXXX" className="rounded-l-none" maxLength={15} onChange={aplicarMascaraCelular} />
                                    </div>
                                </div>
                                <CampoInput label="Telefone 1" name="telefone1" placeholder="(XX) XXXX-XXXX" maxLength={14} onChange={aplicarMascaraTelefone} />
                            </div>

                            <CampoInput label="Telefone 2" name="telefone2" placeholder="(XX) XXXX-XXXX" maxLength={14} onChange={aplicarMascaraTelefone} />

                        </div>
                    </div>


                    {/* ============================================== */}
                    {/* SEÇÃO 3: ENDEREÇO                             */}
                    {/* ============================================== */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Endereço</h2>
                        <div className="space-y-4">

                            <div className="flex items-end gap-4">
                                <div className="max-w-xs">
                                    <CampoInput label="CEP" name="cep" placeholder="00000-000" maxLength={9} onChange={aplicarMascaraCEP} onBlur={buscarEnderecoPorCEP} />
                                </div>
                                {buscandoCEP && <span className="text-sm text-gray-500 pb-2">Buscando...</span>}
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <CampoInput label="Endereço" name="endereco" placeholder="Rua, Avenida..." value={dadosEndereco.logradouro} onChange={handleEnderecoChange} />
                                </div>
                                <CampoInput label="Número" name="numero" placeholder="123" />
                            </div>

                            <CampoInput label="Complemento" name="complemento" placeholder="Apto, Bloco..." />

                            <div className="grid md:grid-cols-3 gap-4">
                                <CampoInput label="Bairro" name="bairro" placeholder="Bairro" value={dadosEndereco.bairro} onChange={handleEnderecoChange} />
                                <CampoInput label="Cidade" name="cidade" placeholder="Cidade" value={dadosEndereco.cidade} onChange={handleEnderecoChange} />
                                <CampoSelect label="Estado" name="estado" placeholder="Selecione" opcoes={OPCOES_ESTADOS} value={dadosEndereco.estado} onValueChange={(valor: string) => setDadosEndereco(prev => ({ ...prev, estado: valor }))} />
                            </div>

                        </div>
                    </div>


                    {/* ============================================== */}
                    {/* SEÇÃO 4: INFORMAÇÕES MÉDICAS                  */}
                    {/* ============================================== */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Médicas</h2>
                        <div className="space-y-4">

                            <div className="grid md:grid-cols-4 gap-4">
                                <CampoSelect label="Tipo Sanguíneo" name="tipoSanguineo" placeholder="Selecione" opcoes={OPCOES_TIPO_SANGUINEO} />
                                <div>
                                    <Label htmlFor="peso" className="text-sm font-medium text-gray-700">Peso</Label>
                                    <div className="relative mt-1">
                                        <Input id="peso" name="peso" type="number" placeholder="70" step="0.1" onChange={handlePesoAlturaChange} />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="altura" className="text-sm font-medium text-gray-700">Altura</Label>
                                    <div className="relative mt-1">
                                        <Input id="altura" name="altura" type="number" step="0.01" placeholder="1.70" onChange={handlePesoAlturaChange} />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">m</span>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="imc" className="text-sm font-medium text-gray-700">IMC</Label>
                                    <div className="relative mt-1">
                                        <Input id="imc" name="imc" placeholder="Automático" disabled value={dadosMedicos.imc} />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">kg/m²</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="alergias" className="text-sm font-medium text-gray-700">Alergias</Label>
                                <Textarea id="alergias" name="alergias" placeholder="Ex: AAS, Dipirona, etc." className="min-h-[80px] mt-1" />
                            </div>

                        </div>
                    </div>


                    {/* ============================================== */}
                    {/* SEÇÃO 5: INFORMAÇÕES DE CONVÊNIO              */}
                    {/* ============================================== */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações de Convênio</h2>
                        <div className="space-y-4">

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoSelect label="Convênio" name="convenio" placeholder="Selecione" opcoes={OPCOES_CONVENIO} />
                                <CampoInput label="Plano" name="plano" placeholder="Nome do plano" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <CampoInput label="Nº de Matrícula" name="numeroMatricula" placeholder="Número da matrícula" />
                                <CampoInput label="Validade da Carteira" name="validadeCarteira" type="date" disabled={dadosConvenio.validadeIndeterminada} min={new Date().toISOString().split("T")[0]} max="9999-12-31" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="validadeIndeterminada" name="validadeIndeterminada" checked={dadosConvenio.validadeIndeterminada} onCheckedChange={handleValidadeIndeterminadaChange} />
                                <Label htmlFor="validadeIndeterminada" className="text-sm text-gray-700 cursor-pointer">Validade Indeterminada</Label>
                            </div>

                        </div>
                    </div>


                    {/* ============================================== */}
                    {/* BOTÕES DE AÇÃO DO FORMULÁRIO                  */}
                    {/* ============================================== */}
                    <div className="flex justify-end gap-4">
                        <Link href="/secretary/pacientes">
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </Link>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar Paciente"}
                        </Button>
                    </div>

                </form>
            </div>
        </SecretaryLayout>
    );
}