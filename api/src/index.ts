/**
 * Ponto de entrada da aplicação
 * Sistema de Mentoria - API Backend
 * 
 * Este arquivo tem uma única responsabilidade: inicializar o servidor.
 * Toda a lógica de configuração foi movida para módulos especializados:
 * 
 * - ./server.ts -> Gerenciamento do servidor
 * - ./config/middlewares.ts -> Configuração de middlewares
 * - ./config/rotas.ts -> Configuração de rotas
 * - ./config/configuracao.ts -> Configurações centralizadas
 * 
 * Princípio Single Responsibility aplicado com sucesso! 🎯
 */

import { iniciarServidor } from './server';

/**
 * Inicia o servidor da API
 * 
 * A partir deste ponto, toda a inicialização é gerenciada
 * pela classe ServidorAPI em ./server.ts
 */
iniciarServidor(); 