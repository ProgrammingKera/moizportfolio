import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validation with detailed logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables missing!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing')
  console.error('Please check your .env file')
} else {
  console.log('✅ Supabase environment variables loaded')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export interface ContactMessage {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
}

// Enhanced test connection function
export const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing')
    
    const { data, error } = await supabase
      .from('contact_messages')
      .select('count', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return false
    }
    
    console.log('✅ Supabase connected successfully!')
    console.log('Table accessible, count:', data)
    return true
  } catch (err: any) {
    console.error('❌ Connection test failed:', err)
    console.error('Error details:', err.message)
    return false
  }
}

// Function to check table structure
export const checkTableStructure = async () => {
  try {
    console.log('🔍 Checking table structure...')
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Table structure check failed:', error)
      return false
    }
    
    console.log('✅ Table structure OK')
    return true
  } catch (err) {
    console.error('❌ Table check error:', err)
    return false
  }
}