package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.api.dto.EventoRequestDTO;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.UserRole;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Usuario;
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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class EventoRestControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private TokenService tokenService;

	private String token;

	@BeforeEach
	void setUp() {
		usuarioRepository.deleteAll();

		Usuario usuario = new Usuario();
		usuario.setLogin("admin");
		usuario.setSenha(new BCryptPasswordEncoder().encode("123456"));
		usuario.setRole(UserRole.ADMIN);
		usuarioRepository.save(usuario);

		token = tokenService.generateToken(usuario);
	}

	@Test
	void deveRetornar200_QuandoListarEventos() throws Exception {
		mockMvc.perform(get("/api/evento")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornar403_QuandoNaoAutenticado() throws Exception {
		mockMvc.perform(get("/api/evento")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());
	}

	@Test
	void deveRetornar201_QuandoCriarEventoComDadosValidos() throws Exception {
		EventoRequestDTO eventoRequestDTO = new EventoRequestDTO();
		eventoRequestDTO.setTitulo("Semana Acadêmica");
		eventoRequestDTO.setCurso("Sistemas de Informação");
		eventoRequestDTO.setDataInicio(LocalDate.now().toString());
		eventoRequestDTO.setDataTermino(LocalDate.now().plusDays(2).toString());
		eventoRequestDTO.setLocal("Auditório Central");
		eventoRequestDTO.setJustificativa("Integração e aprendizado");
		eventoRequestDTO.setVlTotalSolicitado(1000.00f);
		eventoRequestDTO.setVlTotalAprovado(800.00f);

		mockMvc.perform(post("/api/evento")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(eventoRequestDTO)))
				.andExpect(status().isOk());
	}
}


// mvn clean test -Dtest=EventoRestControllerTest