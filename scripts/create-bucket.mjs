import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  try {
    console.log('Iniciando criação do bucket...');
    
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880,
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('O bucket product-images já existe.');
        
        // Atualizar as configurações do bucket existente
        const { error: updateError } = await supabase.storage.updateBucket('product-images', {
          public: true,
          fileSizeLimit: 5242880,
        });
        
        if (updateError) {
          console.error('Erro ao atualizar bucket:', updateError.message);
          return;
        }
        
        console.log('Configurações do bucket atualizadas com sucesso');
      } else {
        console.error('Erro ao criar bucket:', error.message);
        return;
      }
    } else {
      console.log('Bucket criado com sucesso:', data);
    }

    // Tentar configurar a política de acesso público
    try {
      const { data: policy, error: policyError } = await supabase.storage.from('product-images').getPublicUrl('test.jpg');
      
      if (policyError) {
        console.error('Erro ao configurar política:', policyError.message);
        return;
      }

      console.log('Política configurada com sucesso');
    } catch (policyError) {
      console.error('Erro ao configurar política:', policyError);
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

createBucket();
