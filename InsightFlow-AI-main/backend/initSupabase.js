import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setup() {
  console.log('Checking Supabase setup...')
  
  // Check bucket
  const bucketName = 'project-uploads'
  const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
  
  if (bucketListError) {
    console.error('Error listing buckets:', bucketListError)
  } else {
    const bucketExists = buckets.some(b => b.name === bucketName)
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' not found. Creating it...`)
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true, // Making it public so frontend can easily access files if needed, or false for private
        allowedMimeTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        fileSizeLimit: 52428800 // 50MB
      })
      if (createError) {
        console.error('Failed to create bucket:', createError)
      } else {
        console.log(`Bucket '${bucketName}' created successfully.`)
      }
    } else {
      console.log(`Bucket '${bucketName}' already exists.`)
    }
  }

  // Check uploads table
  const { error: tableError } = await supabase.from('uploads').select('id').limit(1)
  if (tableError) {
    console.log('Error checking uploads table:', tableError.message)
  } else {
    console.log('Uploads table exists and is readable.')
  }
}

setup()
