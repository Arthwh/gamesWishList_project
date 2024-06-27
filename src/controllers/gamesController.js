export const getGamesPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        // return reply.code(401).send({ message: 'You are not logged in' });
        reply.redirect('/login')
    }
    return reply.sendFile('games-list-page.html');
};

export const getGameInfoPage = async (request, reply) => {
    if (!request.isAuthenticated) {
        // return reply.code(401).send({ message: 'You are not logged in' });
        reply.redirect('/login')
    }
    return reply.sendFile('game-view.html');
};