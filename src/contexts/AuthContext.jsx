import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, full_name, cpf')
        .eq('id', userId)
        .maybeSingle(); 

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        setProfile(null);
        setIsAdmin(false);
      } else {
        setProfile(userProfile); 
        setIsAdmin(userProfile?.role === 'admin');
      }
    } catch (e) {
      console.error('Exception fetching profile:', e);
      setProfile(null);
      setIsAdmin(false);
    }
  }, []);


  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      } else {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          // This case handles when session becomes null (e.g., after signOut)
          setProfile(null);
          setIsAdmin(false);
        }
        // Explicitly clear states on SIGNED_OUT to be absolutely sure
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        title: 'Erro no Login',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
    // onAuthStateChange will handle setting user, profile, and isAdmin
    toast({
      title: 'Login bem-sucedido!',
      description: 'Bem-vindo de volta!',
    });
    // setLoading(false) will be handled by onAuthStateChange
    return true;
  };

  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: metadata.full_name,
        },
      },
    });

    if (error) {
      toast({
        title: 'Erro no Cadastro',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return { success: false, user: null };
    }

    if (data.user && metadata.cpf) {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const { error: profileUpdateError } = await supabase
        .from('user_profiles')
        .update({ cpf: metadata.cpf }) 
        .eq('id', data.user.id);

      if (profileUpdateError) {
        toast({
          title: 'Erro ao salvar CPF',
          description: profileUpdateError.message,
          variant: 'destructive',
        });
      }
    }
    
    if (data.user && !data.user.email_confirmed_at) {
       toast({
        title: 'Cadastro quase lá!',
        description: 'Enviamos um link de confirmação para o seu email.',
      });
    } else if (data.user) {
       toast({
        title: 'Cadastro realizado!',
        description: 'Bem-vindo! Seu login foi efetuado.',
      });
    }
    // setLoading(false) will be handled by onAuthStateChange
    return { success: true, user: data.user };
  };

  const signOut = async () => {
    setLoading(true); 
    const { error } = await supabase.auth.signOut();
    // The onAuthStateChange listener will handle setting user, profile, and isAdmin to null/false
    // and will also set loading to false.
    if (error) {
      toast({
        title: 'Erro ao Sair',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false); // Ensure loading is false in case of error before onAuthStateChange fires
    } else {
      toast({
        title: 'Logout realizado!',
        description: 'Até breve!',
      });
      // Explicitly clear here as well, though onAuthStateChange should also do it.
      // This provides a more immediate UI update if onAuthStateChange is delayed.
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    }
    // setLoading(false); // Let onAuthStateChange handle this to avoid race conditions
  };
  
  const refreshAuthAdminStatus = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.id);
      setLoading(false);
    }
  }

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    isAdmin,
    refreshAuthAdminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};