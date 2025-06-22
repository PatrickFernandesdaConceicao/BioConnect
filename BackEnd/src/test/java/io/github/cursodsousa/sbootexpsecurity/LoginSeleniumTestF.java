package io.github.cursodsousa.sbootexpsecurity;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome   .ChromeDriver;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

public class LoginSeleniumTestF {

    WebDriver driver;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @Test
    public void testLoginComSucesso() {
        driver.get("http://localhost:3001/login");

        driver.findElement(By.name("login")).sendKeys("testelogin");
        driver.findElement(By.name("senha")).sendKeys("senha123");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        new WebDriverWait(driver, Duration.ofSeconds(10))
                .until(ExpectedConditions.urlContains("/dashboard"));

        Assertions.assertTrue(driver.getCurrentUrl().contains("/dashboard"));
    }

    @AfterEach
    public void tearDown() {
        driver.quit();
    }
}

//falha por login e senha errados