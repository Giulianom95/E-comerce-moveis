import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupStorage() {
  try {
    // Criar o bucket para imagens de produtos
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 5242880, // 5MB em bytes
    });

    if (bucketError) {
      console.error('Erro ao criar o bucket:', bucketError);
      return;
    }

    console.log('Bucket criado com sucesso:', bucket);

    // Configurar políticas de acesso público
    const { error: policyError } = await supabase.storage.from('product-images').createSignedUrl(
      'test.txt',
      60,
      {
        transform: {
          width: 800,
          height: 600,
          resize: 'cover'
        }
      }
    );

    if (policyError) {
      console.error('Erro ao configurar políticas:', policyError);
      return;
    }

    console.log('Configuração de storage concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a configuração:', error);
  }
}

setupStorage();
