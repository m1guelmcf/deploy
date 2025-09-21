"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2, Paperclip, Upload } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import SecretaryLayout from "@/components/secretary-layout";

// Mock data - in a real app, this would come from an API
const mockPatients = [
    {
        id: 1,
        nome: "Aaron Avalos Perez",
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        sexo: "masculino",
        dataNascimento: "1990-01-15",
        etnia: "branca",
        raca: "caucasiana",
        naturalidade: "Aracaju",
        nacionalidade: "brasileira",
        profissao: "Engenheiro",
        estadoCivil: "solteiro",
        nomeMae: "Maria Perez",
        profissaoMae: "Professora",
        nomePai: "João Perez",
        profissaoPai: "Médico",
        nomeResponsavel: "",
        cpfResponsavel: "",
        nomeEsposo: "",
        email: "aaron@email.com",
        celular: "(79) 99943-2499",
        telefone1: "(79) 3214-5678",
        telefone2: "",
        cep: "49000-000",
        endereco: "Rua das Flores, 123",
        numero: "123",
        complemento: "Apt 101",
        bairro: "Centro",
        cidade: "Aracaju",
        estado: "SE",
        tipoSanguineo: "O+",
        peso: "75",
        altura: "1.75",
        alergias: "Nenhuma alergia conhecida",
        convenio: "Particular",
        plano: "Premium",
        numeroMatricula: "123456789",
        validadeCarteira: "2025-12-31",
        observacoes: "Paciente colaborativo",
    },
];

