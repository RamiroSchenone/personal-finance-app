// Script para probar la conectividad con Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🧪 Probando conectividad con Supabase...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Variables de entorno faltantes')
  process.exit(1)
}

console.log('✅ Variables de entorno encontradas')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión...')
    
    // Probar una consulta simple
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Error en consulta (puede ser normal si las tablas no existen):', error.message)
    } else {
      console.log('✅ Conexión exitosa')
    }
    
    // Probar autenticación
    console.log('\n🔐 Probando autenticación...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Error en autenticación:', authError.message)
    } else {
      console.log('✅ Autenticación configurada correctamente')
      console.log('Session:', authData.session ? 'Activa' : 'No hay sesión')
    }
    
  } catch (error) {
    console.log('❌ Error de conectividad:', error.message)
  }
}

testConnection() 