/*********************************************
 * 🧠 COMPONENTE: EditarPacientePage (Refatorado)
 *
 * O QUE FAZ: Permite a edição completa das informações
 * de um paciente existente.
 *
 * ESTRUTURA DESTE ARQUIVO:
 * 1. IMPORTAÇÕES: Todas as dependências necessárias.
 * 2. CONSTANTES E TIPOS: Listas de opções para selects e tipos de dados.
 * 3. SERVIÇOS DE API: Um objeto que centraliza toda a comunicação com o backend.
 * 4. ADAPTADORES DE DADOS: Funções que convertem dados entre o formato da API e do formulário.
 * 5. LÓGICA DE ESTADO (REDUCER): Gerenciamento do estado complexo do formulário.
 * 6. SUB-COMPONENTES LOCAIS: Componentes menores e reutilizáveis para a UI.
 * 7. COMPONENTE PRINCIPAL: O componente `EditarPacientePage` que orquestra tudo.
 *
 *********************************************/

"use client";

// --- 1. IMPORTAÇÕES ---
import type React from "react";
import { useState, useEffect, useRef, useReducer, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2, Paperclip, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SecretaryLayout from "@/components/secretary-layout";


// --- 2. CONSTANTES E TIPOS ---

// [DADO]: Listas de opções para os campos de seleção (Select).
const OPCOES_ESTADOS = [ { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, { value: "AP", label: "Amapá" }, { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" }, { value: "CE", label: "Ceará" }, { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" }, { value: "GO", label: "Goiás" }, { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" }, { value: "MS", label: "Mato Grosso do Sul" }, { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" }, { value: "PB", label: "Paraíba" }, { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" }, { value: "PI", label: "Piauí" }, { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" }, { value: "RS", label: "Rio Grande do Sul" }, { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" }, { value: "SC", label: "Santa Catarina" }, { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" }, { value: "TO", label: "Tocantins" } ];
const OPCOES_ETNIA = [ { value: "branca", label: "Branca" }, { value: "preta", label: "Preta" }, { value: "parda", label: "Parda" }, { value: "amarela", label: "Amarela" }, { value: "indigena", label: "Indígena" } ];
const OPCOES_ESTADO_CIVIL = [ { value: "solteiro", label: "Solteiro(a)" }, { value: "casado", label: "Casado(a)" }, { value: "divorciado", label: "Divorciado(a)" }, { value: "viuvo", label: "Viúvo(a)" } ];
const OPCOES_TIPO_SANGUINEO = [ { value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" } ];
const OPCOES_CONVENIO = [ { value: "Particular", label: "Particular" }, { value: "SUS", label: "SUS" }, { value: "Unimed", label: "Unimed" }, { value: "Bradesco", label: "Bradesco Saúde" }, { value: "Amil", label: "Amil" } ];


// --- 3. SERVIÇOS DE API ---

// #################################################################################
// # 👇 OBJETIVO: Centralizar todas as chamadas de rede (API) em um só lugar. 👇 #
// # Isso organiza o código e facilita a manutenção.                             #
// #################################################################################
// [LÓGICA]: Agrupa todas as chamadas `fetch` em um único objeto para organizar a comunicação com o backend.
const apiService = {
    //-> Busca os dados principais de um paciente específico.
    fetchPatientData: async (patientId: string) => {
        const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}`);
        if (!res.ok) throw new Error(`Falha ao carregar dados do paciente (HTTP ${res.status})`);
        return res.json();
    },

    //-> Busca a lista de arquivos anexados de um paciente.
    fetchAnexosData: async (patientId: string) => {
        const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos`);
        if (!res.ok) throw new Error(`Falha ao carregar anexos (HTTP ${res.status})`);
        return res.json();
    },

    //-> Envia os dados atualizados do formulário para salvar no servidor.
    updatePatientData: async (patientId: string, payload: any) => {
        const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Falha ao atualizar paciente (HTTP ${res.status})`);
        return res.json();
    },

    //-> Envia um arquivo (como foto ou anexo) para o servidor.
    uploadFile: async (url: string, formData: FormData) => {
        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) throw new Error(`Falha no upload do arquivo (HTTP ${res.status})`);
        return res.json();
    },

    //-> Solicita a remoção de um arquivo no servidor.
    deleteFile: async (url: string) => {
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error(`Falha ao remover arquivo (HTTP ${res.status})`);
    },

    //-> Consulta uma API externa para buscar um endereço a partir de um CEP.
    lookupCepInApi: async (cep: string) => {
        const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/utils/cep/${cep}`);
        if (!res.ok) throw new Error("CEP não encontrado");
        const data = await res.json();
        if (data.erro) throw new Error("CEP inválido");
        return data;
    }
};


// --- 4. ADAPTADORES DE DADOS ---

// #################################################################################
// # 👇 OBJETIVO: Traduzir os dados que vêm da API para o formato do formulário. 👇 #
// # A API pode usar nomes como "data_nascimento", e o formulário usa "dataNascimento". #
// # Esta função faz essa "tradução" para tudo funcionar corretamente.            #
// #################################################################################
// [LÓGICA]: Converte os dados da API (com snake_case e objetos aninhados) para o formato do nosso formulário (plano e camelCase).
const adaptApiDataToFormState = (apiData: any) => {
    const p = apiData?.data || apiData; //-> Garante que pegamos os dados, mesmo que venham dentro de um objeto "data".
    return {
        nome: p?.nome ?? "",
        cpf: p?.cpf ?? "",
        rg: p?.rg ?? "",
        sexo: p?.sexo ?? "",
        dataNascimento: p?.data_nascimento ?? p?.dataNascimento ?? "",
        etnia: p?.etnia ?? "",
        raca: p?.raca ?? "",
        naturalidade: p?.naturalidade ?? "",
        nacionalidade: p?.nacionalidade ?? "",
        profissao: p?.profissao ?? "",
        estadoCivil: p?.estado_civil ?? p?.estadoCivil ?? "",
        nomeMae: p?.nome_mae ?? p?.nomeMae ?? "",
        profissaoMae: p?.profissao_mae ?? p?.profissaoMae ?? "",
        nomePai: p?.nome_pai ?? p?.nomePai ?? "",
        profissaoPai: p?.profissao_pai ?? p?.profissaoPai ?? "",
        nomeResponsavel: p?.nome_responsavel ?? p?.nomeResponsavel ?? "",
        cpfResponsavel: p?.cpf_responsavel ?? p?.cpfResponsavel ?? "",
        nomeEsposo: p?.nome_esposo ?? p?.nomeEsposo ?? "",
        email: p?.contato?.email ?? p?.email ?? "",
        celular: p?.contato?.celular ?? p?.celular ?? "",
        telefone1: p?.contato?.telefone1 ?? p?.telefone1 ?? "",
        telefone2: p?.contato?.telefone2 ?? p?.telefone2 ?? "",
        cep: p?.endereco?.cep ?? p?.cep ?? "",
        endereco: p?.endereco?.logradouro ?? p?.endereco ?? "",
        numero: p?.endereco?.numero ?? p?.numero ?? "",
        complemento: p?.endereco?.complemento ?? p?.complemento ?? "",
        bairro: p?.endereco?.bairro ?? p?.bairro ?? "",
        cidade: p?.endereco?.cidade ?? p?.cidade ?? "",
        estado: p?.endereco?.estado ?? p?.estado ?? "",
        tipoSanguineo: p?.tipo_sanguineo ?? p?.tipoSanguineo ?? "",
        peso: p?.peso ? String(p.peso) : "",
        altura: p?.altura ? String(p.altura) : "",
        alergias: p?.alergias ?? "",
        convenio: p?.convenio ?? "",
        plano: p?.plano ?? "",
        numeroMatricula: p?.numero_matricula ?? p?.numeroMatricula ?? "",
        validadeCarteira: p?.validade_carteira ?? p?.validadeCarteira ?? "",
        observacoes: p?.observacoes ?? "",
    };
};


// #################################################################################
// # 👇 OBJETIVO: Fazer o caminho inverso: traduzir os dados do formulário.     👇 #
// # Pega os dados do nosso formulário (ex: "dataNascimento") e converte para o  #
// # formato que a API espera (ex: "data_nascimento"), antes de enviar.          #
// #################################################################################
// [LÓGICA]: Faz o caminho inverso: converte os dados do formulário para o formato que a API espera.
const adaptFormStateToApiPayload = (formState: any) => ({
    nome: formState.nome,
    cpf: formState.cpf,
    rg: formState.rg || null, //-> Se o campo estiver vazio, envia 'null' para a API.
    sexo: formState.sexo || null,
    data_nascimento: formState.dataNascimento || null,
    etnia: formState.etnia || null,
    raca: formState.raca || null,
    naturalidade: formState.naturalidade || null,
    nacionalidade: formState.nacionalidade || null,
    profissao: formState.profissao || null,
    estado_civil: formState.estadoCivil || null,
    nome_mae: formState.nomeMae || null,
    profissao_mae: formState.profissaoMae || null,
    nome_pai: formState.nomePai || null,
    profissao_pai: formState.profissaoPai || null,
    nome_responsavel: formState.nomeResponsavel || null,
    cpf_responsavel: formState.cpfResponsavel || null,
    contato: { //-> Agrupa os campos de contato em um objeto, como a API espera.
        email: formState.email || null,
        celular: formState.celular || null,
        telefone1: formState.telefone1 || null,
        telefone2: formState.telefone2 || null,
    },
    endereco: { //-> Agrupa os campos de endereço em um objeto.
        cep: formState.cep || null,
        logradouro: formState.endereco || null,
        numero: formState.numero || null,
        complemento: formState.complemento || null,
        bairro: formState.bairro || null,
        cidade: formState.cidade || null,
        estado: formState.estado || null,
    },
    observacoes: formState.observacoes || null,
    convenio: formState.convenio || null,
    plano: formState.plano || null,
    numero_matricula: formState.numeroMatricula || null,
    validade_carteira: formState.validadeCarteira || null,
});


// --- 5. LÓGICA DE ESTADO (REDUCER) ---

//-> Define o estado inicial do formulário, com todos os campos vazios.
const initialState = { nome: "", cpf: "", rg: "", sexo: "", dataNascimento: "", etnia: "", raca: "", naturalidade: "", nacionalidade: "", profissao: "", estadoCivil: "", nomeMae: "", profissaoMae: "", nomePai: "", profissaoPai: "", nomeResponsavel: "", cpfResponsavel: "", nomeEsposo: "", email: "", celular: "", telefone1: "", telefone2: "", cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", tipoSanguineo: "", peso: "", altura: "", alergias: "", convenio: "", plano: "", numeroMatricula: "", validadeCarteira: "", observacoes: "" };


// #################################################################################
// # 👇 OBJETIVO: Gerenciar todas as atualizações de estado do formulário.      👇 #
// # Em vez de ter vários `useState`, usamos um `reducer` para lidar com todas   #
// # as mudanças de forma organizada, baseado no tipo de "ação" que acontece.   #
// #################################################################################
function formReducer(state: typeof initialState, action: any) {
    switch (action.type) {
        //-> Ação para preencher o formulário com os dados iniciais vindos da API.
        case 'SET_INITIAL_DATA':
            return { ...state, ...action.payload };

        //-> Ação para atualizar um único campo do formulário quando o usuário digita.
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };

        //-> Ação para preencher os campos de endereço após a consulta do CEP.
        case 'SET_ADDRESS_FROM_CEP':
            const d = action.payload?.data || action.payload;
            return {
                ...state,
                endereco: d?.logradouro ?? state.endereco,
                bairro: d?.bairro ?? state.bairro,
                cidade: d?.localidade ?? d?.cidade ?? state.cidade,
                estado: d?.uf ?? d?.estado ?? state.estado,
                complemento: d?.complemento ?? state.complemento,
            };

        //-> Caso padrão: se a ação não for reconhecida, retorna o estado sem modificação.
        default:
            return state;
    }
}


// --- 6. SUB-COMPONENTES LOCAIS ---

// #################################################################################
// # 👇 OBJETIVO: Criar o cabeçalho da página com título e botão de voltar.     👇 #
// #################################################################################
const PageHeader = ({ patientName }: { patientName: string }) => (
    <div className="flex items-center gap-4">
        <Link href="/secretary/pacientes">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Paciente</h1>
            <p className="text-gray-600">Atualize as informações de: <span className="font-semibold">{patientName || "Carregando..."}</span></p>
        </div>
    </div>
);


// #################################################################################
// # 👇 OBJETIVO: Criar um "card" branco com título para agrupar campos.        👇 #
// # Ex: "Dados Pessoais", "Contato", "Endereço".                                #
// #################################################################################
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
        {children}
    </div>
);


