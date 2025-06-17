package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.AuthenticationDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.EventoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RecursoRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @BeforeEach
    void setup() {
        usuarioRepository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setNome("Usuário Teste");
        usuario.setLogin("admin");
        usuario.setEmail("admin@email.com");
        usuario.setSenha(new BCryptPasswordEncoder().encode("admin123"));
        usuario.setRole(UserRole.ADMIN);
        usuarioRepository.save(usuario);
    }

    private String obterToken(String login, String senha) throws Exception {
        AuthenticationDTO authDTO = new AuthenticationDTO(login, senha);
        String json = objectMapper.writeValueAsString(authDTO);

        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void deveRetornar201_QuandoCriarRecurso() throws Exception {
        String token = obterToken("admin", "admin123");

        Evento evento = new Evento();
        evento.setTitulo("Evento Teste");
        evento.setCurso("Curso Teste");
        evento.setJustificativa("Justificativa");
        evento.setLocal("Local");
        evento.setDataInicio(LocalDate.now());
        evento.setDataTermino(LocalDate.now().plusDays(1));
        evento.setVlTotalSolicitado(0f);
        evento.setVlTotalAprovado(0f);
        evento = eventoRepository.save(evento);

        String json = """
        {
            "recurso": "Material",
            "descricao": "Recurso Teste",
            "qtd": 10,
            "valorUnit": 15,
            "valorAprovado": 150,
            "eventoId": %d,
            "totalSolicitado": 150
        }
        """.formatted(evento.getId());

        mockMvc.perform(post("/api/recursos")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }
}





// mvn clean test -Dtest=RecursoRestControllerTest