// Validação das variáveis de ambiente durante o build
const requiredEnvVars = [
  { name: 'VITE_SUPABASE_URL', value: 'https://epxankmtukyjyybltajm.supabase.co' },
  { name: 'VITE_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8' }
];

const missingVars = requiredEnvVars.filter(({ name, value }) => {
  const envValue = process.env[name] || value;
  if (!envValue) {
    console.warn(`⚠️ Variável de ambiente ${name} não encontrada no processo.`);
    console.warn('Usando valor padrão como fallback.');
    process.env[name] = value;
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
