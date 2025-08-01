-- Crear tabla para almacenar tokens de Mercado Pago
CREATE TABLE IF NOT EXISTS mercadopago_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type VARCHAR(50) NOT NULL,
  expires_in INTEGER NOT NULL,
  scope TEXT NOT NULL,
  user_id_mp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_mercadopago_tokens_user_id ON mercadopago_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mercadopago_tokens_expires_at ON mercadopago_tokens(expires_at);

-- Crear RLS policies
ALTER TABLE mercadopago_tokens ENABLE ROW LEVEL SECURITY;

-- Policy para que usuarios solo vean sus propios tokens
CREATE POLICY "Users can view own mercadopago tokens" ON mercadopago_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- Policy para que usuarios solo inserten sus propios tokens
CREATE POLICY "Users can insert own mercadopago tokens" ON mercadopago_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy para que usuarios solo actualicen sus propios tokens
CREATE POLICY "Users can update own mercadopago tokens" ON mercadopago_tokens
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy para que usuarios solo eliminen sus propios tokens
CREATE POLICY "Users can delete own mercadopago tokens" ON mercadopago_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_mercadopago_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_mercadopago_tokens_updated_at
  BEFORE UPDATE ON mercadopago_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_mercadopago_tokens_updated_at(); 