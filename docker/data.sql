-- -----------------------------------------------------
-- Schema full-stack-sports-center
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `sports-center`;

USE `sports-center` ;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Type;
DROP TABLE IF EXISTS Brand;

-- Create the Brand table
CREATE TABLE `Brand` (
                         `Id` INT AUTO_INCREMENT PRIMARY KEY,
                         `Name` VARCHAR(255) NOT NULL
);

-- Insert data into the Brand table
INSERT INTO Brand (Name) VALUES
                             ('Adidas'),
                             ('ASICS'),
                             ('Victor'),
                             ('Yonex'),
                             ('Puma'),
                             ('Nike'),
                             ('Babolat');

-- Create the Type table
CREATE TABLE `Type` (
                        `Id` INT AUTO_INCREMENT PRIMARY KEY,
                        `Name` VARCHAR(255) NOT NULL
);

-- Insert data into the Type table
INSERT INTO Type (Name) VALUES
                            ('Shoes'),
                            ('Rackets'),
                            ('Football'),
                            ('Kit Bags');

-- Create the Product table
CREATE TABLE `Product` (
                           `Id` INT AUTO_INCREMENT PRIMARY KEY,
                           `Name` VARCHAR(255) NOT NULL,
                           `Description` TEXT,
                           `Price` DECIMAL(12, 2) NOT NULL,
                           `PictureUrl` VARCHAR(255),
                           `ProductTypeId` INT NOT NULL,
                           `ProductBrandId` INT NOT NULL,
                           FOREIGN KEY (`ProductTypeId`) REFERENCES `Type`(`Id`),
                           FOREIGN KEY (`ProductBrandId`) REFERENCES `Brand`(`Id`)
);

