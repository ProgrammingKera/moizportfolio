/*
  # Create function to get contact messages for admin panel

  1. Function
    - `get_contact_messages()` - Returns all contact messages
    - Uses SECURITY DEFINER to bypass RLS
    - Only accessible to authenticated users

  2. Security
    - Function has SECURITY DEFINER to access data
    - Grant execute permission to authenticated users only
*/

CREATE OR REPLACE FUNCTION get_contact_messages()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  subject text,
  message text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.id,
    cm.name,
    cm.email,
    cm.subject,
    cm.message,
    cm.created_at
  FROM contact_messages cm
  ORDER BY cm.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION get_contact_messages() TO authenticated;