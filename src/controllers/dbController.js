// dbcontroller.server.js

import mysql from 'mysql2/promise';

// Set up the MySQL connection pool
const pool = mysql.createPool({
    host: "database-prueba.cpmi8kiuw7c4.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Bruno1226*",
    database: "DB_Prueba",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Generic function for querying the database
async function query(sql, params) {
    console.log("in query", sql)
    const [results] = await pool.execute(sql, params);
    return results;
}

// Queries for videos based on club ID, weekday, court, etc.
export const selectIndv_Video = async (id_club, weekday, court_number, hour, section) => {
    return await query(
        'SELECT * FROM Videos WHERE id_club = ? AND Weekday = ? AND Court_Number = ? AND Hour = ? AND Hour_Section = ?',
        [id_club, weekday, court_number, hour, section]
    );
}

export const selectBestPoints=async(id_club, weekday, court_number, hour, section)=>{
    console.log("indbcontroller selectbestpoints" )
    return await query(
        'SELECT Time FROM bestPoints WHERE id_club = ? AND Court_Number = ? AND Hour = ? AND Section = ?', 
        [id_club, court_number, hour, section]
    );
}



// Query all clubs
export const selectClubs = async () => {
    return await query('SELECT * FROM Clubs');
}

// Query individual club by ID
export const selectIndv_Club = async (id_club) => {
    return await query('SELECT * FROM Clubs WHERE ID = ?', [id_club]);
}

// Query individual club by name
export const selectIndv_ClubNombre = async (nombre_club) => {
    return await query('SELECT * FROM Clubs WHERE Name = ?', [nombre_club]);
}

// Query videos by club and court number
export const selectVideosPorClub = async (id_club) => {
    return await query('SELECT * FROM Videos WHERE id_club = ? ', [id_club]);
}

// Query cameras by club ID
export const selectCamerasByClub = async (id_club) => {
    return await query('SELECT * FROM Cameras WHERE id_club = ?', [id_club]);
}

// Query clips by club status
export const selectClips = async (clubStatus, id) => {
    const sql = clubStatus
        ? 'SELECT * FROM Clips WHERE id_club = ? ORDER BY _createdDate DESC'
        : 'SELECT * FROM Clips WHERE id_user = ? ORDER BY _createdDate DESC LIMIT 10';
    return await query(sql, [id]);
}

// Update the "Blocked" status in Videos table
export const updateBlockedStatus = async (id_video, blocked) => {
    const newBlockedStatus = blocked === "No" ? "Sí" : "No";
    return await query('UPDATE Videos SET Blocked = ? WHERE ID = ?', [newBlockedStatus, id_video]);
}

// Update live status and related fields in Cameras table
export const updateLiveStatus = async (camera_id, club_id, status, notes, url, containerId) => {
    const sql=url && containerId
        ? 'UPDATE Cameras SET liveStatus = ?, liveUrl = ?, liveNotes = ?, liveContainerId = ? WHERE id_club = ? AND ID = ?'
        : 'UPDATE Cameras SET liveStatus = ?, liveNotes = ? WHERE id_club = ? AND ID = ?';
    const params = url && containerId
        ? [status, url, notes, containerId, club_id, camera_id]
        : [status, notes, club_id, camera_id];
 
    return await query(sql, params);
}

// Insert a new clip into the Clips table
export const registerClip = async (clip_name, dayName, tag, url, uid, clubId, userId = null) => {
    const sql = userId
        ? 'INSERT INTO Clips (Clip_Name, Weekday, Tag, URL, UID, id_club, id_user) VALUES (?, ?, ?, ?, ?, ?, ?)'
        : 'INSERT INTO Clips (Clip_Name, Weekday, Tag, URL, UID, id_club) VALUES (?, ?, ?, ?, ?, ?)';
    const params = userId
        ? [clip_name, dayName, tag, url, uid, clubId, userId]
        : [clip_name, dayName, tag, url, uid, clubId];
    return await query(sql, params);
}

// Query individual club ID by email
export const selectIndv_ClubEmail = async (email_club) => {
    return await query('SELECT ID FROM Clubs WHERE Email = ?', [email_club]);
}

// Insert a new user into the Users table
export const insertUser = async (name, email, password, contactID) => {
    return await query('INSERT INTO Users (Name, Email, Password, ContactID) VALUES (?, ?, ?, ?)', [name, email, password, contactID]);
}

// Validate if a user exists by email
export const validateUser = async (email) => {
    const results = await await query('SELECT * FROM Users WHERE Email = ?', [email]);
    return results.length > 0;
}

// Retrieve generated clips by user email
export const getGeneratedClips = async (email) => {
    return await query('SELECT ID, generatedClips FROM Users WHERE Email = ?', [email]);
}

// Update the generated clips count for a user
export const updateUserClips = async (generatedClips, email) => {
    return await query('UPDATE Users SET generatedClips = ? WHERE Email = ?', [generatedClips + 1, email]);
}

// Retrieve contact ID by email and password
export const selectContactID = async (email, password) => {
    return await query('SELECT ContactID FROM Users WHERE Email = ? AND Password = ?', [email, password]);
}

export const selectDownloadURL = async (UID) => {
    return await query('SELECT downloadURL FROM Clips WHERE UID = ?', [UID]);
}

export const updateDownloadURL = async (downloadURL, UID) => {
    return await query('UPDATE Clips SET downloadURL = ? WHERE UID = ?', [downloadURL, UID, ]);
}
