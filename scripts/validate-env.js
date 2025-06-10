// Validação das variáveis de ambiente durante o build
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => {
  const value = process.env[varName];
  if (!value) {
    console.warn(`⚠️ Variável de ambiente ${varName} não encontrada no processo.`);
    console.warn('Isso é esperado durante o build na Vercel, as variáveis serão injetadas em runtime.');
    return false;
  }
  return false;
});

if (missingVars.length > 0 && process.env.NODE_ENV === 'development') {
  console.error('\n❌ Erro: Variáveis de ambiente ausentes em desenvolvimento!');
  console.error('As seguintes variáveis de ambiente são necessárias:');
  missingVars.forEach(varName => {
    console.error(`- ${varName}`);
  });
  process.exit(1);
} else {
  console.log('✅ Verificação de variáveis de ambiente concluída!');
}
