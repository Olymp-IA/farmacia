package com.farmacia.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de Seguridad Spring Security.
 * Implementa seguridad perimetral con autenticación JWT y control de acceso basado en roles.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas - Solo autenticación
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Módulo RRHH - Solo Admin y Gerente RRHH
                .requestMatchers("/api/hr/**").hasAnyRole(Roles.ADMIN, Roles.HR_MANAGER)
                
                // Módulo Finanzas - Solo Admin y Contador
                .requestMatchers("/api/finance/**").hasAnyRole(Roles.ADMIN, Roles.ACCOUNTANT)
                .requestMatchers("/api/treasury/**").hasAnyRole(Roles.ADMIN, Roles.ACCOUNTANT)
                
                // Módulo WMS - Admin, Bodeguero, Farmacéutico
                .requestMatchers("/api/wms/**").hasAnyRole(Roles.ADMIN, Roles.WAREHOUSE_OP, Roles.PHARMACIST)
                
                // Módulo Manufactura - Admin y Farmacéutico
                .requestMatchers("/api/manufacturing/**").hasAnyRole(Roles.ADMIN, Roles.PHARMACIST)
                
                // Módulo Logística - Admin y Despachador
                .requestMatchers("/api/logistics/**").hasAnyRole(Roles.ADMIN, Roles.DISPATCHER)
                
                // Módulo B2B - Admin y Ejecutivo Comercial
                .requestMatchers("/api/b2b/**").hasAnyRole(Roles.ADMIN, Roles.SALES_EXEC)
                
                // Todos los demás endpoints requieren autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",      // Next.js desarrollo
            "http://localhost:8081",      // React Native Metro
            "https://pos.farmacia.io",
            "https://store.farmacia.io",
            "https://admin.farmacia.io"
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
