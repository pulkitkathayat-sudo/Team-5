package com.skillhub.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service routes
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("admin-service", r -> r.path("/api/admin/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("search-service", r -> r.path("/api/search/**")
                        .uri("lb://AUTH-SERVICE"))

                // Skill Service routes
                .route("skill-service", r -> r.path("/api/skills/**")
                        .uri("lb://SKILL-SERVICE"))

                // Project Service routes
                .route("project-service", r -> r.path("/api/projects/**")
                        .uri("lb://PROJECT-SERVICE"))
                .route("application-service", r -> r.path("/api/applications/**")
                        .uri("lb://PROJECT-SERVICE"))

                // Dashboard Service routes
                .route("dashboard-service", r -> r.path("/api/dashboard/**")
                        .uri("lb://DASHBOARD-SERVICE"))

                .build();
    }
}
