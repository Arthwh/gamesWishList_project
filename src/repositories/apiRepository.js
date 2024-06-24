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
    return accessToken;
}

async function getAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiration) {
        await generateAccessToken();
    }
    return accessToken;
}

export async function fetchGames(limit, offset, filterQuery) {
    const token = await getAccessToken();
    const body = `fields name, genres.name, platforms.abbreviation, release_dates.y, rating, cover.url, version_title;${filterQuery} limit ${limit}; offset ${offset};`
    const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: body,
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch games: ' + data.message);
    }
    return data;
}

export async function fetchAllGenres(limit) {
    const token = await getAccessToken();
    const response = await fetch('https://api.igdb.com/v4/genres', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: `fields name; sort name asc; limit ${limit};`,
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch genres: ' + data.message);
    }
    return data;
}

export async function fetchAllPlatforms(limit) {
    const token = await getAccessToken();
    const response = await fetch('https://api.igdb.com/v4/platforms', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: `fields abbreviation, generation; where generation >= 5; sort generation desc; limit ${limit};`,
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch platforms: ' + data.message);
    }
    return data;
}


