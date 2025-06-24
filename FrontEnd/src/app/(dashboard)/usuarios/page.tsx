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
import { format } from "date-fns";
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
      const response = await authFetch(`${apiUrl}/api/usuarios`);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data);
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
      const response = await authFetch(
        `${apiUrl}/api/usuarios/${userId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ ativo: novoStatus }),
        }
      );

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

  // const changeUserRole = async (userId: string, novoTipo: "USER" | "ADMIN") => {
  //   try {
  //     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  //     const response = await authFetch(
  //       `${apiUrl}/api/usuarios/${userId}/role`,
  //       {
  //         method: "PATCH",
  //         body: JSON.stringify({ tipo: novoTipo }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Erro ${response.status}: ${response.statusText}`);
  //     }

  //     // Atualizar localmente
  //     setUsuarios(
  //       usuarios.map((u) => (u.id === userId ? { ...u, tipo: novoTipo } : u))
  //     );

  //     toast.success("Permissão alterada com sucesso!");
  //   } catch (error: any) {
  //     console.error("Erro ao alterar permissão:", error);
  //     toast.error("Erro ao alterar permissão do usuário", {
  //       description: error.message || "Tente novamente.",
  //     });
  //   }
  // };

  const deleteUser = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(`${apiUrl}/api/usuarios/${userId}`, {
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

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getRoleBadge = (tipo: string) => {
    return tipo === "ADMIN" ? (
      <Badge variant="destructive">
        <Shield className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline">
        <Users className="w-3 h-3 mr-1" />
        Usuário
      </Badge>
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
              Você não tem permissão para acessar esta página.
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
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Gerenciamento de Usuários
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie usuários, permissões e status de ativação
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, email ou login..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="USER">Usuários</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários Cadastrados</CardTitle>
              <CardDescription>
                {filteredUsuarios.length} usuário(s) encontrado(s)
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/usuarios/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
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
                        {format(new Date(usuario.dataCriacao), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
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

                            <DropdownMenuItem
                              onClick={() =>
                                // changeUserRole(
                                //   usuario.id,
                                //   usuario.tipo === "ADMIN" ? "USER" : "ADMIN"
                                // )
                                null
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {usuario.tipo === "ADMIN"
                                ? "Remover Admin"
                                : "Tornar Admin"}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
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
