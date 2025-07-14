/*
  # Create RPC Function for Contact Messages

  1. Function Creation
    - Create insert_contact_message function
    - Bypass RLS using SECURITY DEFINER
    - Allow public access to function

  2. Security
    - Function runs with elevated privileges
    - Validates input data
    - Returns success/failure status
*/

-- Create function to insert contact messages
CREATE OR REPLACE FUNCTION insert_contact_message(
  p_name text,
  p_email text,
  p_subject text,
  p_message text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id uuid;
BEGIN
  -- Validate inputs
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Name is required');
  END IF;
  
  IF p_email IS NULL OR trim(p_email) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Email is required');
  END IF;
  
  IF p_subject IS NULL OR trim(p_subject) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Subject is required');
  END IF;
  
  IF p_message IS NULL OR trim(p_message) = '' THEN
    RETURN json_build_object('success', false, 'error', 'Message is required');
  END IF;

  -- Insert the message
  INSERT INTO contact_messages (name, email, subject, message)
  VALUES (trim(p_name), trim(p_email), trim(p_subject), trim(p_message))
  RETURNING id INTO result_id;

  -- Return success
  RETURN json_build_object(
    'success', true, 
    'id', result_id,
    'message', 'Contact message saved successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false, 
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION insert_contact_message(text, text, text, text) TO public;
GRANT EXECUTE ON FUNCTION insert_contact_message(text, text, text, text) TO anon;