package io.github.cursodsousa.sbootexpsecurity;

import io.github.cursodsousa.sbootexpsecurity.domain.entity.Curso;
import io.github.cursodsousa.sbootexpsecurity.domain.entity.Disciplina;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.CursoRepository;
import io.github.cursodsousa.sbootexpsecurity.domain.repository.DisciplinaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CatalogoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private CursoRepository cursoRepository;

	@Autowired
	private DisciplinaRepository disciplinaRepository;

	@BeforeEach
	void setUp() {
		cursoRepository.deleteAll();
		disciplinaRepository.deleteAll();

		Curso curso = new Curso();
		curso.setNome("Curso Teste");
		cursoRepository.save(curso);

		Disciplina disciplina = new Disciplina();
		disciplina.setNome("Disciplina Teste");
		disciplinaRepository.save(disciplina);
	}

	@Test
	@WithMockUser(username = "admin", roles = "ADMIN")
	void deveRetornar200_QuandoListarCursos() throws Exception {
		mockMvc.perform(get("/api/catalogo/cursos")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	@WithMockUser(username = "admin", roles = "ADMIN")
	void deveRetornar200_QuandoListarDisciplinas() throws Exception {
		mockMvc.perform(get("/api/catalogo/disciplinas")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}
}
