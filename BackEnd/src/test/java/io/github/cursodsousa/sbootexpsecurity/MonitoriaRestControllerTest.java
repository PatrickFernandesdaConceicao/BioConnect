package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.AuthenticationDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.UsuarioRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MonitoriaRestControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private TokenService tokenService;

	private String token;

	@BeforeEach
	void setUp() {
		// Limpa e insere usuário ADMIN para autenticação
		usuarioRepository.deleteAll();

		Usuario usuario = new Usuario();
		usuario.setLogin("admin");
		usuario.setSenha(passwordEncoder.encode("123456"));
		usuario.setEmail("admin@email.com");
		usuario.setNome("Administrador");
		usuario.setRole(UserRole.ADMIN);
		usuarioRepository.save(usuario);

		// Gera token JWT
		token = "Bearer " + tokenService.generateToken(usuario);
	}

	@Test
	void deveRetornar200_QuandoListarMonitoriaComToken() throws Exception {
		mockMvc.perform(get("/api/monitoria")
						.header("Authorization", token))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornar403_QuandoListarMonitoriaSemToken() throws Exception {
		mockMvc.perform(get("/api/monitoria"))
				.andExpect(status().isForbidden());
	}
}

// mvn clean test -Dtest=MonitoriaRestControllerTest