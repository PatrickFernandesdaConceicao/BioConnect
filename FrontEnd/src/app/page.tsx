// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed w-full bg-white z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-slate-900"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-slate-900">
              BioConnect
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#funcionalidades"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Funcionalidades
            </a>
            <a
              href="#sobre"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-40 md:pb-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Simplifique a gestão de{" "}
                <span className="text-blue-600">projetos acadêmicos</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-md">
                O BioConnect é uma plataforma completa para gerenciar projetos
                acadêmicos, eventos institucionais e monitorias na Faculdade
                Biopark.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Começar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Fazer login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <img
                    src="/api/placeholder/640/360"
                    alt="Dashboard do BioConnect"
                    className="rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Projetos */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Gestão de Projetos
              </h3>
              <p className="text-slate-600">
                Cadastre, gerencie e acompanhe projetos de pesquisa e extensão
                com controle total sobre prazos e participantes.
              </p>
            </div>

            {/* Eventos */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Organização de Eventos
              </h3>
              <p className="text-slate-600">
                Crie e gerencie eventos institucionais, controle inscrições e
                emita certificados de participação automaticamente.
              </p>
            </div>

            {/* Monitorias */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Gestão de Monitorias
              </h3>
              <p className="text-slate-600">
                Facilite o processo de seleção, acompanhamento e avaliação de
                monitores para diferentes disciplinas e cursos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Sobre o BioConnect
              </h2>
              <p className="text-slate-600 mb-4">
                O BioConnect é um sistema desenvolvido por cinco alunos do
                terceiro período do curso de Análise e Desenvolvimento de
                Sistemas da Faculdade Biopark.
              </p>
              <p className="text-slate-600">
                Nosso objetivo é fornecer uma plataforma web responsiva para o
                cadastro, gerenciamento e acompanhamento de projetos acadêmicos,
                eventos e monitorias. O sistema garante acessibilidade,
                segurança e facilidade de uso, permitindo que os usuários
                realizem suas atividades de forma intuitiva e eficiente.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      100%
                    </div>
                    <p className="text-sm text-slate-600">Responsivo</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      24/7
                    </div>
                    <p className="text-sm text-slate-600">Disponibilidade</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      OAuth2
                    </div>
                    <p className="text-sm text-slate-600">Segurança</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      LGPD
                    </div>
                    <p className="text-sm text-slate-600">Conformidade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para simplificar sua gestão acadêmica?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            Junte-se a professores e alunos que já estão usando o BioConnect
            para otimizar seus processos acadêmicos.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Começar gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Entre em Contato
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center p-6 rounded-lg bg-blue-50">
                <svg
                  className="w-10 h-10 text-blue-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-slate-600">contato@bioconnect.edu.br</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-indigo-50">
                <svg
                  className="w-10 h-10 text-indigo-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                <p className="text-slate-600">(45) 3333-4444</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-8 shadow-md">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Seu email"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-slate-700"
                  >
                    Assunto
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Assunto da mensagem"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Sua mensagem"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto" size="lg">
                  Enviar mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8 text-white"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold">BioConnect</span>
              </div>
              <p className="text-slate-400 text-sm">
                Sistema de gestão de projetos acadêmicos, eventos institucionais
                e monitorias.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#funcionalidades"
                    className="hover:text-white transition"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="hover:text-white transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  contato@bioconnect.edu.br
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  (45) 3333-4444
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Av. Marginal, 1000 - Toledo, PR
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} BioConnect. Todos os direitos
              reservados.
            </p>
            <p className="mt-2">
              Desenvolvido por alunos do curso de Análise e Desenvolvimento de
              Sistemas - Faculdade Biopark
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
