package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.AuthenticationDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Evento;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.EventoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.RecursosRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ParticipanteRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private RecursosRepository recursosRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private Long eventoId;

    @BeforeEach
    void setUp() throws Exception {
        // Apagar recursos antes dos eventos para evitar violação de chave estrangeira
        recursosRepository.deleteAll();
        eventoRepository.deleteAll();
        usuarioRepository.deleteAll();

        // Criar usuário
        Usuario usuario = new Usuario();
        usuario.setLogin("testelogin");
        usuario.setSenha(new BCryptPasswordEncoder().encode("senha123"));
        usuario.setEmail("teste@email.com");
        usuario.setNome("Usuário Teste");
        usuario.setRole(UserRole.USER);
        usuarioRepository.save(usuario);

        // Criar evento
        Evento evento = new Evento();
        evento.setTitulo("Evento de Teste");
        evento.setLocal("Auditório Principal");
        evento.setJustificativa("Testar endpoint");
        evento.setDataInicio(LocalDate.now().plusDays(1));
        evento.setDataTermino(LocalDate.now().plusDays(2));
        evento.setVlTotalSolicitado(1000f);
        evento.setVlTotalAprovado(800f);
        eventoRepository.save(evento);
        eventoId = evento.getId();

        // Gerar token JWT
        AuthenticationDTO loginDTO = new AuthenticationDTO("testelogin", "senha123");
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        token = objectMapper.readTree(responseJson).get("token").asText();
        assertThat(token).isNotBlank();
    }

    @Test
    void deveRetornar200_QuandoListarParticipantes() throws Exception {
        mockMvc.perform(get("/api/evento/" + eventoId + "/participantes")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}




// mvn clean test -Dtest=ParticipanteRestControllerTest