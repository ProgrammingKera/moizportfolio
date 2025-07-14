/*
  # Create Admin Panel Tables for Portfolio Management

  1. New Tables
    - `personal_info` - Store personal information
    - `skills` - Store skills with categories and levels
    - `education` - Store education details
    - `projects` - Store project information
    - `cv_files` - Store CV file information
    - `profile_images` - Store profile image information

  2. Security
    - Enable RLS on all tables
    - Allow authenticated users full CRUD access
    - Public read access for portfolio display
*/

-- Personal Information Table
CREATE TABLE IF NOT EXISTS personal_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  bio text NOT NULL,
  github_url text,
  linkedin_url text,
  website_url text,
  years_experience integer DEFAULT 0,
  projects_completed integer DEFAULT 0,
  cgpa text,
  teaching_experience text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer NOT NULL CHECK (level >= 0 AND level <= 100),
  icon text,
  color text DEFAULT 'from-blue-500 to-cyan-500',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  location text,
  start_date date,
  end_date date,
  cgpa text,
  description text,
  achievements text[],
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  image_url text,
  tech_stack text[],
  category text NOT NULL,
  features text[],
  demo_url text,
  github_url text,
  status text DEFAULT 'completed',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CV Files Table
CREATE TABLE IF NOT EXISTS cv_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  is_active boolean DEFAULT true,
  uploaded_at timestamptz DEFAULT now()
);

-- Profile Images Table
CREATE TABLE IF NOT EXISTS profile_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  is_active boolean DEFAULT true,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Personal Info
CREATE POLICY "Public can read personal info" ON personal_info FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage personal info" ON personal_info FOR ALL TO authenticated USING (true);

-- RLS Policies for Skills
CREATE POLICY "Public can read skills" ON skills FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage skills" ON skills FOR ALL TO authenticated USING (true);

-- RLS Policies for Education
CREATE POLICY "Public can read education" ON education FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage education" ON education FOR ALL TO authenticated USING (true);

-- RLS Policies for Projects
CREATE POLICY "Public can read projects" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL TO authenticated USING (true);

-- RLS Policies for CV Files
CREATE POLICY "Public can read active CV files" ON cv_files FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Authenticated users can manage CV files" ON cv_files FOR ALL TO authenticated USING (true);

-- RLS Policies for Profile Images
CREATE POLICY "Public can read active profile images" ON profile_images FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Authenticated users can manage profile images" ON profile_images FOR ALL TO authenticated USING (true);

-- Insert default personal info
INSERT INTO personal_info (
  name, title, email, phone, location, bio, github_url, linkedin_url,
  years_experience, projects_completed, cgpa, teaching_experience
) VALUES (
  'Muhammad Moiz Rashad',
  'Full-Stack Web Developer & Software Engineer',
  'mmoizrashad@gmail.com',
  '+92 344 7562543',
  'Mohallah Sheikhan Sarai Alamgir, Gujrat, Pakistan',
  'I am enthusiastic about pursuing a professional role in web development. I possess extensive knowledge in software engineering principles and have honed my skills in web technologies through academic projects and personal initiatives.',
  'https://github.com/mmoizrashad',
  'https://www.linkedin.com/in/muhammad-moiz-rashad-swe',
  1,
  7,
  '3.52',
  '1+ Years Teaching'
) ON CONFLICT DO NOTHING;

-- Insert default skills
INSERT INTO skills (name, category, level, color) VALUES
  ('HTML5', 'Frontend Development', 95, 'from-orange-500 to-red-500'),
  ('CSS3', 'Frontend Development', 90, 'from-blue-500 to-cyan-500'),
  ('JavaScript', 'Frontend Development', 88, 'from-yellow-500 to-orange-500'),
  ('Vue.js', 'Frontend Development', 85, 'from-green-500 to-emerald-500'),
  ('React.js', 'Frontend Development', 82, 'from-blue-500 to-cyan-500'),
  ('Bootstrap', 'Frontend Development', 90, 'from-purple-500 to-pink-500'),
  ('Node.js', 'Backend Development', 85, 'from-green-500 to-emerald-500'),
  ('Express.js', 'Backend Development', 88, 'from-gray-500 to-gray-700'),
  ('MySQL', 'Database & Data', 85, 'from-blue-500 to-indigo-500'),
  ('Git & GitHub', 'Tools & Technologies', 88, 'from-gray-500 to-black'),
  ('Python', 'AI & Machine Learning', 75, 'from-blue-500 to-yellow-500'),
  ('Communication', 'Soft Skills', 92, 'from-pink-500 to-rose-500')
ON CONFLICT DO NOTHING;

-- Insert default education
INSERT INTO education (
  degree, institution, location, start_date, end_date, cgpa, description, achievements
) VALUES (
  'BS Software Engineering',
  'University of Gujarat',
  'Gujrat, Pakistan',
  '2020-01-01',
  '2024-12-31',
  '3.52',
  'Specialized in web technologies and software development principles',
  ARRAY['Software Engineering Society Appreciation Award', 'Class Representative', 'Active member solving complex tasks']
) ON CONFLICT DO NOTHING;

-- Insert default projects
INSERT INTO projects (
  title, subtitle, description, tech_stack, category, features, status, is_featured, sort_order
) VALUES
  (
    'PharmaTech',
    'Pharmaceutical Management System',
    'A complete pharmaceutical solution with modules like product forecasting, vendor integration, real-time dashboards, and analytics.',
    ARRAY['Vue.js', 'Node.js', 'MySQL', 'Express.js'],
    'fullstack',
    ARRAY['Product forecasting algorithms', 'Vendor integration module', 'Real-time dashboard', 'Data analytics and reporting'],
    'completed',
    true,
    1
  ),
  (
    'POS System',
    'Point of Sale Integration',
    'User-friendly POS interface that syncs sales and inventory in real-time.',
    ARRAY['Express.js', 'Vue.js', 'MySQL'],
    'frontend',
    ARRAY['Real-time inventory sync', 'Transaction processing', 'Sales reporting'],
    'completed',
    true,
    2
  ),
  (
    'PharmaMastermind',
    'AI Decision Support System',
    'An AI-based inventory decision support system using KPIs and MCDM algorithms.',
    ARRAY['Python Flask', 'pyDecision', 'AI/ML'],
    'ai',
    ARRAY['KPI analysis', 'MCDM algorithms', 'Stock optimization'],
    'in_progress',
    true,
    3
  )
ON CONFLICT DO NOTHING;

-- Insert default CV file
INSERT INTO cv_files (filename, file_url, mime_type, is_active) VALUES
  ('resume.pdf', '/resume.pdf', 'application/pdf', true)
ON CONFLICT DO NOTHING;

-- Insert default profile image
INSERT INTO profile_images (filename, image_url, alt_text, is_active) VALUES
  ('profile.jpg', '/IMG-20241207-WA0088.jpg', 'Muhammad Moiz Rashad', true)
ON CONFLICT DO NOTHING;

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();