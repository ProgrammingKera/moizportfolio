/*
  # Fix Contact Messages RLS Policy - Grant SELECT to Anonymous Users

  1. Policy Updates
    - Grant SELECT permission to anonymous users
    - This is required for RLS policy evaluation during INSERT operations
    - Ensures contact form works for anonymous users

  2. Security
    - Allow anonymous SELECT (required for RLS evaluation)
    - Allow anonymous INSERT (contact form submissions)
    - Allow authenticated SELECT (admin panel)
    - Allow authenticated DELETE (admin panel)
*/

-- Grant SELECT permission to anonymous users (required for RLS evaluation)
GRANT SELECT ON contact_messages TO anon;

-- Ensure all other permissions are in place
GRANT INSERT ON contact_messages TO anon;
GRANT INSERT ON contact_messages TO authenticated;
GRANT SELECT ON contact_messages TO authenticated;
GRANT DELETE ON contact_messages TO authenticated;