export default function EditarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const patientId = Number.parseInt(params.id as string);
    const { toast } = useToast();

    // Photo upload state
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    // Anexos state
    const [anexos, setAnexos] = useState<any[]>([]);
    const [isUploadingAnexo, setIsUploadingAnexo] = useState(false);
    const anexoInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        rg: "",
        sexo: "",
        dataNascimento: "",
        etnia: "",
        raca: "",
        naturalidade: "",
        nacionalidade: "",
        profissao: "",
        estadoCivil: "",
        nomeMae: "",
        profissaoMae: "",
        nomePai: "",
        profissaoPai: "",
        nomeResponsavel: "",
        cpfResponsavel: "",
        nomeEsposo: "",
        email: "",
        celular: "",
        telefone1: "",
        telefone2: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        tipoSanguineo: "",
        peso: "",
        altura: "",
        alergias: "",
        convenio: "",
        plano: "",
        numeroMatricula: "",
        validadeCarteira: "",
        observacoes: "",
    });

    const [isGuiaConvenio, setIsGuiaConvenio] = useState(false);
    const [validadeIndeterminada, setValidadeIndeterminada] = useState(false);

    useEffect(() => {
        async function fetchPatient() {
            try {
                const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const p = json?.data || json;
                // Map API snake_case/nested to local camelCase form
                setFormData({
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
                });
                const foto = p?.foto_url || p?.fotoUrl;
                if (foto) setPhotoUrl(foto);
            } catch (e: any) {
                toast({ title: "Erro", description: e?.message || "Falha ao carregar paciente" });
            }
        }
        async function fetchAnexos() {
            try {
                const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos`);
                if (!res.ok) return;
                const json = await res.json();
                const items = Array.isArray(json?.data) ? json.data : json;
                setAnexos(Array.isArray(items) ? items : []);
            } catch {}
        }
        fetchPatient();
        fetchAnexos();
    }, [patientId, toast]);

    const onPickPhoto = () => fileInputRef.current?.click();

    const onPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingPhoto(true);
            const form = new FormData();
            // Common field name: 'foto'; also append 'file' for compatibility with some mocks
            form.append("foto", file);
            form.append("file", file);

            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/foto`, {
                method: "POST",
                body: form,
            });
            if (!res.ok) {
                throw new Error(`Falha no upload (HTTP ${res.status})`);
            }
            let msg = "Foto enviada com sucesso";
            try {
                const payload = await res.json();
                if (payload?.success === false) {
                    throw new Error(payload?.message || "A API retornou erro");
                }
                if (payload?.message) msg = String(payload.message);
                if (payload?.data?.foto_url || payload?.foto_url || payload?.url) {
                    setPhotoUrl(payload.data?.foto_url ?? payload.foto_url ?? payload.url);
                }
            } catch {
                // Ignore JSON parse errors
            }
            toast({ title: "Sucesso", description: msg });
        } catch (err: any) {
            toast({ title: "Erro", description: err?.message || "Não foi possível enviar a foto" });
        } finally {
            setIsUploadingPhoto(false);
            // clear the input to allow re-selecting the same file
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Remove patient photo via API
    const onRemovePhoto = async () => {
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/foto`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`Falha ao remover foto (HTTP ${res.status})`);
            setPhotoUrl(null);
            toast({ title: "Sucesso", description: "Foto removida" });
        } catch (err: any) {
            toast({ title: "Erro", description: err?.message || "Não foi possível remover a foto" });
        }
    };

    // Anexos helpers
    const onPickAnexo = () => anexoInputRef.current?.click();

    const onAnexoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingAnexo(true);
            const form = new FormData();
            form.append("anexo", file);
            form.append("file", file);
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos`, {
                method: "POST",
                body: form,
            });
            if (!res.ok) throw new Error(`Falha ao enviar anexo (HTTP ${res.status})`);
            // Refresh anexos list
            try {
                const refreshed = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos`);
                const json = await refreshed.json();
                const items = Array.isArray(json?.data) ? json.data : json;
                setAnexos(Array.isArray(items) ? items : []);
            } catch {}
            toast({ title: "Sucesso", description: "Anexo adicionado" });
        } catch (err: any) {
            toast({ title: "Erro", description: err?.message || "Não foi possível enviar o anexo" });
        } finally {
            setIsUploadingAnexo(false);
            if (anexoInputRef.current) anexoInputRef.current.value = "";
        }
    };

    const onDeleteAnexo = async (anexoId: string | number) => {
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}/anexos/${anexoId}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Falha ao remover anexo (HTTP ${res.status})`);
            setAnexos((prev) => prev.filter((a) => String(a.id) !== String(anexoId)));
            toast({ title: "Sucesso", description: "Anexo removido" });
        } catch (err: any) {
            toast({ title: "Erro", description: err?.message || "Não foi possível remover o anexo" });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Build API payload (snake_case)
        const payload = {
            nome: formData.nome,
            cpf: formData.cpf,
            rg: formData.rg || null,
            sexo: formData.sexo || null,
            data_nascimento: formData.dataNascimento || null,
            etnia: formData.etnia || null,
            raca: formData.raca || null,
            naturalidade: formData.naturalidade || null,
            nacionalidade: formData.nacionalidade || null,
            profissao: formData.profissao || null,
            estado_civil: formData.estadoCivil || null,
            nome_mae: formData.nomeMae || null,
            profissao_mae: formData.profissaoMae || null,
            nome_pai: formData.nomePai || null,
            profissao_pai: formData.profissaoPai || null,
            nome_responsavel: formData.nomeResponsavel || null,
            cpf_responsavel: formData.cpfResponsavel || null,
            contato: {
                email: formData.email || null,
                celular: formData.celular || null,
                telefone1: formData.telefone1 || null,
                telefone2: formData.telefone2 || null,
            },
            endereco: {
                cep: formData.cep || null,
                logradouro: formData.endereco || null,
                numero: formData.numero || null,
                complemento: formData.complemento || null,
                bairro: formData.bairro || null,
                cidade: formData.cidade || null,
                estado: formData.estado || null,
            },
            observacoes: formData.observacoes || null,
            convenio: formData.convenio || null,
            plano: formData.plano || null,
            numero_matricula: formData.numeroMatricula || null,
            validade_carteira: formData.validadeCarteira || null,
        };
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Falha ao atualizar (HTTP ${res.status})`);
            toast({ title: "Sucesso", description: "Paciente atualizado com sucesso" });
            router.push("/pacientes");
        } catch (err: any) {
            toast({ title: "Erro", description: err?.message || "Não foi possível atualizar o paciente" });
        }
    };

    // Validate CPF on blur
    const validateCpf = async (cpf: string) => {
        if (!cpf) return;
        try {
            const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes/validar-cpf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cpf }),
            });
            const json = await res.json();
            if (json?.success === false) {
                throw new Error(json?.message || "CPF inválido");
            }
            if (json?.message) toast({ title: "CPF", description: String(json.message) });
        } catch (err: any) {
            toast({ title: "CPF inválido", description: err?.message || "Falha na validação de CPF" });
        }
    };

    // CEP lookup on blur
    const lookupCep = async (cep: string) => {
        const onlyDigits = cep?.replace(/\D/g, "");
        if (!onlyDigits) return;
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/utils/cep/${onlyDigits}`);
            if (!res.ok) return;
            const data = await res.json();
            const d = data?.data || data;
            setFormData((prev) => ({
                ...prev,
                endereco: d?.logradouro ?? prev.endereco,
                bairro: d?.bairro ?? prev.bairro,
                cidade: d?.localidade ?? d?.cidade ?? prev.cidade,
                estado: d?.uf ?? d?.estado ?? prev.estado,
                complemento: d?.complemento ?? prev.complemento,
            }));
        } catch {}
    };

    return (
        <SecretaryLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/secretary/pacientes">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Paciente</h1>
                        <p className="text-gray-600">Atualize as informações do paciente</p>
                    </div>

                    {/* Anexos Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Anexos</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <input ref={anexoInputRef} type="file" className="hidden" onChange={onAnexoSelected} />
                            <Button type="button" variant="outline" onClick={onPickAnexo} disabled={isUploadingAnexo}>
                                <Paperclip className="w-4 h-4 mr-2" /> {isUploadingAnexo ? "Enviando..." : "Adicionar anexo"}
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
                                        <Button type="button" variant="ghost" className="text-red-600" onClick={() => onDeleteAnexo(a.id)}>
                                            <Trash2 className="w-4 h-4 mr-1" /> Remover
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados Pessoais</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Photo upload */}
                            <div className="space-y-2">
                                <Label>Foto do paciente</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {photoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={photoUrl} alt="Foto do paciente" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-sm">Sem foto</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />
                                        <Button type="button" variant="outline" onClick={onPickPhoto} disabled={isUploadingPhoto}>
                                            {isUploadingPhoto ? "Enviando..." : "Enviar foto"}
                                        </Button>
                                        {photoUrl && (
                                            <Button type="button" variant="ghost" onClick={onRemovePhoto} disabled={isUploadingPhoto}>
                                                Remover
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome *</Label>
                                <Input id="nome" value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF *</Label>
                                <Input id="cpf" value={formData.cpf} onChange={(e) => handleInputChange("cpf", e.target.value)} onBlur={() => validateCpf(formData.cpf)} placeholder="000.000.000-00" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rg">RG</Label>
                                <Input id="rg" value={formData.rg} onChange={(e) => handleInputChange("rg", e.target.value)} placeholder="00.000.000-0" />
                            </div>

                            <div className="space-y-2">
                                <Label>Sexo *</Label>
                                <div className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="masculino" name="sexo" value="masculino" checked={formData.sexo === "masculino"} onChange={(e) => handleInputChange("sexo", e.target.value)} className="w-4 h-4 text-blue-600" />
                                        <Label htmlFor="masculino">Masculino</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="feminino" name="sexo" value="feminino" checked={formData.sexo === "feminino"} onChange={(e) => handleInputChange("sexo", e.target.value)} className="w-4 h-4 text-blue-600" />
                                        <Label htmlFor="feminino">Feminino</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dataNascimento">Data de nascimento *</Label>
                                <Input id="dataNascimento" type="date" value={formData.dataNascimento} onChange={(e) => handleInputChange("dataNascimento", e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="etnia">Etnia</Label>
                                <Select value={formData.etnia} onValueChange={(value) => handleInputChange("etnia", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="branca">Branca</SelectItem>
                                        <SelectItem value="preta">Preta</SelectItem>
                                        <SelectItem value="parda">Parda</SelectItem>
                                        <SelectItem value="amarela">Amarela</SelectItem>
                                        <SelectItem value="indigena">Indígena</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="raca">Raça</Label>
                                <Select value={formData.raca} onValueChange={(value) => handleInputChange("raca", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="caucasiana">Caucasiana</SelectItem>
                                        <SelectItem value="negroide">Negroide</SelectItem>
                                        <SelectItem value="mongoloide">Mongoloide</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="naturalidade">Naturalidade</Label>
                                <Input id="naturalidade" value={formData.naturalidade} onChange={(e) => handleInputChange("naturalidade", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                                <Select value={formData.nacionalidade} onValueChange={(value) => handleInputChange("nacionalidade", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="brasileira">Brasileira</SelectItem>
                                        <SelectItem value="estrangeira">Estrangeira</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profissao">Profissão</Label>
                                <Input id="profissao" value={formData.profissao} onChange={(e) => handleInputChange("profissao", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estadoCivil">Estado civil</Label>
                                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                        <SelectItem value="casado">Casado(a)</SelectItem>
                                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomeMae">Nome da mãe</Label>
                                <Input id="nomeMae" value={formData.nomeMae} onChange={(e) => handleInputChange("nomeMae", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profissaoMae">Profissão da mãe</Label>
                                <Input id="profissaoMae" value={formData.profissaoMae} onChange={(e) => handleInputChange("profissaoMae", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomePai">Nome do pai</Label>
                                <Input id="nomePai" value={formData.nomePai} onChange={(e) => handleInputChange("nomePai", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profissaoPai">Profissão do pai</Label>
                                <Input id="profissaoPai" value={formData.profissaoPai} onChange={(e) => handleInputChange("profissaoPai", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomeResponsavel">Nome do responsável</Label>
                                <Input id="nomeResponsavel" value={formData.nomeResponsavel} onChange={(e) => handleInputChange("nomeResponsavel", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpfResponsavel">CPF do responsável</Label>
                                <Input id="cpfResponsavel" value={formData.cpfResponsavel} onChange={(e) => handleInputChange("cpfResponsavel", e.target.value)} placeholder="000.000.000-00" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nomeEsposo">Nome do esposo(a)</Label>
                                <Input id="nomeEsposo" value={formData.nomeEsposo} onChange={(e) => handleInputChange("nomeEsposo", e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="guiaConvenio" checked={isGuiaConvenio} onCheckedChange={(checked) => setIsGuiaConvenio(checked === true)} />
                                <Label htmlFor="guiaConvenio">RN na Guia do convênio</Label>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea id="observacoes" value={formData.observacoes} onChange={(e) => handleInputChange("observacoes", e.target.value)} placeholder="Digite observações sobre o paciente..." className="mt-2" />
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="celular">Celular</Label>
                                <Input id="celular" value={formData.celular} onChange={(e) => handleInputChange("celular", e.target.value)} placeholder="(00) 00000-0000" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone1">Telefone 1</Label>
                                <Input id="telefone1" value={formData.telefone1} onChange={(e) => handleInputChange("telefone1", e.target.value)} placeholder="(00) 0000-0000" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone2">Telefone 2</Label>
                                <Input id="telefone2" value={formData.telefone2} onChange={(e) => handleInputChange("telefone2", e.target.value)} placeholder="(00) 0000-0000" />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Endereço</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="cep">CEP</Label>
                                <Input id="cep" value={formData.cep} onChange={(e) => handleInputChange("cep", e.target.value)} onBlur={() => lookupCep(formData.cep)} placeholder="00000-000" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input id="endereco" value={formData.endereco} onChange={(e) => handleInputChange("endereco", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="numero">Número</Label>
                                <Input id="numero" value={formData.numero} onChange={(e) => handleInputChange("numero", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="complemento">Complemento</Label>
                                <Input id="complemento" value={formData.complemento} onChange={(e) => handleInputChange("complemento", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bairro">Bairro</Label>
                                <Input id="bairro" value={formData.bairro} onChange={(e) => handleInputChange("bairro", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cidade">Cidade</Label>
                                <Input id="cidade" value={formData.cidade} onChange={(e) => handleInputChange("cidade", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estado">Estado</Label>
                                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AC">Acre</SelectItem>
                                        <SelectItem value="AL">Alagoas</SelectItem>
                                        <SelectItem value="AP">Amapá</SelectItem>
                                        <SelectItem value="AM">Amazonas</SelectItem>
                                        <SelectItem value="BA">Bahia</SelectItem>
                                        <SelectItem value="CE">Ceará</SelectItem>
                                        <SelectItem value="DF">Distrito Federal</SelectItem>
                                        <SelectItem value="ES">Espírito Santo</SelectItem>
                                        <SelectItem value="GO">Goiás</SelectItem>
                                        <SelectItem value="MA">Maranhão</SelectItem>
                                        <SelectItem value="MT">Mato Grosso</SelectItem>
                                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                        <SelectItem value="MG">Minas Gerais</SelectItem>
                                        <SelectItem value="PA">Pará</SelectItem>
                                        <SelectItem value="PB">Paraíba</SelectItem>
                                        <SelectItem value="PR">Paraná</SelectItem>
                                        <SelectItem value="PE">Pernambuco</SelectItem>
                                        <SelectItem value="PI">Piauí</SelectItem>
                                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                        <SelectItem value="RO">Rondônia</SelectItem>
                                        <SelectItem value="RR">Roraima</SelectItem>
                                        <SelectItem value="SC">Santa Catarina</SelectItem>
                                        <SelectItem value="SP">São Paulo</SelectItem>
                                        <SelectItem value="SE">Sergipe</SelectItem>
                                        <SelectItem value="TO">Tocantins</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Médicas</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                                <Select value={formData.tipoSanguineo} onValueChange={(value) => handleInputChange("tipoSanguineo", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="peso">Peso (kg)</Label>
                                <Input id="peso" type="number" value={formData.peso} onChange={(e) => handleInputChange("peso", e.target.value)} placeholder="0.0" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="altura">Altura (m)</Label>
                                <Input id="altura" type="number" step="0.01" value={formData.altura} onChange={(e) => handleInputChange("altura", e.target.value)} placeholder="0.00" />
                            </div>

                            <div className="space-y-2">
                                <Label>IMC</Label>
                                <Input value={formData.peso && formData.altura ? (Number.parseFloat(formData.peso) / Number.parseFloat(formData.altura) ** 2).toFixed(2) : ""} disabled placeholder="Calculado automaticamente" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="alergias">Alergias</Label>
                            <Textarea id="alergias" value={formData.alergias} onChange={(e) => handleInputChange("alergias", e.target.value)} placeholder="Ex: AAS, Dipirona, etc." className="mt-2" />
                        </div>
                    </div>

                    {/* Insurance Information Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações de convênio</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="convenio">Convênio</Label>
                                <Select value={formData.convenio} onValueChange={(value) => handleInputChange("convenio", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="SUS">SUS</SelectItem>
                                        <SelectItem value="Unimed">Unimed</SelectItem>
                                        <SelectItem value="Bradesco">Bradesco Saúde</SelectItem>
                                        <SelectItem value="Amil">Amil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plano">Plano</Label>
                                <Input id="plano" value={formData.plano} onChange={(e) => handleInputChange("plano", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="numeroMatricula">Nº de matrícula</Label>
                                <Input id="numeroMatricula" value={formData.numeroMatricula} onChange={(e) => handleInputChange("numeroMatricula", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validadeCarteira">Validade da Carteira</Label>
                                <Input id="validadeCarteira" type="date" value={formData.validadeCarteira} onChange={(e) => handleInputChange("validadeCarteira", e.target.value)} disabled={validadeIndeterminada} />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="validadeIndeterminada" checked={validadeIndeterminada} onCheckedChange={(checked) => setValidadeIndeterminada(checked === true)} />
                                <Label htmlFor="validadeIndeterminada">Validade Indeterminada</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/pacientes">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </div>
        </SecretaryLayout>
    );
}
