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
    // console.log("accessToken: " + accessToken)
    return accessToken;
}

export async function getAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiration) {
        await generateAccessToken();
    }
    return accessToken;
}

export async function fetchGamesRepository(token, limit, offset, filterQuery) {
    const body = `fields name, genres.name, platforms.abbreviation, first_release_date, rating, cover.url, version_title;${filterQuery} limit ${limit}; offset ${offset};`
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
        throw new Error('Failed to fetch games: ' + data[0]?.cause);
    }
    return data;
}

export async function fetchTopRatedGamesRepository(token) {
    const body = `fields name, cover.url, rating; where category = 0 & platforms.generation >= 5 & version_title = null; sort rating_count desc; limit 8;`
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
        throw new Error('Failed to fetch top rated games: ' + data[0]?.cause);
    }
    return data;
}

export async function fetchAllGenresRepository(token, limit) {
    const body = `fields name; sort name asc; limit ${limit};`;
    const response = await fetch('https://api.igdb.com/v4/genres', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: body,
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch genres: ' + data[0]?.cause);
    }
    return data;
}

export async function fetchAllPlatformsRepository(token, limit) {
    const body = `fields abbreviation, generation; where generation >= 5; sort generation desc; limit ${limit};`;
    const response = await fetch('https://api.igdb.com/v4/platforms', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId,
        },
        body: body,
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch platforms: ' + data[0]?.cause);
    }
    return data;
}

export async function fetchGameDataRepository(token, id) {
    const body = `fields name, summary, storyline, videos.video_id, genres.name, external_games.url, external_games.countries, websites.url, first_release_date, similar_games, platforms.abbreviation, rating, cover.url; where id = ${id};`;
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
        throw new Error('Failed to fetch games: ' + data[0]?.cause);
    }
    return data;
}

export async function fetchGamesByIdRepository(token, ids) {
    const body = `fields name, rating, cover.url; where id = (${ids}); limit 100;`;
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
        throw new Error('Failed to fetch games by id: ' + data[0]?.cause);
    }
    return data;
}