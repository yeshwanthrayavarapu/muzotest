CREATE TABLE Users (
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL);

CREATE TABLE Songs (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration INTEGER NOT NULL,  -- duration in seconds
    artist VARCHAR(255) NOT NULL,
    coverUrl VARCHAR(512),      -- URL to album/song cover image
    audioUrl VARCHAR(512) NOT NULL, -- URL to audio file
    created_at TIMESTAMP
);

INSERT INTO Songs (id ,title, description, genre, duration, artist, coverUrl, audioUrl) VALUES
(1,'Summer Vibes', 'A cheerful summer song with beach vibes', 'Electronic', 204, 'Wave Riders', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
(2,'Rainy Day', 'Melancholic piano melody with rain sounds', 'Ambient', 255, 'Melody Dreams', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
(3,'Urban Night', 'Electronic beats with city atmosphere', 'Electronic', 178, 'Night Pulse', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3');


INSERT INTO Songs (id ,title, description, genre, duration, artist, coverUrl, audioUrl) VALUES
(4,'Summer Vibes', 'A cheerful summer song with beach vibes', 'Electronic', 204, 'Wave Riders', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', 'https://muzo.blob.core.windows.net/songs/1.wav');

select * from Users;


INSERT INTO Users (id, username, email, password) VALUES
(1, 'yesh', 'yesh@muzo.ai','123456');

Delete from Songs where id = 3;



SELECT * FROM Tracks;