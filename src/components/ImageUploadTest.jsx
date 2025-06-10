import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadProductImage } from '@/lib/imageUtils';
import { toast } from '@/components/ui/use-toast';

export function ImageUploadTest() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const { url } = await uploadProductImage(file, (progress) => {
        setProgress(progress);
      });

      toast({
        title: 'Upload concluído!',
        description: `A imagem está disponível em: ${url}`,
      });
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Teste de Upload de Imagem</h2>
      <div className="space-y-4">
        <input
          type="file"
          accept="image/jpeg,image/jpg"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-pink-50 file:text-pink-700
            hover:file:bg-pink-100"
        />
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-pink-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
