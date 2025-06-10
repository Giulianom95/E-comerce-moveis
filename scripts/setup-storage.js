import { supabase } from '../src/lib/supabaseClient.js';

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
