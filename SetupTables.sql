DROP TABLE IF EXISTS Members;
CREATE TABLE Members (MemberID SERIAL PRIMARY KEY,
                      FirstName VARCHAR(32) NOT NULL,
		              LastName VARCHAR(32) NOT NULL,
                      Username VARCHAR(32) NOT NULL UNIQUE,
                      Email VARCHAR(48) NOT NULL UNIQUE,
                      Password VARCHAR(255) NOT NULL,
                      SALT VARCHAR(255),
                      Verification INT DEFAULT 0,
                      VerificationCode INT
);

DROP TABLE IF EXISTS Contacts;
CREATE TABLE Contacts(PrimaryKey SERIAL PRIMARY KEY,
                      MemberID_A INT NOT NULL,
                      MemberID_B INT NOT NULL,
                      Verified INT DEFAULT 0,
                      FOREIGN KEY(MemberID_A) REFERENCES Members(MemberID),
                      FOREIGN KEY(MemberID_B) REFERENCES Members(MemberID),
);

DROP TABLE IF EXISTS Chats;
CREATE TABLE Chats (ChatID SERIAL PRIMARY KEY,
                    Name VARCHAR(255)
);

DROP TABLE IF EXISTS ChatMembers;
CREATE TABLE ChatMembers (ChatID INT NOT NULL,
                          MemberID INT NOT NULL,
                          FOREIGN KEY(MemberID) REFERENCES Members(MemberID),
                          FOREIGN KEY(ChatID) REFERENCES Chats(ChatID)
);

DROP TABLE IF EXISTS Messages;
CREATE TABLE Messages (PrimaryKey SERIAL PRIMARY KEY,
                       ChatID INT,
                       Message VARCHAR(255),
                       MemberID INT,
                       FOREIGN KEY(MemberID) REFERENCES Members(MemberID),
                       FOREIGN KEY(ChatID) REFERENCES Chats(ChatID),
                       TimeStamp TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (PrimaryKey SERIAL PRIMARY KEY,
                        MemberID INT,
                        Nickname VARCHAR(255),
                        Lat DECIMAL,
                        Long DECIMAL,
                        ZIP INT,
                        FOREIGN KEY(MemberID) REFERENCES Members(MemberID)
);


ALTER TABLE contacts ADD CONSTRAINT noDupedContacts UNIQUE (memberid_a, memberid_b);