-- Insert data into the Product table with Updated Prices (Price * 190)
INSERT INTO Product (Name, Description, Price, PictureUrl, ProductTypeId, ProductBrandId) VALUES
                                                                                              ('Adidas Quick Force Indoor Badminton Shoes', 'Designed for professional as well as amateur badminton players...', 665000, 'images/Product/adidas_shoe-1.png', 1, 1),
                                                                                              ('Adidas Quick Force Indoor Badminton Shoes', 'Designed for professional as well as amateur badminton players...', 641250, 'images/Product/adidas_shoe-2.png', 1, 1),
                                                                                              ('Adidas Quick Force Indoor Badminton Shoes', 'Designed for professional as well as amateur badminton players...', 641250, 'images/Product/adidas_shoe-3.png', 1, 1),
                                                                                              ('Asics Gel Rocket 8 Indoor Court Shoes', 'The Asics Gel Rocket 8 Indoor Court Shoes (Orange/Silver)...', 807310, 'images/Product/asics_shoe-1.png', 1, 2),
                                                                                              ('Asics Gel Rocket 8 Indoor Court Shoes', 'The Asics Gel Rocket 8 Indoor Court Shoes (Orange/Silver)...', 664810, 'images/Product/asics_shoe-2.png', 1, 2),
                                                                                              ('Asics Gel Rocket 8 Indoor Court Shoes', 'The Asics Gel Rocket 8 Indoor Court Shoes (Orange/Silver)...', 664810, 'images/Product/asics_shoe-3.png', 1, 2),
                                                                                              ('Victor SHW503 F Badminton Shoes', 'PU Leather, Mesh, EVA, ENERGY MAX, Nylon sheet, Rubber', 454480, 'images/Product/victor_shoe-1.png', 1, 3),
                                                                                              ('Victor SHW503 F Badminton Shoes', 'PU Leather, Mesh, EVA, ENERGY MAX, Nylon sheet, Rubber', 570000, 'images/Product/victor_shoe-2.png', 1, 3),
                                                                                              ('YONEX Super Ace Light Badminton Shoes', 'Rule the game with Super Ace Light highlights...', 492100, 'images/Product/yonex_shoe-1.png', 1, 4),
                                                                                              ('YONEX Super Ace Light Badminton Shoes', 'Rule the game with Super Ace Light highlights...', 665000, 'images/Product/yonex_shoe-2.png', 1, 4),
                                                                                              ('YONEX Super Ace Light Badminton Shoes', 'Rule the game with Super Ace Light highlights...', 703000, 'images/Product/yonex_shoe-3.png', 1, 4),
                                                                                              ('Puma 19 FH Rubber Spike Cricket Shoes', 'With features and functions designed to withstand long hours...', 949810, 'images/Product/puma_shoe-1.png', 1, 5),
                                                                                              ('Puma 19 FH Rubber Spike Cricket Shoes', 'With features and functions designed to withstand long hours...', 988000, 'images/Product/puma_shoe-2.png', 1, 5),
                                                                                              ('Puma 19 FH Rubber Spike Cricket Shoes', 'With features and functions designed to withstand long hours...', 1083000, 'images/Product/puma_shoe-3.png', 1, 5),
                                                                                              ('Babolat Shadow Spirit Mens Badminton Shoes (Cloisonne/Strike)', 'Babolat Shadow Spirit Mens Badminton Shoes (Cloisonne/Strike)', 783750, 'images/Product/babolat_shoe-1.png', 1, 7),
                                                                                              ('Babolat Shadow Tour Mens Badminton Shoes (White/Blue)', 'Babolat Shadow Tour Mens Badminton Shoes (White/Blue)', 997310, 'images/Product/babolat_shoe-2.png', 1, 7),
                                                                                              ('Babolat Shadow Team Womens Badminton Shoes (Black/Peony)', 'Babolat Shadow Team Womens Badminton Shoes (Black/Peony)', 569810, 'images/Product/babolat_shoe-3.png', 1, 7),
                                                                                              ('Yonex VCORE Pro 100 A Tennis Racquet (270gm, Strung)', 'For offensive players looking to win with game-changing spin and power.', 1158810, 'images/Product/yonex-racket-1.png', 2, 4),
                                                                                              ('Yonex VCORE Pro 100 A Tennis Racquet (290gm, Strung)', 'For offensive players looking to win with game-changing spin and power.', 1215810, 'images/Product/yonex-racket-2.png', 2, 4),
                                                                                              ('Yonex VCORE Pro 100 2019 Tennis Racquet (280gm, Unstrung)', 'For offensive players looking to win with game-changing spin and power.', 2526810, 'images/Product/yonex-racket-3.png', 2, 4),
                                                                                              ('Babolat Boost D Tennis Racquet (260gm, Strung)', 'Babolat Boost D Tennis Racquet (260gm, Strung)', 1329810, 'images/Product/babolat-racket-1.png', 2, 7),
                                                                                              ('Buy Babolat Pure Aero 2019 Superlite Tennis Racquet', 'Babolat Pure Aero 2019 Superlite Tennis Racquet (Unstrung, 255gm)', 2470000, 'images/Product/babolat-racket-2.png', 2, 7),
                                                                                              ('Babolat Pure Drive VS Tennis Racquet (Pair, 300gm, Strung)', 'Babolat Pure Drive VS Tennis Racquet (Pair, 300gm, Strung)', 6460000, 'images/Product/babolat-racket-3.png', 2, 7),
                                                                                              ('Adidas FIFA World Cup 2018 OMB Football (White/Red/Black)', 'Featuring an innovative surface panel design...', 474810, 'images/Product/adidas_football-1.png', 3, 1),
                                                                                              ('Adidas FIFA World Cup 2018 OMB Football', 'Featuring an innovative surface panel design...', 608000, 'images/Product/adidas_football-2.png', 3, 1),
                                                                                              ('Adidas FIFA World Cup Top Glider Ball', 'Featuring an innovative surface panel design...', 474810, 'images/Product/adidas_football-3.png', 3, 1),
                                                                                              ('Nike Pitch Premier League Football (Yellow/Purple)', 'Nike Pitch Premier League Football (Yellow/Purple) Ball...', 289750, 'images/Product/Nike-Football-1.png', 3, 6),
                                                                                              ('Nike Manchester City Supporters Football (Berry)', 'Nike Manchester City Supporters Football (Berry) Ball...', 289750, 'images/Product/Nike-Football-2.png', 3, 6),
                                                                                              ('Nike Mercurial Veer Football (White/Green/Black)', 'Nike Mercurial Veer Football (White/Green/Black) Ball...', 275500, 'images/Product/Nike-Football-3.png', 3, 6),
                                                                                              ('Babolat Team Line Racket 12 Kit Bag (Fluorescent Red)', 'The Babolat Team Line racquet bag is highly durable...', 864500, 'images/Product/babolat-kitback-1.png', 4, 7),
                                                                                              ('Babolat Pure Strike RH X12 Kit Bag (White/Red)', 'Babolat Pure Strike 12-Pack Bag will effortlessly hold...', 1861810, 'images/Product/babolat-kitback-2.png', 4, 7),
                                                                                              ('Babolat Team Line 12 Racquet Kit Bag (Silver)', 'Babolat Team Line 12 Racquet Kit Bag (Silver)...', 864500, 'images/Product/babolat-kitback-3.png', 4, 7),
                                                                                              ('Yonex SUNR 4826TK BT6-SR Badminton Kit Bag (Black/Red/White)', 'Yonex SUNR 4826TK BT6-SR Badminton Kit Bag', 379810, 'images/Product/yonex-kitback-1.png', 4, 4),
                                                                                              ('Yonex SUNR LRB05 MS BT6 S Badminton Kit Bag (Blue/Red)', 'Yonex SUNR LRB05 MS BT6 S Badminton Kit Bag', 284810, 'images/Product/yonex-kitback-2.png', 4, 4),
                                                                                              ('Yonex SUNR LRB05 MS BT6 S Badminton Kit Bag (Grey/Orange)', 'Yonex SUNR LRB05 MS BT6 S Badminton Kit Bag', 284810, 'images/Product/yonex-kitback-3.png', 4, 4);