/*
  # Fix RLS Policy for Contact Messages

  1. Policy Updates
    - Drop existing restrictive policies
    - Create new policy allowing public inserts
    - Allow authenticated users to read all messages
    - Allow authenticated users to delete messages

  2. Security
    - Public can insert contact messages (form submissions)
    - Only authenticated users can read messages (admin panel)
    - Only authenticated users can delete messages (admin panel)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can read messages" ON contact_messages;

-- Create new policies with proper permissions
CREATE POLICY "Public can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Also allow anonymous users to insert (for contact form)
CREATE POLICY "Anonymous can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);