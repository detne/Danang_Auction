-- USERS
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE,
                       phone_number VARCHAR(50),
                       first_name VARCHAR(100),
                       middle_name VARCHAR(100),
                       last_name VARCHAR(100),
                       gender ENUM('male', 'female', 'other'),
                       dob DATE,
                       province VARCHAR(100),
                       district VARCHAR(100),
                       ward VARCHAR(100),
                       detailed_address VARCHAR(255),
                       identity_number VARCHAR(255),
                       identity_issue_date DATE,
                       identity_issue_place VARCHAR(255),
                       bank_account_number VARCHAR(100),
                       bank_name VARCHAR(255),
                       bank_account_holder VARCHAR(255),
                       account_type ENUM('personal', 'organization') DEFAULT 'personal',
                       role VARCHAR(255) NOT NULL,
                       verified BOOLEAN DEFAULT FALSE,
                       status ENUM('active', 'banned', 'suspended') DEFAULT 'active',
                       reset_token VARCHAR(255),
                       reset_token_expiry DATETIME,
                       identity_front_url VARCHAR(255),
                       identity_back_url VARCHAR(255),
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- CATEGORIES
CREATE TABLE categories (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- AUCTION SESSIONS
CREATE TABLE auction_sessions (
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  session_code VARCHAR(255) UNIQUE,
                                  title VARCHAR(255),
                                  description TEXT,
                                  status ENUM('draft', 'pending', 'approved', 'running', 'finished', 'cancelled') DEFAULT 'draft',
                                  type ENUM('online', 'offline') DEFAULT 'online',
                                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PARTICIPANTS
CREATE TABLE auction_session_participants (
                                              user_id INT,
                                              auction_session_id INT,
                                              role VARCHAR(50),
                                              status ENUM('new', 'approved', 'rejected', 'refunded') DEFAULT 'new',
                                              deposit_status ENUM('pending', 'paid', 'refunded', 'cancelled', 'failed') DEFAULT 'pending',
                                              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                              PRIMARY KEY (user_id, auction_session_id),
                                              FOREIGN KEY (user_id) REFERENCES users(id),
                                              FOREIGN KEY (auction_session_id) REFERENCES auction_sessions(id)
);

-- TÀI SẢN (AUCTION DOCUMENTS)
CREATE TABLE auction_documents (
                                   id INT AUTO_INCREMENT PRIMARY KEY,
                                   document_code VARCHAR(255) UNIQUE,
                                   user_id INT,
                                   session_id INT,
                                   category_id INT,
                                   description TEXT,
                                   deposit_amount DECIMAL(15,2),
                                   is_deposit_required BOOLEAN DEFAULT TRUE,
                                   status ENUM('pending_create', 'pending_approval', 'upcoming', 'active', 'completed', 'cancelled') DEFAULT 'pending_create',
                                   auction_type ENUM('public', 'private', 'restricted') DEFAULT 'public',
                                   starting_price DECIMAL(15,2),
                                   step_price DECIMAL(15,2),
                                   registered_at DATETIME,
                                   start_time DATETIME,
                                   end_time DATETIME,
                                   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   FOREIGN KEY (user_id) REFERENCES users(id),
                                   FOREIGN KEY (session_id) REFERENCES auction_sessions(id),
                                   FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- PAYMENTS
CREATE TABLE payments (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          type ENUM('deposit', 'refund', 'final') NOT NULL,
                          status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
                          price DECIMAL(15,2) NOT NULL,
                          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                          user_id INT,
                          session_id INT,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          FOREIGN KEY (session_id) REFERENCES auction_sessions(id)
);

-- AUCTION BIDS
CREATE TABLE auction_bids (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              price DECIMAL(15,2) NOT NULL,
                              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                              user_id INT,
                              session_id INT,
                              FOREIGN KEY (user_id) REFERENCES users(id),
                              FOREIGN KEY (session_id) REFERENCES auction_sessions(id)
);

-- IMAGES
CREATE TABLE images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        url TEXT NOT NULL,
                        public_id VARCHAR(255) NOT NULL,
                        type VARCHAR(50),
                        size INT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- IMAGE RELATION
CREATE TABLE image_relation (
                                image_id INT NOT NULL,
                                image_fk_id INT NOT NULL,
                                type ENUM('asset', 'auction') NOT NULL,
                                PRIMARY KEY (image_id),
                                FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);



