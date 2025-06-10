Você precisará fazer os seguintes passos no Supabase:

1. Vá para o painel do Supabase (https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "Storage" na barra lateral
4. Clique em "Create bucket"
5. Digite "product-images" como nome do bucket
6. Marque a opção "Public bucket"
7. Clique em "Create bucket"

Depois, vá para "Storage" -> "Policies" e adicione as seguintes políticas:

Para o bucket "product-images":

1. Política SELECT (download):
```sql
CREATE POLICY "Público pode ver imagens" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product-images');
```

2. Política INSERT (upload):
```sql
CREATE POLICY "Usuários autenticados podem fazer upload" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');
```

3. Política UPDATE:
```sql
CREATE POLICY "Apenas admin pode atualizar imagens" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images' AND auth.uid() IN (
    SELECT id FROM auth.users WHERE id = '6e129b7f-1f58-42f9-912c-0da648ce4409'
));
```

4. Política DELETE:
```sql
CREATE POLICY "Apenas admin pode deletar imagens" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images' AND auth.uid() IN (
    SELECT id FROM auth.users WHERE id = '6e129b7f-1f58-42f9-912c-0da648ce4409'
));
```

Depois de configurar o bucket e as políticas, você poderá:
1. Permitir que qualquer pessoa veja as imagens dos produtos
2. Permitir que usuários autenticados façam upload de imagens
3. Restringir a atualização e deleção de imagens apenas para o usuário admin
