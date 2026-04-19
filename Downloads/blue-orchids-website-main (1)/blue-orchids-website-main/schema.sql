-- ============================================================
-- Blue Orchids – The Beauty Hub · Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS blue_orchids
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blue_orchids;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL,
  phone       VARCHAR(20)   NOT NULL,
  date        DATE          NOT NULL,
  time        VARCHAR(20)   NOT NULL,
  guests      INT           DEFAULT 1,
  special_requests TEXT     DEFAULT NULL,
  status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_date   (date),
  INDEX idx_status (status),
  INDEX idx_email  (email)
) ENGINE=InnoDB;
