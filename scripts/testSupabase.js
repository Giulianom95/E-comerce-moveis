import { runAllTests } from '../src/lib/supabaseTest.js';

runAllTests()
  .then((success) => {
    if (success) {
      console.log('🎉 Testes completados com sucesso!');
      process.exit(0);
    } else {
      console.error('❌ Alguns testes falharam.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Erro ao executar testes:', error);
    process.exit(1);
  });
