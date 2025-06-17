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
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		usuarioRepository.deleteAll();

		Usuario usuario = new Usuario();
		usuario.setLogin("testelogin");
		usuario.setSenha(new BCryptPasswordEncoder().encode("senha123"));
		usuario.setEmail("teste@email.com");
		usuario.setNome("Usuário de Teste");
		usuario.setRole(UserRole.USER);

		usuarioRepository.save(usuario);
	}

	@Test
	void deveRetornar200_QuandoLoginCorreto() throws Exception {
		AuthenticationDTO dto = new AuthenticationDTO("testelogin", "senha123");

		mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornar401_QuandoSenhaIncorreta() throws Exception {
		AuthenticationDTO dto = new AuthenticationDTO("testelogin", "senhaErrada");

		mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deveRetornar500_QuandoUsuarioNaoExiste() throws Exception {
		// Este teste espera erro 500 pois o backend ainda não trata corretamente a ausência de usuário
		AuthenticationDTO dto = new AuthenticationDTO("usuarioFake", "senha123");

		mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isInternalServerError());

	}


}
