CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);