package io.github.cursodsousa.sbootexpsecurity;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginSeleniumTestS {

    WebDriver driver;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @Test
    public void testLoginComSucesso() {
        driver.get("http://localhost:3001/login");

        driver.findElement(By.name("login")).sendKeys("victor");
        driver.findElement(By.name("senha")).sendKeys("123456");
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

//preencher com um login e senha valido para rodar corretamente