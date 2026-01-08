-- Trello Clone Database Schema
-- Single board assumption: Only one board exists (id = 1)

-- Create database
CREATE DATABASE IF NOT EXISTS trello_clone;
USE trello_clone;

-- Lists table (columns in the board)
CREATE TABLE lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position DECIMAL(10, 2) NOT NULL, -- Allows fractional positions for easy reordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cards table (tasks within lists)
CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position DECIMAL(10, 2) NOT NULL, -- Position within the list
    completed BOOLEAN DEFAULT FALSE, -- Mark card as completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
    INDEX idx_list_position (list_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial data
INSERT INTO lists (id, title, position) VALUES
(1, 'To Do', 1.0),
(2, 'In Progress', 2.0),
(3, 'Done', 3.0);

INSERT INTO cards (list_id, title, description, position) VALUES
(1, 'Setup project', 'Initialize frontend and backend', 1.0),
(1, 'Design database', 'Create schema with proper relations', 2.0),
(2, 'Implement drag & drop', 'Add @dnd-kit integration', 1.0),
(3, 'Read assignment requirements', 'Understand all features needed', 1.0);
