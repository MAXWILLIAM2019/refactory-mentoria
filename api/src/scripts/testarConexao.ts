/**
 * Script para testar conexão com o banco de dados
 * 
 * Execute: npm run test:conexao
 * ou: ts-node src/scripts/testarConexao.ts
 */

import { testarConexaoBanco, sincronizarBanco } from '../config/bancoDados';
import sequelize from '../config/bancoDados';
import '../models'; // Importa todos os models e relacionamentos

async function executarTeste(): Promise<void> {
  try {
    console.log('🚀 Iniciando teste de conexão...\n');
    
    // 1. Testar conexão básica
    console.log('📡 Testando conexão com PostgreSQL...');
    await testarConexaoBanco();
    
    // 2. Verificar modelos registrados
    console.log('\n📊 Verificando modelos registrados...');
    const modelosRegistrados = Object.keys(sequelize.models);
    console.log(`✅ ${modelosRegistrados.length} modelos encontrados:`, modelosRegistrados.join(', '));
    
    // 3. Sincronizar banco (sem force para não apagar dados)
    console.log('\n🔄 Sincronizando modelos com banco...');
    await sincronizarBanco(false);
    
    // 4. Testar consulta simples
    console.log('\n🔍 Testando consulta simples...');
    const { Usuario, GrupoUsuario } = sequelize.models;
    
    const totalUsuarios = await Usuario.count();
    const totalGrupos = await GrupoUsuario.count();
    
    console.log(`📈 Estatísticas do banco:`);
    console.log(`   - Usuários: ${totalUsuarios}`);
    console.log(`   - Grupos: ${totalGrupos}`);
    
    // 5. Sucesso
    console.log('\n✅ Teste concluído com sucesso!');
    console.log('🎉 Configuração do banco está funcionando corretamente.\n');
    
  } catch (erro) {
    console.error('\n❌ Erro durante o teste:');
    console.error('📋 Detalhes:', erro);
    console.error('\n💡 Verifique:');
    console.error('   1. PostgreSQL está rodando');
    console.error('   2. Banco "mentoria_sistema" existe');
    console.error('   3. Credenciais no .env estão corretas');
    console.error('   4. Permissões de acesso ao banco');
    
    process.exit(1);
  } finally {
    // Fechar conexão
    await sequelize.close();
    console.log('🔌 Conexão com banco fechada.');
  }
}

// Executar teste se este arquivo for chamado diretamente
if (require.main === module) {
  executarTeste();
}

export default executarTeste; 