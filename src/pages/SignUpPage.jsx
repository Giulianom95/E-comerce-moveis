import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Mail, Lock, User as UserIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const handleCpfChange = (e) => {
    setCpf(formatCPF(e.target.value));
  };

  const validateCpfRealnessAndUniqueness = async (cpfToValidate) => {
    const cleanedCpf = cpfToValidate.replace(/\D/g, '');
    if (!cpfValidator.isValid(cleanedCpf)) {
      toast({
        title: 'CPF Inválido',
        description: 'O CPF informado não parece ser válido.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('cpf', cleanedCpf)
        .maybeSingle();

      if (error) {
        console.error("Error checking CPF uniqueness:", error);
        toast({
          title: 'Erro ao verificar CPF',
          description: 'Não foi possível verificar o CPF. Tente novamente.',
          variant: 'destructive',
        });
        return false;
      }
      if (data) {
        toast({
          title: 'CPF já cadastrado',
          description: 'Este CPF já está associado a outra conta.',
          variant: 'destructive',
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error("Exception checking CPF uniqueness:", e);
      toast({
        title: 'Erro ao verificar CPF',
        description: 'Ocorreu um problema inesperado.',
        variant: 'destructive',
      });
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Erro de Validação',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Erro de Validação',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const isCpfValidAndUnique = await validateCpfRealnessAndUniqueness(cpf);
    if (!isCpfValidAndUnique) {
      setLoading(false);
      return;
    }
    
    const cleanedCpf = cpf.replace(/\D/g, '');
    const { success: signUpSuccess, user: signedUpUser } = await signUp(email, password, { full_name: fullName, cpf: cleanedCpf });
    
    if (signUpSuccess && signedUpUser) {
      // The AuthContext's signUp now handles the toast for email confirmation or successful login.
      // If email verification is not required by Supabase settings, user is logged in.
      // If it is required, user needs to confirm email.
      // We can navigate to login or home depending on this. For now, let's assume email verification is on.
      // navigate('/'); // Or navigate to a page that says "check your email"
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">DormeBem</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-700">Crie sua conta</h1>
          <p className="text-gray-500">É rápido e fácil!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
           <div>
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="cpf"
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                className="pl-10"
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Crie uma senha (min. 6 caracteres)"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg text-base"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-pink-600 hover:underline">
            Faça login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;