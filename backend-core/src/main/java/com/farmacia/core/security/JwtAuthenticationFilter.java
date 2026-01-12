package com.farmacia.core.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

/**
 * JWT Authentication Filter.
 * Validates Bearer token and extracts tenant_id for multi-tenant isolation.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = extractJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && validateToken(jwt)) {
                // Extract claims from JWT
                String userId = extractClaim(jwt, "userId");
                String tenantId = extractClaim(jwt, "tenantId");
                String role = extractClaim(jwt, "role");

                // Set tenant context for data isolation
                if (tenantId != null) {
                    TenantContext.setTenantId(UUID.fromString(tenantId));
                }

                // Create authentication token
                var authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role)
                );

                var authentication = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    authorities
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
        } finally {
            try {
                filterChain.doFilter(request, response);
            } finally {
                // Always clear tenant context after request
                TenantContext.clear();
            }
        }
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    private boolean validateToken(String token) {
        // TODO: Implement actual JWT validation using RS256
        // For now, basic non-empty check
        return StringUtils.hasText(token) && token.split("\\.").length == 3;
    }

    private String extractClaim(String token, String claimName) {
        // TODO: Implement actual JWT claim extraction
        // This is a placeholder - in production use io.jsonwebtoken library
        return null;
    }
}
