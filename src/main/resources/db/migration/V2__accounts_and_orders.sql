ALTER TABLE Product ADD COLUMN Stock INT NOT NULL DEFAULT 20,
                    ADD COLUMN Active BIT NOT NULL DEFAULT b'1';

CREATE TABLE shop_users (
    username VARCHAR(32) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL
);

CREATE TABLE Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Basket_Id VARCHAR(64),
    Buyer VARCHAR(32),
    name VARCHAR(255),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zipCode VARCHAR(255),
    country VARCHAR(255),
    Order_Date DATETIME(6),
    Sub_Total BIGINT,
    Delivery_Fee BIGINT,
    Order_Status ENUM('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'PaymentReceived', 'PaymentFailed'),
    CONSTRAINT uk_buyer_basket UNIQUE (Buyer, Basket_Id),
    CONSTRAINT fk_order_buyer FOREIGN KEY (Buyer) REFERENCES shop_users(username)
);

CREATE TABLE OrderItem (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT,
    name VARCHAR(255),
    pictureUrl VARCHAR(255),
    Price BIGINT,
    Quantity INT,
    order_id INT,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES Orders(Id)
);
