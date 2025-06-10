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
