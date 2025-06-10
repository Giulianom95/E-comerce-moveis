export const MAX_FILE_SIZE_MB = 5; // 5MB
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateImage = async (file) => {
  // Validar tipo de arquivo
  if (!file.type.match(/image\/jpe?g/)) {
    throw new Error('Apenas imagens JPEG/JPG são permitidas.');
  }

  // Validar tamanho máximo
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Imagem muito grande. O tamanho máximo permitido é ${MAX_FILE_SIZE_MB}MB.`);
  }

  return file;
};

import { supabase } from './supabaseClient';

export const uploadProductImage = async (file, onProgress) => {
  const validatedFile = await validateImage(file);
  
  // Gerar um nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `produtos/${fileName}`;

  try {
    // Upload do arquivo
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, validatedFile, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          if (onProgress) {
            const percentage = (progress.loaded / progress.total) * 100;
            onProgress(Math.round(percentage));
          }
        },
      });

    if (error) throw error;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha ao fazer upload da imagem. Por favor, tente novamente.');
  }
};

export const deleteProductImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Falha ao deletar a imagem. Por favor, tente novamente.');
  }
};
