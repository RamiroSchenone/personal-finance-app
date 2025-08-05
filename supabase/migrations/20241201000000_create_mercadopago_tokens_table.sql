-- Crear tabla para almacenar tokens de Mercado Pago
CREATE TABLE IF NOT EXISTS mercado_pago_tokens (
  user_id BIGINT PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_mercado_pago_tokens_user_id ON mercado_pago_tokens(user_id);

-- Crear política RLS para que cada usuario solo vea sus propios tokens
ALTER TABLE mercado_pago_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own Mercado Pago tokens" ON mercado_pago_tokens
  FOR ALL USING (auth.uid()::bigint = user_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_mercadopago_tokens_updated_at 
  BEFORE UPDATE ON mercado_pago_tokens 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 