import fetch from 'node-fetch';
import "dotenv/config";

const clientId = process.env.ID_TWITCH_API;
const clientSecret = process.env.SECRET_TWITCH_API;
let accessToken = null;
let tokenExpiration = null;

async function generateAccessToken() {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        }),
    });
    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiration = Date.now() + data.expires_in * 1000; // Expira em data.expires_in segundos
    // console.log('Token generated successfully');
    return accessToken;
}

async function getAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiration) {
        await generateAccessToken();
    }
    return accessToken;
}

export async function fetchGames(limit, offset) {
    const token = await getAccessToken();
    // console.log("id: " + clientId)
    // console.log("token: " + accessToken)
    const response = await fetch('https://api.igdb.com/v4/games/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: `fields name,genres.name,platforms.name,release_dates.y,rating,cover.url; where category = 0 & aggregated_rating > 90; sort rating desc; limit ${limit}; offset ${offset};`,
    })
    const data = await response.json();
    console.log("dados: " + JSON.stringify(data))
    if (!response.ok) {
        throw new Error('Failed to fetch games' + data.message);
    }
    console.log("testeRepository: " + data)
    return data;
}

