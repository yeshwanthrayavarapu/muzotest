-- This is a reference schema only. Run this if the tables don't exist in your database.

-- Tracks table - stores generated audio tracks
CREATE TABLE Tracks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(500),
    genre VARCHAR(50),
    duration VARCHAR(10),
    artist VARCHAR(100),
    coverUrl VARCHAR(255),
    audioUrl VARCHAR(255),
    prompt TEXT ,
    createdAt DATETIME 
);

-- Create index for faster queries
CREATE INDEX idx_tracks_createdAt ON Tracks(createdAt DESC);

drop table if exists Tracks;

