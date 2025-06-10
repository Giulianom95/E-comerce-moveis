import imageCompression from 'browser-image-compression';

export const MAX_FILE_SIZE_MB = 5; // 5MB
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateAndCompressImage = async (file) => {
  // Validar tipo de arquivo
  if (!file.type.match(/image\/jpe?g/)) {
    throw new Error('Apenas imagens JPEG/JPG são permitidas.');
  }

  // Validar tamanho máximo
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const options = {
      maxSizeMB: MAX_FILE_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      throw new Error('Erro ao comprimir imagem. Tente uma imagem menor.');
    }
  }

  return file;
};
