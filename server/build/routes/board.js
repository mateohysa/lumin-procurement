import { json, Router } from 'express';
import { getBoard, getBoardsforUser, saveBoard, updateBoard } from '../services/DatabaseService.js';
import { checkAuthenticated } from '../services/CheckAuthService.js';
const route = Router();
route.use(checkAuthenticated);
route.use(json());
route.get('/', async (req, res) => {
    const user = req.user;
    const boards = await getBoardsforUser(user.id);
    res.json(boards);
});
route.get('/:id', async (req, res) => {
    const user = req.user;
    let idStr = req.url;
    idStr = idStr.substring(idStr.lastIndexOf('/') + 1);
    const id = parseInt(idStr);
    console.log(id);
    const board = await getBoard(id, user.id);
    console.log(board);
    if (board === null)
        res.json({ message: 'Board NOT FOUND' });
    else {
        res.json(board);
    }
});
route.post('/', async (req, res) => {
    const userId = req.user.id;
    const board = { userId, ...req.body };
    const result = await saveBoard(board);
    if (result)
        res.json({ message: 'board added successfully' });
    else
        res.json({ message: 'board not added successfully' });
});
route.put('/', async (req, res) => {
    console.log(req.body);
    const { boardId, boardName, boardString, level, points } = req.body;
    const user = req.user;
    const result = await updateBoard(user.id, boardName, boardId, boardString, level, points);
    if (result)
        res.json({ message: 'Board updated successfully' });
    else
        res.json({ message: 'Board NOT FOUND' });
});
export default route;
