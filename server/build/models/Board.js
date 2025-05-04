export class Board {
    boardId;
    userId;
    points;
    level;
    boardName;
    boardString;
    createdAt;
    constructor(boardId, userId, points, level, boardName, boardString, createdAt) {
        this.boardId = boardId;
        this.userId = userId;
        this.points = points;
        this.level = level;
        this.boardName = boardName;
        this.boardString = boardString;
        this.createdAt = createdAt;
    }
}
export class BoardDtos {
    userId;
    points;
    level;
    boardName;
    boardString;
    constructor(userId, points, level, boardName, boardString) {
        this.userId = userId;
        this.points = points;
        this.level = level;
        this.boardName = boardName;
        this.boardString = boardString;
    }
}
