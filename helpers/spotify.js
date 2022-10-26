/* eslint-disable camelcase */
/* eslint-disable no-undef */

function getAuthorizationToken() {
  return btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
}



const tokenEndpoint = 'https://accounts.spotify.com/api/token';

export const getAccessToken = async () => {
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${getAuthorizationToken()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: `${SPOTIFY_REFRESH_TOKEN}`,
        }).toString(),
    });

    const { access_token } = await response.json()

    return access_token

};