// #################################################################################
// # 👇 OBJETIVO: Um componente simples para padronizar o espaçamento de cada   👇 #
// # campo de formulário (Label + Input).                                        #
// #################################################################################
const FormField = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-2">{children}</div>
);


// #################################################################################
// # 👇 OBJETIVO: Gerenciar a lógica da foto do paciente (visualizar, enviar e remover). 👇 #
// # Este componente cuida de tudo relacionado à foto, de forma isolada.         #
// #################################################################################
const PatientPhotoManager = ({ patientId, initialPhotoUrl, toast }: { patientId: string, initialPhotoUrl: string | null, toast: any }) => {
    const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    //-> Atualiza a foto se a URL inicial mudar (quando os dados do paciente carregam).
    useEffect(() => { setPhotoUrl(initialPhotoUrl); }, [initialPhotoUrl]);

    //-> Função chamada quando o usuário seleciona um arquivo de foto.
    const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return; //-> Se nenhum arquivo for selecionado, não faz nada.

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("foto", file);
            const url = `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/foto`;
            const result = await apiService.uploadFile(url, formData);
            const newPhotoUrl = result?.data?.foto_url || result?.foto_url || result?.url;
            if (newPhotoUrl) setPhotoUrl(newPhotoUrl); //-> Atualiza a imagem na tela.
            toast({ title: "Sucesso", description: "Foto enviada com sucesso" });
        } catch (err: any) {
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        } finally {
            setIsUploading(false); //-> Libera o botão de upload.
            if (fileInputRef.current) fileInputRef.current.value = ""; //-> Limpa o input de arquivo.
        }
    };

    //-> Função chamada quando o usuário clica em "Remover".
    const handleRemovePhoto = async () => {
        try {
            const url = `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/foto`;
            await apiService.deleteFile(url);
            setPhotoUrl(null); //-> Remove a imagem da tela.
            toast({ title: "Sucesso", description: "Foto removida" });
        } catch (err: any) {
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        }
    };

    return (
        <FormField>
            <Label>Foto do paciente</Label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    {photoUrl ? <img src={photoUrl} alt="Foto do paciente" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm">Sem foto</span>}
                </div>
                <div className="flex gap-2">
                    {/* -> Este input está escondido, o botão abaixo que o aciona. */}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelected} />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>{isUploading ? "Enviando..." : "Enviar foto"}</Button>
                    {photoUrl && <Button type="button" variant="ghost" onClick={handleRemovePhoto} disabled={isUploading}>Remover</Button>}
                </div>
            </div>
        </FormField>
    );
};


