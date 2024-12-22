package com.RC.Backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> {
                    authz.requestMatchers(HttpMethod.POST, "/api/login").permitAll();
                    authz.requestMatchers(HttpMethod.POST, "/api/register").permitAll();
                    authz.requestMatchers(HttpMethod.GET, "/api/test/**").permitAll();
                    authz.requestMatchers(HttpMethod.GET, "/api/pumps/**").permitAll();
                    authz.requestMatchers(HttpMethod.POST, "/api/pumps/**").permitAll();
                    authz.requestMatchers(HttpMethod.PUT, "/api/pumps/**").permitAll();
                    authz.requestMatchers(HttpMethod.GET, "/api/sensorData/**").permitAll();
                    authz.requestMatchers(HttpMethod.POST, "/api/sensorData/**").permitAll();
                    authz.anyRequest().authenticated();
                })
                .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }


    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}