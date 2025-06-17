package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.AuthenticationDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private String usuarioId;

    @BeforeEach
    void setUp() throws Exception {
        usuarioRepository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID().toString());
        usuario.setLogin("admin");
        usuario.setSenha(new BCryptPasswordEncoder().encode("admin123"));
        usuario.setEmail("admin@example.com");
        usuario.setNome("Administrador");
        usuario.setRole(UserRole.ADMIN);
        usuarioRepository.save(usuario);
        usuarioId = usuario.getId();

        AuthenticationDTO loginDTO = new AuthenticationDTO("admin", "admin123");
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
    void deveRetornar200_QuandoListarUsuarios() throws Exception {
        mockMvc.perform(get("/usuarios")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornar200_QuandoAtualizarUsuarioParcialmente() throws Exception {
        Map<String, Object> updates = new HashMap<>();
        updates.put("nome", "Administrador Atualizado");
        updates.put("email", "admin.updated@example.com");

        String jsonRequest = objectMapper.writeValueAsString(updates);

        mockMvc.perform(patch("/usuarios/" + usuarioId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andDo(print())
                .andExpect(status().isOk());
    }
}






// mvn clean test -Dtest=UsuarioControllerTest