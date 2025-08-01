import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kphxpesxssoryiksphth.supabase.co'
const supabaseServiceKey = 'tu_service_role_key_aqui' // Reemplaza con tu service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@gmail.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuario de Prueba'
      }
    })

    if (error) {
      console.error('Error creando usuario:', error)
      return
    }

    console.log('Usuario creado exitosamente:', data.user)
  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser() 