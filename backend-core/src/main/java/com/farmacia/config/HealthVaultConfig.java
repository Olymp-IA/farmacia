package com.farmacia.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Configuración del DataSource de Health Vault (Datos Clínicos).
 * Base de datos FÍSICAMENTE SEPARADA para cumplimiento HIPAA/normativa local.
 * 
 * Maneja entidades de: pacientes, recetas, historial médico.
 * Base de datos: postgres-health (puerto 5433)
 * 
 * SEGURIDAD: 
 * - Red Docker aislada (internal: true)
 * - Encriptación en reposo via AttributeEncryptor
 * - Acceso restringido solo desde backend
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "com.farmacia.health",
    entityManagerFactoryRef = "healthEntityManagerFactory",
    transactionManagerRef = "healthTransactionManager"
)
public class HealthVaultConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.health")
    public DataSourceProperties healthDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "healthDataSource")
    public DataSource healthDataSource() {
        return healthDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

    @Bean(name = "healthEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean healthEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("healthDataSource") DataSource dataSource) {
        
        return builder
            .dataSource(dataSource)
            .packages("com.farmacia.health.model")
            .persistenceUnit("health")
            .properties(healthJpaProperties())
            .build();
    }

    @Bean(name = "healthTransactionManager")
    public PlatformTransactionManager healthTransactionManager(
            @Qualifier("healthEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        
        return new JpaTransactionManager(
            Objects.requireNonNull(entityManagerFactory.getObject())
        );
    }

    private Map<String, Object> healthJpaProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        props.put("hibernate.hbm2ddl.auto", "validate");
        props.put("hibernate.show_sql", false);
        props.put("hibernate.format_sql", true);
        // Configuración de auditoría estricta para datos de salud
        props.put("hibernate.jdbc.batch_size", 25);
        props.put("hibernate.order_inserts", true);
        props.put("hibernate.generate_statistics", true); // Para auditoría
        return props;
    }
}
