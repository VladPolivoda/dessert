-- Створюємо БД із правильним кодуванням utf8mb4
CREATE DATABASE IF NOT EXISTS dessert_delivery
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
USE dessert_delivery;

-- Користувачі
CREATE TABLE IF NOT EXISTS users (
  id            INT            NOT NULL AUTO_INCREMENT,
  firebase_uid  VARCHAR(128)   NOT NULL,
  email         VARCHAR(100),
  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Пости
CREATE TABLE IF NOT EXISTS posts (
  id            INT            NOT NULL AUTO_INCREMENT,
  user_id       INT,
  title         VARCHAR(255),
  content       TEXT,
  created_at    DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Медіа (зображення/відео)
CREATE TABLE IF NOT EXISTS media (
  id            INT            NOT NULL AUTO_INCREMENT,
  post_id       INT            NOT NULL,
  file_url      VARCHAR(255),
  type          ENUM('image','video'),
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Коментарі
CREATE TABLE IF NOT EXISTS comments (
  id            INT            NOT NULL AUTO_INCREMENT,
  post_id       INT            NOT NULL,
  user_id       INT            NOT NULL,
  content       TEXT           NOT NULL,
  created_at    DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
