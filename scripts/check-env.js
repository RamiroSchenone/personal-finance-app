// Script para verificar las variables de entorno de Supabase
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Verificando variables de entorno de Supabase...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

let allGood = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (!value) {
    console.log(`❌ ${varName}: NO DEFINIDA`)
    allGood = false
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  }
})

console.log('\n' + '='.repeat(50))

if (allGood) {
  console.log('✅ Todas las variables están configuradas correctamente')
  console.log('🚀 Puedes ejecutar: npm run dev')
} else {
  console.log('❌ Faltan variables de entorno')
  console.log('\n📝 Crea un archivo .env.local en la raíz del proyecto con:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key')
} 