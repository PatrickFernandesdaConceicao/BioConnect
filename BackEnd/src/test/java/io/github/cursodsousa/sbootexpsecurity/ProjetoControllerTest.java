package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.CriarProjetoRequest;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ProjetoControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private MockMvc mockMvc;

    private String token;

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();

        // Cria usuário com login e senha válidos
        usuarioRepository.deleteAll();
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID().toString());
        usuario.setLogin("testelogin");
        usuario.setEmail("teste@example.com");
        usuario.setNome("Usuario Teste");
        usuario.setSenha(new BCryptPasswordEncoder().encode("senha123")); // Gera hash dinamicamente
        usuario.setRole(UserRole.ADMIN);
        usuarioRepository.saveAndFlush(usuario);

        // Log para verificar o usuário salvo
        UserDetails usuarioSalvo = usuarioRepository.findByLogin("testelogin");
        System.out.println("Usuário salvo: " + (usuarioSalvo != null ? usuarioSalvo.getUsername() : "Nenhum usuário encontrado"));

        this.token = obterTokenAutenticacao();
    }

    private String obterTokenAutenticacao() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String jsonLogin = mapper.writeValueAsString(new LoginDTO("testelogin", "senha123"));
        System.out.println("JSON enviado para /auth/login: " + jsonLogin);

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonLogin))
                .andDo(print()) // Imprime detalhes da requisição e resposta
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        System.out.println("Resposta do servidor: " + response);

        return "Bearer " + mapper.readTree(response).get("token").asText();
    }

    @Test
    void deveRetornar200_QuandoCriarProjeto() throws Exception {
        CriarProjetoRequest request = CriarProjetoRequest.builder()
                .titulo("Projeto Teste")
                .descricao("Descrição do projeto com mais de 20 caracteres")
                .objetivos("Objetivos muito bem descritos com mais de 20 caracteres")
                .justificativa("Justificativa válida com mais de 20 caracteres")
                .dataInicio("2025-06-01")
                .dataTermino("2025-06-30")
                .areaConhecimento("Tecnologia")
                .possuiOrcamento(false)
                .aceitouTermos(true)
                .tipoProjeto("EXTENSÃO") // Adiciona o campo tipoProjeto
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String jsonRequest = mapper.writeValueAsString(request);
        System.out.println("JSON enviado para /api/projetos: " + jsonRequest);

        mockMvc.perform(post("/api/projetos")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andDo(print()) // Para depuração
                .andExpect(status().isOk());
    }

    static class LoginDTO {
        private String login;
        private String senha;

        public LoginDTO(String login, String senha) {
            this.login = login;
            this.senha = senha;
        }

        public String getLogin() {
            return login;
        }

        public String getSenha() {
            return senha;
        }
    }
}


// mvn clean test -Dtest=ProjetoControllerTest