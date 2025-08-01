-- Insertar usuario de prueba directamente en auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  confirmed_at,
  last_sign_in_at,
  app_metadata,
  user_metadata,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'test@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Usuario de Prueba"}'::jsonb,
  false,
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Usuario de Prueba"}'::jsonb,
  'authenticated',
  'authenticated'
); 