import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFacebookAuth() {
  try {
    console.log('🔄 Testando autenticação com Facebook...');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        scopes: 'email',
        access_token: 'EAA4BnEJZBovkBO8MF6EQ2ZA8riEhRHPombzfwZAcxZCDHmqyZAyTWunD2giioNw68dEarlYJPmM5ytpNQGx92UO3gA0B7ZBJz1ZCaNK3RV4nf8hXCGIbWKZCTILzVgFW8egieHlPYjWtYZB3PJZCe0PXZCY6PMogM9yRDp7mktrtrKZCJacKUOTUumtJ32lF6d6n2EWjf5JSc45dbVYP91uBZBFsZAXsMLbMxrqVhsX9NSZCzGmGZBZAxUQTuoGJpPBZCdHUGrWQQkw8zOQwZDZD'
      }
    });

    if (error) {
      console.error('❌ Erro na autenticação:', error.message);
      return;
    }

    console.log('✅ Autenticação bem-sucedida!');
    console.log('📝 Dados do usuário:', data);

    // Verificar o perfil do usuário
    if (data?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError.message);
        return;
      }

      console.log('✅ Perfil do usuário:', profile);
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Executar o teste
testFacebookAuth();
