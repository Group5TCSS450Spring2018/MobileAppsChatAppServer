DROP TABLE IF EXISTS Users;
CREATE TABLE Users (MemberID SERIAL PRIMARY KEY,
                      FirstName VARCHAR(32) NOT NULL,
		              LastName VARCHAR(32) NOT NULL,
                      Username VARCHAR(32) NOT NULL UNIQUE,
                      Email VARCHAR(40) NOT NULL UNIQUE,
                      Password VARCHAR(255) NOT NULL,
                      SALT VARCHAR(255),
                      Verification INT DEFAULT 0
);
