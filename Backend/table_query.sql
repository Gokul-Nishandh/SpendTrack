CREATE DATABASE spendtrack;
USE spendtrack;

CREATE TABLE user_data (
    user_id INT PRIMARY KEY,  -- Added PRIMARY KEY
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    budget FLOAT
);

CREATE TABLE friends (
    user_id INT,
    friend_id INT,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

CREATE TABLE expense (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amt DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL, 
    `date` DATE,
    mode VARCHAR(100) NOT NULL,
    `description` VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

CREATE TABLE sync_bank (
    sync_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT,
    amount DECIMAL(10,2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    category VARCHAR(100),
    status ENUM('pending', 'processed', 'ignored') DEFAULT 'pending',
    FOREIGN KEY (expense_id) REFERENCES expense(expense_id) ON DELETE SET NULL
);

CREATE TABLE grp(
    grp_name VARCHAR(100),
    grp_id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE grp_has_user(
    user_id INT,
    grp_id INT,
    FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE,
    FOREIGN KEY (grp_id) REFERENCES grp(grp_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, grp_id)
);

CREATE TABLE grp_has_expense(
    grp_id INT,
    expense_id INT,
    FOREIGN KEY (grp_id) REFERENCES grp(grp_id) ON DELETE CASCADE,
    FOREIGN KEY (expense_id) REFERENCES expense(expense_id) ON DELETE CASCADE,
    PRIMARY KEY (grp_id, expense_id)
);

CREATE TABLE suggestions(
    sug_id INT AUTO_INCREMENT PRIMARY KEY,
    suggestion VARCHAR(500) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Your triggers remain the same
DELIMITER //

CREATE TRIGGER before_insert_user
BEFORE INSERT ON user_data
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NULL THEN
        SET NEW.user_id = (SELECT COALESCE(MAX(user_id), 0) + 1 FROM user_data);
    END IF;
END;
//

CREATE TRIGGER before_insert_expense
BEFORE INSERT ON expense
FOR EACH ROW
BEGIN
    IF NEW.expense_id IS NULL THEN
        SET NEW.expense_id = (SELECT COALESCE(MAX(expense_id), 0) + 1 FROM expense);
    END IF;
END;
//

CREATE TRIGGER before_insert_grp
BEFORE INSERT ON grp
FOR EACH ROW
BEGIN
    IF NEW.grp_id IS NULL THEN
        SET NEW.grp_id = (SELECT COALESCE(MAX(grp_id), 0) + 1 FROM grp);
    END IF;
END;
//

CREATE TRIGGER before_insert_sync
BEFORE INSERT ON sync_bank
FOR EACH ROW
BEGIN
    IF NEW.sync_id IS NULL THEN
        SET NEW.sync_id = (SELECT COALESCE(MAX(sync_id), 0) + 1 FROM sync_bank);
    END IF;
END;
//

CREATE TRIGGER before_insert_sugg
BEFORE INSERT ON suggestions
FOR EACH ROW
BEGIN
    IF NEW.sug_id IS NULL THEN
        SET NEW.sug_id = (SELECT COALESCE(MAX(sug_id), 0) + 1 FROM suggestions);
    END IF;
END;
//

DELIMITER ;