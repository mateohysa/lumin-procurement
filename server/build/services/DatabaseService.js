import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function insertUser(user) {
    const data = user;
    console.log(data);
    try {
        const new_user = await prisma.user.create({
            data
        });
        console.log(new_user);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
export async function findUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user;
}
export async function findUserbyUsername(username) {
    const user = await prisma.user.findUnique({
        where: { username }
    });
    return user;
}
export async function disconnectDatabase() {
    await prisma.$disconnect();
}
export async function saveBoard(boardDtos) {
    const data = boardDtos;
    try {
        const new_board = await prisma.board.create({
            data
        });
        console.log(new_board);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
export async function getBoardsforUser(userId) {
    const boards = await prisma.board.findMany({
        where: { userId }
    });
    const toSend = boards.map(element => {
        const { boardId, boardName, createdAt } = element;
        return { boardId, boardName, createdAt };
    });
    return toSend;
}
export async function getBoard(boardId, userId) {
    const board = await prisma.board.findUnique({
        where: { boardId }
    });
    if (board?.userId === userId)
        return board;
    return null;
}
export async function updateBoard(userId, boardName, boardId, boardString, level, points) {
    const board = await prisma.board.update({
        where: { userId, boardId },
        data: { boardName, boardString, level, points }
    });
    if (board !== null) {
        console.log('board Updated successfully');
        return true;
    }
    return false;
}
