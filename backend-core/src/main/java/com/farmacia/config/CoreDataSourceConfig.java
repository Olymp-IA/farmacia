package com.farmacia.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
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
 * Configuración del DataSource principal (Core).
 * Maneja entidades de: ventas, inventario, usuarios, contabilidad.
 * Base de datos: postgres-core (puerto 5432)
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "com.farmacia.core",
    entityManagerFactoryRef = "coreEntityManagerFactory",
    transactionManagerRef = "coreTransactionManager"
)
public class CoreDataSourceConfig {

    @Primary
    @Bean
    @ConfigurationProperties("spring.datasource.core")
    public DataSourceProperties coreDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean(name = "coreDataSource")
    public DataSource coreDataSource() {
        return coreDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

    @Primary
    @Bean(name = "coreEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean coreEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("coreDataSource") DataSource dataSource) {
        
        return builder
            .dataSource(dataSource)
            .packages(
                "com.farmacia.core.model",
                "com.farmacia.catalog.model",
                "com.farmacia.sales.model",
                "com.farmacia.wms.model",
                "com.farmacia.hr.model",
                "com.farmacia.finance.model"
            )
            .persistenceUnit("core")
            .properties(jpaProperties())
            .build();
    }

    @Primary
    @Bean(name = "coreTransactionManager")
    public PlatformTransactionManager coreTransactionManager(
            @Qualifier("coreEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        
        return new JpaTransactionManager(
            Objects.requireNonNull(entityManagerFactory.getObject())
        );
    }

    private Map<String, Object> jpaProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        props.put("hibernate.hbm2ddl.auto", "validate");
        props.put("hibernate.show_sql", false);
        props.put("hibernate.format_sql", true);
        props.put("hibernate.jdbc.batch_size", 50);
        props.put("hibernate.order_inserts", true);
        props.put("hibernate.order_updates", true);
        return props;
    }
}
