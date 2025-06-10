import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

async function validateEnv() {
  console.log(chalk.blue('🔍 Validando variáveis de ambiente...'));
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(chalk.red('❌ Variáveis de ambiente ausentes:'));
    missing.forEach(key => {
      console.error(chalk.red(`   - ${key}`));
    });
    process.exit(1);
  }

  console.log(chalk.green('✅ Todas as variáveis de ambiente necessárias estão presentes'));
  
  console.log(chalk.blue('🔍 Testando conexão com Supabase...'));
  
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    console.log(chalk.green('✅ Conexão com Supabase estabelecida com sucesso'));
    
  } catch (error) {
    console.error(chalk.red('❌ Erro ao conectar com Supabase:'));
    console.error(chalk.red(`   ${error.message}`));
    console.error(chalk.yellow('\nPossíveis soluções:'));
    console.error(chalk.yellow('1. Verifique se as credenciais do Supabase estão corretas'));
    console.error(chalk.yellow('2. Verifique se o projeto Supabase está online'));
    console.error(chalk.yellow('3. Verifique sua conexão com a internet'));
    process.exit(1);
  }
}

validateEnv().catch(error => {
  console.error(chalk.red('❌ Erro durante a validação:'));
  console.error(chalk.red(error));
  process.exit(1);
});
