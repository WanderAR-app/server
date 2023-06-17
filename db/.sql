CREATE DATABASE IF NOT EXISTS `wandercore` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `wandercore`;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    connected_with VARCHAR(255),
    PRIMARY KEY (id)
);