export const setGameStatus = status => ({
    type: 'SET_GAME_STATUS',
    status
});

export const setGameCountDown = countDown => ({
    type: 'SET_GAME_COUNTDOWN',
    countDown
});

export const setGameBanker = banker => ({
    type: 'SET_GAME_BANKER',
    banker
});

export const setGamePlayers = players => ({
    type: 'SET_GAME_PLAYERS',
    players
});

export const updateGamePlayerScore = ({ playerId, score }) => ({
    type: 'UPDATE_GAME_PLAYER_SCORE',
    playerId,
    score
});

export const setGameWord = word => ({
    type: 'SET_GAME_WORD',
    word
});

export const setCanvasData = canvasData => ({
    type: 'SET_CANVAS_DATA',
    canvasData
});

export const pushCanvasStroke = stroke => ({
    type: 'PUSH_CANVAS_STROKE',
    stroke
});
