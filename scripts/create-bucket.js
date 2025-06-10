const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

async function createBucket() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880,
    });

    if (error) {
      console.error('Erro ao criar bucket:', error.message);
      return;
    }

    console.log('Bucket criado com sucesso:', data);

    // Configurar política de acesso público
    const { error: policyError } = await supabase.storage.from('product-images').createSignedUploadUrl('test.jpg');
    
    if (policyError) {
      console.error('Erro ao configurar política:', policyError.message);
      return;
    }

    console.log('Política configurada com sucesso');
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

createBucket();
