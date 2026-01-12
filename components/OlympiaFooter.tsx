'use client';

import React from 'react';
import styles from './OlympiaFooter.module.css';

export interface OlympiaFooterProps {
    /** Estilo del footer: 'minimal' solo logo, 'full' con enlaces */
    variant?: 'minimal' | 'full';
    /** Mostrar copyright adicional del cliente */
    clientCopyright?: string;
    /** Año para el copyright (por defecto el año actual) */
    year?: number;
    /** Clase CSS adicional */
    className?: string;
}

export function OlympiaFooter({
    variant = 'minimal',
    clientCopyright,
    year = new Date().getFullYear(),
    className = ''
}: OlympiaFooterProps) {
    return (
        <div className={`${styles.footerWrapper} ${className}`}>
            {/* Client Copyright - Opcional */}
            {clientCopyright && (
                <p className={styles.clientCopyright}>
                    © {year} {clientCopyright}. Todos los derechos reservados.
                </p>
            )}

            {/* Branding Link */}
            <a
                href="https://olymp-ia.cl"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.branding}
            >
                <span className={styles.poweredBy}>powered by</span>
                <span className={styles.logo}>
                    <span className={styles.symbol}>Ω</span>
                    <span className={styles.name}>OLYMP</span>
                    <span className={styles.symbolXi}>Ξ</span>
                    <span className={styles.name}>IA</span>
                    <span className={styles.domain}>.cl</span>
                </span>
            </a>

            {/* Full Variant Links */}
            {variant === 'full' && (
                <div className={styles.links}>
                    <a href="https://olymp-ia.cl" target="_blank" rel="noopener noreferrer">
                        Sitio Web
                    </a>
                    <span className={styles.separator}>•</span>
                    <a href="https://github.com/Olymp-IA" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </div>
            )}
        </div>
    );
}

export default OlympiaFooter;
