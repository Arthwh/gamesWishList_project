export const getGamesPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        console.log(currentUrl);
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('games-list-page.html');
};

export const getGameInfoPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        console.log(currentUrl);
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('game-view.html');
};

export const getUserGamesPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        const currentUrl = request.raw.url; // obtém a URL solicitada
        console.log(currentUrl);
        reply.redirect(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
    }
    return reply.sendFile('user-games-list.html');
};