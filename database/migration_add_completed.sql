-- Migration: Add completed field to cards table
-- Run this if your database already exists

USE trello_clone;

-- Add completed column if it doesn't exist
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Update existing cards to have completed = false
UPDATE cards SET completed = FALSE WHERE completed IS NULL;
