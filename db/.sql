CREATE DATABASE IF NOT EXISTS `wandercore` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `wandercore`;

CREATE TABLE user_account (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE external_provider (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) UNIQUE NOT NULL,
    ws_end_point VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO external_provider (name, ws_end_point) VALUES ('google', 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=');

CREATE TABLE user_login_data_external (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    external_provider_id INT NOT NULL,
    external_provider_token VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account(id),
    FOREIGN KEY (external_provider_id) REFERENCES external_provider(id)
);

CREATE TABLE user_login_data (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account(id)
);

CREATE TABLE society (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE location (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    society_id INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (society_id) REFERENCES society(id),
    UNIQUE (society_id, name)
);

CREATE TABLE user_role (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    rank INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    UNIQUE (location_id, name)
);

CREATE TABLE map (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    location_id INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    floors INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE map_tile (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    map_id INT NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL,
    floor INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (map_id) REFERENCES map(id)
);

CREATE TABLE room (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    location_id INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    map_tile_id INT NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL,
    geometry TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (map_tile_id) REFERENCES map_tile(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE room_rank (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    room_id INT NOT NULL,
    rank INT NOT NULL,
    rule INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (room_id) REFERENCES room(id)
);

CREATE TABLE type (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    name VARCHAR(255) UNIQUE NOT NULL,
    icon_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE pin_point (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    room_id INT NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL,
    destination BOOLEAN NOT NULL DEFAULT FALSE,
    type_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (room_id) REFERENCES room(id),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (type_id) REFERENCES type(id)
);

CREATE TABLE favorite (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    pin_point_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user_account(id),
    FOREIGN KEY (pin_point_id) REFERENCES pin_point(id)
);