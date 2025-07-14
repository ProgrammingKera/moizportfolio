/*
  # Fix Contact Messages RLS Policy

  1. Policy Updates
    - Drop all existing policies
    - Create simple policy allowing all operations for public users
    - Ensure contact form works without authentication

  2. Security
    - Allow public INSERT (contact form submissions)
    - Allow authenticated SELECT (admin panel)
    - Allow authenticated DELETE (admin panel)
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can read messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can read all messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON contact_messages;
DROP POLICY IF EXISTS "Anonymous can insert contact messages" ON contact_messages;

-- Create new comprehensive policies
CREATE POLICY "Enable insert for all users"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT INSERT ON contact_messages TO anon;
GRANT INSERT ON contact_messages TO authenticated;
GRANT SELECT ON contact_messages TO authenticated;
GRANT DELETE ON contact_messages TO authenticated;