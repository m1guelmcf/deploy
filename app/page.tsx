
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"


export default function InicialPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {}
      <div className="bg-black text-white text-sm py-2 px-6 flex justify-between">
        <span> Horário: 08h00 - 21h00</span>
        <span> Email: contato@midconnecta.com</span>
      </div>

      {}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">MidConnecta</h1>
        <nav className="flex space-x-6 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#about" className="hover:text-blue-600">Sobre</a>
          <a href="#departments" className="hover:text-blue-600">Departamentos</a>
          <a href="#doctors" className="hover:text-blue-600">Médicos</a>
          <a href="#contact" className="hover:text-blue-600">Contato</a>
        </nav>
       <div className="flex space-x-4">
  {}
  <Link href="/cadastro">
    <Button
    variant="outline"
    className="rounded-full px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
  >
    Login
  </Button>
</Link>
         
        </div>
      </header>

      {}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 bg-gray-100">
        <div className="max-w-lg">
          <h2 className="text-gray-600 uppercase text-sm">Bem-vindo à Saúde Digital</h2>
          <h1 className="text-4xl font-extrabold text-black leading-tight mt-2">
            Soluções Médicas <br /> & Cuidados com a Saúde
          </h1>
          <p className="text-gray-600 mt-4">
            São mais de 25 anos de experiência em serviços médicos com qualidade e confiança.
          </p>
          <div className="mt-6 flex space-x-4">
            <Button className="rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition">
              Nossos Serviços
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="Médico"
            className="w-80"
          />
        </div>
      </section>

      {}
      <section className="py-16 px-10 md:px-20 bg-white">
        <h2 className="text-center text-3xl font-bold text-black">Nossos Serviços</h2>
        <p className="text-center text-gray-600 mt-2">Serviços médicos que oferecemos</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">Clínica Geral</h3>
            <p className="text-gray-600 mt-2">
              Atendimento médico geral com foco na prevenção e diagnóstico.
            </p>
            <Button className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
              Agendar
            </Button>
          </div>
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">Pediatria</h3>
            <p className="text-gray-600 mt-2">
              Cuidado especializado para crianças e adolescentes.
            </p>
            <Button className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
              Agendar
            </Button>
          </div>
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">Exames</h3>
            <p className="text-gray-600 mt-2">
              Exames laboratoriais e de imagem com precisão e agilidade.
            </p>
            <Button className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
              Agendar
            </Button>
          </div>
        </div>
      </section>

      {}
      <footer className="bg-black text-white py-6 text-center">
        <p>© 2025 MidConnecta</p>
      </footer>
    </div>
  );
}