// #################################################################################
// # 👇 OBJETIVO: Gerenciar a seção de anexos (listar, adicionar e remover).    👇 #
// # Este componente busca os anexos existentes e permite ao usuário gerenciar   #
// # essa lista, de forma independente do resto do formulário.                   #
// #################################################################################
const AttachmentsSection = ({ patientId, toast }: { patientId: string, toast: any }) => {
    const [anexos, setAnexos] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const anexoInputRef = useRef<HTMLInputElement | null>(null);

    //-> Efeito que carrega a lista de anexos quando o componente é montado.
    useEffect(() => {
        const loadAnexos = async () => {
            try {
                const result = await apiService.fetchAnexosData(patientId);
                setAnexos(Array.isArray(result?.data) ? result.data : []);
            } catch (err) {
                // Silently fail or show a non-blocking error
            }
        };
        loadAnexos();
    }, [patientId]);

    //-> Função chamada quando o usuário seleciona um arquivo para anexar.
    const handleAnexoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("anexo", file);
            const url = `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos`;
            await apiService.uploadFile(url, formData);
            const refreshedAnexos = await apiService.fetchAnexosData(patientId); //-> Após o upload, busca a lista atualizada.
            setAnexos(Array.isArray(refreshedAnexos?.data) ? refreshedAnexos.data : []);
            toast({ title: "Sucesso", description: "Anexo adicionado" });
        } catch (err: any) {
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
            if (anexoInputRef.current) anexoInputRef.current.value = "";
        }
    };

    //-> Função chamada quando o usuário clica para remover um anexo.
    const handleDeleteAnexo = async (anexoId: string | number) => {
        try {
            const url = `https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos/${anexoId}`;
            await apiService.deleteFile(url);
            setAnexos((prev) => prev.filter((a) => String(a.id) !== String(anexoId))); //-> Remove o anexo da lista na tela.
            toast({ title: "Sucesso", description: "Anexo removido" });
        } catch (err: any) {
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        }
    };

    return (
        <FormSection title="Anexos">
            <div className="flex items-center gap-3 mb-4">
                <input ref={anexoInputRef} type="file" className="hidden" onChange={handleAnexoSelected} />
                <Button type="button" variant="outline" onClick={() => anexoInputRef.current?.click()} disabled={isUploading}>
                    <Paperclip className="w-4 h-4 mr-2" /> {isUploading ? "Enviando..." : "Adicionar anexo"}
                </Button>
            </div>
            {anexos.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum anexo encontrado.</p>
            ) : (
                <ul className="divide-y">
                    {anexos.map((a) => (
                        <li key={a.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="text-sm text-gray-800 truncate">{a.nome || a.filename || `Anexo ${a.id}`}</span>
                            </div>
                            <Button type="button" variant="ghost" className="text-red-600" onClick={() => handleDeleteAnexo(a.id)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Remover
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </FormSection>
    );
};


// --- 7. COMPONENTE PRINCIPAL ---
export default function EditarPacientePage() {
    
    // #################################################################################
    // # 👇 OBJETIVO: Inicializar os "cérebros" do componente.                      👇 #
    // # Aqui pegamos ferramentas do Next.js (router, params), o sistema de        #
    // # notificações (toast) e configuramos o estado do formulário.               #
    // #################################################################################
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const patientId = params.id as string; //-> Pega o ID do paciente da URL da página.

    const [formState, dispatch] = useReducer(formReducer, initialState);
    const [initialPhotoUrl, setInitialPhotoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); //-> Controla se a página está carregando dados ou salvando.


    // #################################################################################
    // # 👇 OBJETIVO: Buscar os dados do paciente na API assim que a página carregar. 👇 #
    // # Este bloco `useEffect` roda apenas uma vez para preencher o formulário com  #
    // # as informações do paciente que será editado.                                #
    // #################################################################################
    useEffect(() => {
        if (!patientId) return; //-> Se não houver ID na URL, não faz nada.

        const loadPatient = async () => {
            setIsLoading(true); //-> Mostra o indicador de "carregando".
            try {
                const apiData = await apiService.fetchPatientData(patientId);
                const adaptedData = adaptApiDataToFormState(apiData); //-> "Traduz" os dados da API.
                dispatch({ type: 'SET_INITIAL_DATA', payload: adaptedData }); //-> Preenche o formulário.
                setInitialPhotoUrl(apiData?.data?.foto_url || apiData?.foto_url || null); //-> Define a foto inicial.
            } catch (err: any) {
                toast({ title: "Erro", description: err.message, variant: "destructive" });
            } finally {
                setIsLoading(false); //-> Esconde o indicador de "carregando".
            }
        };

        loadPatient();
    }, [patientId, toast]);


    // #################################################################################
    // # 👇 OBJETIVO: Funções que reagem a ações do usuário no formulário.          👇 #
    // # Cada função aqui é responsável por uma interação específica, como digitar   #
    // # em um campo, selecionar uma opção ou preencher o CEP.                       #
    // #################################################################################
    
    //-> Chamada sempre que o usuário digita em um campo de texto.
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: 'UPDATE_FIELD', field: e.target.name, value: e.target.value });
    };

    //-> Chamada quando o usuário seleciona uma opção em um campo <Select>.
    const handleSelectChange = (field: string, value: string) => {
        dispatch({ type: 'UPDATE_FIELD', field, value });
    };

    //-> Chamada quando o usuário sai do campo CEP para buscar o endereço.
    const handleCepLookup = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value?.replace(/\D/g, ""); //-> Remove tudo que não for número do CEP.
        if (cep?.length !== 8) return; //-> Se o CEP não tiver 8 dígitos, não faz a busca.

        try {
            const cepData = await apiService.lookupCepInApi(cep);
            dispatch({ type: 'SET_ADDRESS_FROM_CEP', payload: cepData }); //-> Preenche os campos de endereço.
        } catch (err: any) {
            toast({ title: "Erro no CEP", description: err.message, variant: "destructive" });
        }
    };


    // #################################################################################
    // # 👇 OBJETIVO: Calcular o IMC automaticamente sem sobrecarregar o componente. 👇 #
    // # `useMemo` garante que o cálculo só é refeito se o peso ou a altura mudarem, #
    // # melhorando a performance.                                                   #
    // #################################################################################
    const imcCalculado = useMemo(() => {
        const peso = parseFloat(formState.peso);
        const altura = parseFloat(formState.altura);
        if (peso > 0 && altura > 0) return (peso / (altura * altura)).toFixed(2);
        return "";
    }, [formState.peso, formState.altura]);


    // #################################################################################
    // # 👇 OBJETIVO: Enviar os dados do formulário para a API quando for salvo.    👇 #
    // # Esta função é o coração da ação de "Salvar Alterações".                     #
    // #################################################################################
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //-> Impede que a página recarregue ao enviar o formulário.
        setIsLoading(true);

        try {
            const payload = adaptFormStateToApiPayload(formState); //-> "Traduz" os dados do formulário para a API.
            await apiService.updatePatientData(patientId, payload);
            toast({ title: "Sucesso", description: "Paciente atualizado com sucesso" });
            router.push("/secretary/pacientes"); //-> Redireciona o usuário de volta para a lista de pacientes.
        } catch (err: any) {
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };


    // #################################################################################
    // # 👇 OBJETIVO: Mostrar uma mensagem de "Carregando" enquanto os dados iniciais 👇 #
    // # do paciente ainda não foram buscados na API.                                #
    // #################################################################################
    if (isLoading && !formState.nome) {
        return <SecretaryLayout><div className="p-6">Carregando dados do paciente...</div></SecretaryLayout>;
    }


    // #################################################################################
    // # 👇 OBJETIVO: Renderizar a estrutura visual da página de edição.            👇 #
    // # Aqui montamos o formulário completo, usando os sub-componentes que criamos. #
    // #################################################################################
    return (
        <SecretaryLayout>
            <div className="space-y-6">
                <PageHeader patientName={formState.nome} />

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <FormSection title="Dados Pessoais">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PatientPhotoManager patientId={patientId} initialPhotoUrl={initialPhotoUrl} toast={toast} />
                            <FormField><Label htmlFor="nome">Nome *</Label><Input id="nome" name="nome" value={formState.nome} onChange={handleFieldChange} required /></FormField>
                            <FormField><Label htmlFor="cpf">CPF *</Label><Input id="cpf" name="cpf" value={formState.cpf} onChange={handleFieldChange} placeholder="000.000.000-00" required /></FormField>
                            <FormField><Label htmlFor="rg">RG</Label><Input id="rg" name="rg" value={formState.rg} onChange={handleFieldChange} placeholder="00.000.000-0" /></FormField>
                            <FormField>
                                <Label>Sexo *</Label>
                                <div className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2"><input type="radio" id="masculino" name="sexo" value="masculino" checked={formState.sexo === "masculino"} onChange={handleFieldChange} className="w-4 h-4 text-blue-600" /><Label htmlFor="masculino">Masculino</Label></div>
                                    <div className="flex items-center space-x-2"><input type="radio" id="feminino" name="sexo" value="feminino" checked={formState.sexo === "feminino"} onChange={handleFieldChange} className="w-4 h-4 text-blue-600" /><Label htmlFor="feminino">Feminino</Label></div>
                                </div>
                            </FormField>
                            <FormField><Label htmlFor="dataNascimento">Data de nascimento *</Label><Input id="dataNascimento" name="dataNascimento" type="date" value={formState.dataNascimento} onChange={handleFieldChange} required /></FormField>
                            <FormField><Label htmlFor="etnia">Etnia</Label><Select name="etnia" value={formState.etnia} onValueChange={(v) => handleSelectChange("etnia", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{OPCOES_ETNIA.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></FormField>
                            {/* ... (outros campos de dados pessoais) ... */}
                        </div>
                    </FormSection>

                    <FormSection title="Contato">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FormField><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" value={formState.email} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="celular">Celular</Label><Input id="celular" name="celular" value={formState.celular} onChange={handleFieldChange} placeholder="(00) 00000-0000" /></FormField>
                            <FormField><Label htmlFor="telefone1">Telefone 1</Label><Input id="telefone1" name="telefone1" value={formState.telefone1} onChange={handleFieldChange} placeholder="(00) 0000-0000" /></FormField>
                            <FormField><Label htmlFor="telefone2">Telefone 2</Label><Input id="telefone2" name="telefone2" value={formState.telefone2} onChange={handleFieldChange} placeholder="(00) 0000-0000" /></FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Endereço">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField><Label htmlFor="cep">CEP</Label><Input id="cep" name="cep" value={formState.cep} onChange={handleFieldChange} onBlur={handleCepLookup} placeholder="00000-000" /></FormField>
                            <FormField><Label htmlFor="endereco">Endereço</Label><Input id="endereco" name="endereco" value={formState.endereco} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="numero">Número</Label><Input id="numero" name="numero" value={formState.numero} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="complemento">Complemento</Label><Input id="complemento" name="complemento" value={formState.complemento} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" value={formState.bairro} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="cidade">Cidade</Label><Input id="cidade" name="cidade" value={formState.cidade} onChange={handleFieldChange} /></FormField>
                            <FormField><Label htmlFor="estado">Estado</Label><Select name="estado" value={formState.estado} onValueChange={(v) => handleSelectChange("estado", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{OPCOES_ESTADOS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Informações Médicas">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FormField><Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label><Select name="tipoSanguineo" value={formState.tipoSanguineo} onValueChange={(v) => handleSelectChange("tipoSanguineo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{OPCOES_TIPO_SANGUINEO.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></FormField>
                            <FormField><Label htmlFor="peso">Peso (kg)</Label><Input id="peso" name="peso" type="number" value={formState.peso} onChange={handleFieldChange} placeholder="0.0" /></FormField>
                            <FormField><Label htmlFor="altura">Altura (m)</Label><Input id="altura" name="altura" type="number" step="0.01" value={formState.altura} onChange={handleFieldChange} placeholder="0.00" /></FormField>
                            <FormField><Label>IMC</Label><Input value={imcCalculado} disabled placeholder="Automático" /></FormField>
                        </div>
                        <div className="mt-6"><FormField><Label htmlFor="alergias">Alergias</Label><Textarea id="alergias" name="alergias" value={formState.alergias} onChange={handleFieldChange} placeholder="Ex: AAS, Dipirona, etc." className="mt-2" /></FormField></div>
                    </FormSection>

                    <AttachmentsSection patientId={patientId} toast={toast} />

                    <div className="flex justify-end gap-4">
                        <Link href="/secretary/pacientes"><Button type="button" variant="outline">Cancelar</Button></Link>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}><Save className="w-4 h-4 mr-2" />{isLoading ? "Salvando..." : "Salvar Alterações"}</Button>
                    </div>
                </form>
            </div>
        </SecretaryLayout>
    );
}