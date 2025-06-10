import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export function ConnectionError() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleConnectionFailed = () => {
      setIsVisible(true);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao banco de dados. Tentando reconectar..."
      });
    };

    const handleConnectionSuccess = () => {
      setIsVisible(false);
      toast({
        title: "Conexão restaurada",
        description: "A conexão com o banco de dados foi restabelecida."
      });
    };

    const handleInitializationFailed = (event) => {
      setIsVisible(true);
      toast({
        variant: "destructive",
        title: "Erro de inicialização",
        description: `Não foi possível inicializar a conexão: ${event.detail?.error || 'Erro desconhecido'}`
      });
    };

    window.addEventListener('supabase:connection-failed', handleConnectionFailed);
    window.addEventListener('supabase:connected', handleConnectionSuccess);
    window.addEventListener('supabase:initialization-failed', handleInitializationFailed);

    return () => {
      window.removeEventListener('supabase:connection-failed', handleConnectionFailed);
      window.removeEventListener('supabase:connected', handleConnectionSuccess);
      window.removeEventListener('supabase:initialization-failed', handleInitializationFailed);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div>
          <h3 className="font-medium text-red-800">Problema de conexão</h3>
          <p className="text-sm text-red-600">
            Tentando reconectar ao servidor...
          </p>
        </div>
      </div>
    </div>
  );
}
