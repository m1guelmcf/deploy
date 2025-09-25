import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Shield, Stethoscope, Receipt, IdCard, LucideProps } from "lucide-react"

/*********************************************
 * 🧠 DADOS DOS PERFIS
 *
 * O QUE FAZ: Esta é uma lista (array) que guarda
 * todas as informações de cada cartão de perfil.
 *
 * MOTIVO: Separar os dados da aparência (HTML/JSX)
 * torna o código muito mais fácil de gerenciar.
 * Para adicionar um novo perfil, basta adicionar
 * um novo item a esta lista.
 *
 *********************************************/
const dadosDosPerfis = [
  {
    titulo: "Área do Paciente",
    descricao: "Acesse sua área pessoal para agendar consultas e gerenciar seus dados",
    IconePrincipal: User,
    corIconePrincipal: "text-black-600",
    funcionalidades: [
      { Icone: Calendar, texto: "Agendar consultas" },
      { Icone: Clock, texto: "Ver histórico de consultas" },
      { Icone: User, texto: "Gerenciar dados pessoais" },
    ],
    urlLogin: "/patient/login",
    textoBotao: "Entrar como Paciente",
    corBotao: "", // [UI/ESTILO]: Vazio para usar a cor padrão do botão.
  },
  {
    titulo: "Área da Secretária",
    descricao: "Gerencie consultas, pacientes e agenda médica",
    IconePrincipal: Shield,
    corIconePrincipal: "text-purple-600",
    funcionalidades: [
      { Icone: Calendar, texto: "Gerenciar consultas" },
      { Icone: User, texto: "Cadastrar pacientes" },
      { Icone: Clock, texto: "Controlar agenda" },
    ],
    urlLogin: "/secretary/login",
    textoBotao: "Entrar como Secretária",
    corBotao: "bg-purple-600 hover:bg-purple-700",
  },
  {
    titulo: "Área Médica",
    descricao: "Acesso restrito para profissionais de saúde",
    IconePrincipal: Stethoscope,
    corIconePrincipal: "text-green-600",
    funcionalidades: [
      { Icone: Calendar, texto: "Gerenciar agenda" },
      { Icone: User, texto: "Ver pacientes" },
      { Icone: Clock, texto: "Histórico de atendimentos" },
    ],
    urlLogin: "/doctor/login",
    textoBotao: "Entrar como Médico",
    corBotao: "bg-green-600 hover:bg-green-700",
  },

  // #############################################
  //  PERFIS FUTUROS (COMENTADOS POR ENQUANTO)
  // #############################################
  //  [AFAZER]: Estes perfis estão comentados
  //  porque ainda não temos essas áreas prontas.
  //  Quando estiverem, basta descomentar e ajustar
  //  as URLs de login.


  // {
  //   titulo: "Área do Gestor",
  //   descricao: "Acesso restrito para gestores e coordenadores",
  //   IconePrincipal: IdCard,
  //   corIconePrincipal: "text-blue-600",
  //   funcionalidades: [
  //     { Icone: Calendar, texto: "Relatórios gerenciais" },
  //     { Icone: User, texto: "Configurações do sistema" },
  //     { Icone: Clock, texto: "Gestão de usuários" },
  //   ],
  //   urlLogin: "#", // [AFAZER]: Definir a URL de login correta.
  //   textoBotao: "Entrar como Gestor",
  //   corBotao: "bg-blue-600 hover:bg-blue-700",
  // },
  // {
  //   titulo: "Área de Finanças",
  //   descricao: "Acesso restrito para profissionais do setor financeiro",
  //   IconePrincipal: Receipt,
  //   corIconePrincipal: "text-orange-600",
  //   funcionalidades: [
  //     { Icone: Calendar, texto: "Relatórios financeiros" },
  //     { Icone: User, texto: "Faturamento" },
  //     { Icone: Clock, texto: "Controle de pagamentos" },
  //   ],
  //   urlLogin: "#", // [AFAZER]: Definir a URL de login correta.
  //   textoBotao: "Entrar como Financeiro",
  //   corBotao: "bg-orange-600 hover:bg-orange-700",
  // },
];
// --- DEFINIÇÃO DOS TIPOS PARA O TYPESCRIPT ---
// MOTIVO: Isso cria um "contrato" que diz ao TypeScript qual é a
// estrutura exata dos nossos dados, eliminando os erros de 'any'.

// Primeiro, definimos a forma de cada item na lista de funcionalidades
type Funcionalidade = {
  Icone: React.ElementType; // Um ícone é um tipo de componente React
  texto: string;
};

// Agora, definimos a forma completa do objeto 'perfil'
type Perfil = {
  IconePrincipal: React.ElementType;
  corIconePrincipal: string;
  titulo: string;
  descricao: string;
  funcionalidades: Funcionalidade[]; // É um array do tipo que definimos acima
  urlLogin: string;
  corBotao: string;
  textoBotao: string;
};

/*********************************************
 * 🧠 COMPONENTE INTERNO: CartaoDePerfil
 *
 * O QUE FAZ: Renderiza um único cartão de perfil.
 * Ele é "burro", apenas recebe os dados e os exibe.
 *
 * MOTIVO: Foi criado para evitar a repetição de
 * código. Agora, a estrutura do cartão existe em
 * um só lugar. Se precisarmos mudar o visual,
 * mudamos apenas aqui.
 *
 *********************************************/
const CartaoDePerfil = ({ perfil }: { perfil: Perfil }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="text-center flex-shrink-0">
        <perfil.IconePrincipal className={`w-12 h-12 mx-auto mb-4 ${perfil.corIconePrincipal}`} />
        <CardTitle>{perfil.titulo}</CardTitle>
        <CardDescription>{perfil.descricao}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          {/* [LÓGICA]: Usamos .map() para criar a lista de funcionalidades dinamicamente. */}
          {perfil.funcionalidades.map((func, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <func.Icone className="w-4 h-4" />
              <span>{func.texto}</span>
            </div>
          ))}
        </div>
        <Link href={perfil.urlLogin} className="block mt-auto">
          <Button className={`w-full ${perfil.corBotao}`}>{perfil.textoBotao}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

/*********************************************
 * 🧠 COMPONENTE PRINCIPAL: HomePage
 *
 * O QUE FAZ: É a página inicial do sistema.
 * Agora, sua única responsabilidade é exibir o
 * título e usar a lista 'dadosDosPerfis' para
 * renderizar os cartões de forma dinâmica.
 *
 *********************************************/
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema de Consultas Médicas</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie suas consultas médicas de forma simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/*
           * [LÓGICA]: Aqui está a mágica!
           * Usamos .map() para percorrer nossa lista de dados e criar um
           * componente 'CartaoDePerfil' para cada item.
           * O código fica limpo, sem repetição e muito fácil de manter.
           */}
          {dadosDosPerfis.map((perfil) => (
            <CartaoDePerfil key={perfil.titulo} perfil={perfil} />
          ))}
        </div>
      </div>
    </div>
  )
}