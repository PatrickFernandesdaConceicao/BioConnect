"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, authFetch } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  login: string;
  tipo: "USER" | "ADMIN";
  ativo: boolean;
  dataCriacao: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  // CORREÇÃO: Função para formatar datas de forma segura
  const formatDateSafe = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return "Não informado";
    }

    try {
      // Tentar diferentes formatos de data
      let date: Date;

      // Se já é uma data ISO válida
      if (dateString.includes("T") || dateString.includes("-")) {
        date = parseISO(dateString);
      } else {
        // Tentar criar data diretamente
        date = new Date(dateString);
      }

      // Verificar se a data é válida
      if (isValid(date)) {
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      } else {
        return "Data inválida";
      }
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error);
      return "Data inválida";
    }
  };

  // Verificar permissão de admin
  useEffect(() => {
    if (!hasPermission("ADMIN")) {
      router.push("/dashboard");
      return;
    }
  }, [hasPermission, router]);

  // Carregar usuários
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // CORREÇÃO: Usar endpoint correto
      const response = await authFetch(`${apiUrl}/usuarios`);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados dos usuários recebidos:", data); // Debug
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      setError(error.message || "Erro ao carregar usuários");
      toast.error("Erro ao carregar usuários", {
        description:
          error.message || "Verifique sua conexão e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, novoStatus: boolean) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // CORREÇÃO: Usar endpoint correto
      const response = await authFetch(`${apiUrl}/usuarios/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ ativo: novoStatus }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Atualizar localmente
      setUsuarios(
        usuarios.map((u) => (u.id === userId ? { ...u, ativo: novoStatus } : u))
      );

      toast.success(
        `Usuário ${novoStatus ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do usuário", {
        description: error.message || "Tente novamente.",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // CORREÇÃO: Usar endpoint correto
      const response = await authFetch(`${apiUrl}/usuarios/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Remover localmente
      setUsuarios(usuarios.filter((u) => u.id !== userId));

      toast.success("Usuário excluído com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário", {
        description: error.message || "Tente novamente.",
      });
    }
  };

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.login.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoFilter === "todos" || usuario.tipo === tipoFilter;

    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativo" && usuario.ativo) ||
      (statusFilter === "inativo" && !usuario.ativo);

    return matchesSearch && matchesTipo && matchesStatus;
  });

  const getRoleBadge = (tipo: string) => {
    return tipo === "ADMIN" ? (
      <Badge className="bg-purple-100 text-purple-800">
        <Shield className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary">Usuário</Badge>
    );
  };

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inativo</Badge>
    );
  };

  if (!hasPermission("ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-muted-foreground">
              Você não tem permissão para acessar o gerenciamento de usuários.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground">
            Administre usuários, permissões e status no sistema
          </p>
        </div>
        <Link href="/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
                <SelectItem value="USER">Usuários</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsuarios.length})</CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Carregando usuários...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchUsuarios}>Tentar novamente</Button>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ||
                tipoFilter !== "todos" ||
                statusFilter !== "todos"
                  ? "Tente ajustar os filtros de busca."
                  : "Ainda não há usuários cadastrados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nome}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.login}</TableCell>
                      <TableCell>{getRoleBadge(usuario.tipo)}</TableCell>
                      <TableCell>{getStatusBadge(usuario.ativo)}</TableCell>
                      <TableCell>
                        {/* CORREÇÃO: Usar função segura para formatar data */}
                        {formatDateSafe(usuario.dataCriacao)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/usuarios/${usuario.id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/usuarios/${usuario.id}/edit`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                toggleUserStatus(usuario.id, !usuario.ativo)
                              }
                            >
                              {usuario.ativo ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                  disabled={usuario.id === user?.id}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o usuário "
                                    {usuario.nome}"? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(usuario.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
