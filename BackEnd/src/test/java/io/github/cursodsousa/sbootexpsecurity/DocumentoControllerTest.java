package io.github.cursodsousa.sbootexpsecurity;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DocumentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class DocumentoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private DocumentoRepository documentoRepository;

	@Autowired
	private ObjectMapper objectMapper;

	private String token;

	@BeforeEach
	void setUp() throws Exception {
		documentoRepository.deleteAll();
		this.token = autenticarOuRegistrarEObterToken();
	}

	private String autenticarOuRegistrarEObterToken() throws Exception {
		String loginBody = """
            {
              "login": "usuario@email.com",
              "senha": "123456"
            }
            """;

		MvcResult resultLogin = mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginBody))
				.andReturn();

		if (resultLogin.getResponse().getStatus() == 200) {
			String response = resultLogin.getResponse().getContentAsString();
			return objectMapper.readTree(response).get("token").asText();
		}

		// Usuário não existe, criar
		String registerBody = """
            {
              "nome": "Usuário de Teste",
              "login": "usuario@email.com",
              "senha": "123456",
              "email": "usuario@email.com"
            }
            """;

		mockMvc.perform(post("/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(registerBody))
				.andExpect(status().isOk());

		// Tentar logar novamente
		MvcResult resultRetry = mockMvc.perform(post("/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginBody))
				.andExpect(status().isOk())
				.andReturn();

		String response = resultRetry.getResponse().getContentAsString();
		return objectMapper.readTree(response).get("token").asText();
	}

	@Test
	void deveRetornar200_QuandoListarTodos() throws Exception {
		mockMvc.perform(get("/api/documentos")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornar200_QuandoFizerUpload() throws Exception {
		MockMultipartFile arquivo = new MockMultipartFile(
				"arquivo", "teste.txt", MediaType.TEXT_PLAIN_VALUE, "Conteúdo de teste".getBytes());

		mockMvc.perform(multipart("/api/documentos/upload")
						.file(arquivo)
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void deveRetornarErro_QuandoBuscarPorIdInexistente() throws Exception {
		mockMvc.perform(get("/api/documentos/9999")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isInternalServerError());
	}
}



// mvn clean test -Dtest=DocumentoControllerTest
