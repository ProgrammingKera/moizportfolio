import { supabase } from './supabase'

// Personal Info API
export interface PersonalInfo {
  id?: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  github_url?: string
  linkedin_url?: string
  website_url?: string
  years_experience: number
  projects_completed: number
  cgpa: string
  teaching_experience: string
  created_at?: string
  updated_at?: string
}

export const personalInfoApi = {
  async get(): Promise<PersonalInfo | null> {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async upsert(info: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const { data, error } = await supabase
      .from('personal_info')
      .upsert(info)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Skills API
export interface Skill {
  id?: string
  name: string
  category: string
  level: number
  icon?: string
  color: string
  created_at?: string
  updated_at?: string
}

export const skillsApi = {
  async getAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async create(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, skill: Partial<Skill>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Education API
export interface Education {
  id?: string
  degree: string
  institution: string
  location?: string
  start_date?: string
  end_date?: string
  cgpa?: string
  description?: string
  achievements?: string[]
  is_current: boolean
  created_at?: string
  updated_at?: string
}

export const educationApi = {
  async getAll(): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> {
    const { data, error } = await supabase
      .from('education')
      .insert(education)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, education: Partial<Education>): Promise<Education> {
    const { data, error } = await supabase
      .from('education')
      .update(education)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Projects API
export interface Project {
  id?: string
  title: string
  subtitle?: string
  description: string
  image_url?: string
  tech_stack: string[]
  category: string
  features: string[]
  demo_url?: string
  github_url?: string
  status: string
  is_featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// CV Files API
export interface CVFile {
  id?: string
  filename: string
  file_url: string
  file_size?: number
  mime_type?: string
  is_active: boolean
  uploaded_at?: string
}

export const cvApi = {
  async getActive(): Promise<CVFile | null> {
    const { data, error } = await supabase
      .from('cv_files')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAll(): Promise<CVFile[]> {
    const { data, error } = await supabase
      .from('cv_files')
      .select('*')
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async upload(file: File): Promise<CVFile> {
    // First, upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `cv-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(fileName)

    // Deactivate all existing CV files
    await supabase
      .from('cv_files')
      .update({ is_active: false })
      .eq('is_active', true)

    // Insert new CV file record
    const { data, error } = await supabase
      .from('cv_files')
      .insert({
        filename: file.name,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        is_active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async setActive(id: string): Promise<void> {
    // Deactivate all CV files
    await supabase
      .from('cv_files')
      .update({ is_active: false })
      .eq('is_active', true)

    // Activate selected CV file
    const { error } = await supabase
      .from('cv_files')
      .update({ is_active: true })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cv_files')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Profile Images API
export interface ProfileImage {
  id?: string
  filename: string
  image_url: string
  alt_text?: string
  is_active: boolean
  uploaded_at?: string
}

export const profileImageApi = {
  async getActive(): Promise<ProfileImage | null> {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAll(): Promise<ProfileImage[]> {
    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async upload(file: File, altText?: string): Promise<ProfileImage> {
    // First, upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `profile-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    // Deactivate all existing profile images
    await supabase
      .from('profile_images')
      .update({ is_active: false })
      .eq('is_active', true)

    // Insert new profile image record
    const { data, error } = await supabase
      .from('profile_images')
      .insert({
        filename: file.name,
        image_url: publicUrl,
        alt_text: altText || 'Profile Image',
        is_active: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async setActive(id: string): Promise<void> {
    // Deactivate all profile images
    await supabase
      .from('profile_images')
      .update({ is_active: false })
      .eq('is_active', true)

    // Activate selected profile image
    const { error } = await supabase
      .from('profile_images')
      .update({ is_active: true })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}