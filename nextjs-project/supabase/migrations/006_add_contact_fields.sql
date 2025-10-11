-- Migration: Add contact fields to user_feedback table
-- Description: Add name and contact_type fields to support contact chatbot functionality

-- Add name field for storing contact person's name
ALTER TABLE public.user_feedback 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add contact_type field for distinguishing contact types
ALTER TABLE public.user_feedback 
ADD COLUMN IF NOT EXISTS contact_type TEXT 
CHECK (contact_type IN ('support', 'enterprise', 'general'));

-- Add comment for documentation
COMMENT ON COLUMN public.user_feedback.name IS 'Contact person name from chatbot form';
COMMENT ON COLUMN public.user_feedback.contact_type IS 'Type of contact: support, enterprise, or general';
