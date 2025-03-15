-- Drop existing tables and their dependencies
IF OBJECT_ID('UserLibrary', 'U') IS NOT NULL DROP TABLE UserLibrary;
IF OBJECT_ID('PlayHistory', 'U') IS NOT NULL DROP TABLE PlayHistory;
IF OBJECT_ID('Tracks', 'U') IS NOT NULL DROP TABLE Tracks;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;

-- Drop existing triggers
IF OBJECT_ID('trg_Users_UpdatedAt', 'TR') IS NOT NULL DROP TRIGGER trg_Users_UpdatedAt;
IF OBJECT_ID('UpdateTrackTimestamp', 'TR') IS NOT NULL DROP TRIGGER UpdateTrackTimestamp;

GO

-- This is a reference schema only. Run this if the tables don't exist in your database.

-- Users table - stores user profiles
CREATE TABLE Users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    website VARCHAR(255),
    bio VARCHAR(500),
    profileImage VARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    isAdmin BIT DEFAULT 0
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON Users(email);

-- Tracks table - stores generated audio tracks
CREATE TABLE Tracks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    genre VARCHAR(50),
    duration INT, -- Store as seconds
    artist VARCHAR(100),
    coverUrl VARCHAR(255),
    audioUrl VARCHAR(255),
    prompt VARCHAR(500),
    userId VARCHAR(36),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_tracks_createdAt ON Tracks(createdAt DESC);
CREATE INDEX idx_tracks_userId ON Tracks(userId);
CREATE INDEX idx_tracks_genre ON Tracks(genre);

-- PlayHistory table - tracks user listening history
CREATE TABLE PlayHistory (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    trackId VARCHAR(255) NOT NULL,
    playedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (trackId) REFERENCES Tracks(id) ON DELETE CASCADE
);

-- Create index for faster play history queries
CREATE INDEX idx_playHistory_userId ON PlayHistory(userId);
CREATE INDEX idx_playHistory_trackId ON PlayHistory(trackId);
CREATE INDEX idx_playHistory_playedAt ON PlayHistory(playedAt DESC);

-- UserLibrary table - stores user's personal library
CREATE TABLE UserLibrary (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    trackId VARCHAR(255) NOT NULL,
    addedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (trackId) REFERENCES Tracks(id) ON DELETE CASCADE,
    UNIQUE(userId, trackId)
);

-- Create index for faster library queries
CREATE INDEX idx_userLibrary_userId ON UserLibrary(userId);
CREATE INDEX idx_userLibrary_trackId ON UserLibrary(trackId);
CREATE INDEX idx_userLibrary_addedAt ON UserLibrary(addedAt DESC);

GO

-- Add trigger for Users updatedAt
CREATE TRIGGER trg_Users_UpdatedAt
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users
    SET updatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.id = i.id;
END;

GO

-- Add trigger for updating updatedAt
CREATE TRIGGER UpdateTrackTimestamp
ON Tracks
AFTER UPDATE
AS
BEGIN
    UPDATE Tracks
    SET updatedAt = GETDATE()
    FROM Tracks t
    INNER JOIN inserted i ON t.id = i.id;
END;


select * from Tracks;





UPDATE Users
SET profileImage = 'https://api.dicebear.com/7.x/initials/svg?seed=' + name + '&backgroundColor=1e1b3b,2a2151&radius=50'
WHERE profileImage IS NULL OR profileImage = '';



CREATE TABLE AccessCodes (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(255) NOT NULL UNIQUE,
    used BIT DEFAULT 0
);