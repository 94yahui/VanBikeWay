import { db } from "./data.js";

const getComments = async () => {

    try {
        const getResults = db.prepare(`
            SELECT * FROM comment
            `).all()

        return getResults;
    } catch (error) {
        console.error(error);
    }

};

const getOneComment = async (id) => {
    try {
        const getResult = db.prepare(`
            SELECT * FROM comment
            WHERE id = ?;
            `).get(id)

        return getResult;
    } catch (error) {
        console.error(error);
    }

};

const commentsByBikewayId = async (bikewayId) => {
    try {
        const getResults = db.prepare(`
            SELECT * FROM comment
            WHERE bikeway_id = ?
            ORDER BY date;
            `).all(bikewayId)

        return getResults;
    } catch (error) {
        console.error(error);
    }

};

const uploadComment = async (newComment) => {

    try {
        const insertResult = db.prepare(`
            INSERT INTO comment(bikeway_id,content)
            VALUES (
            ?,
            ?
        );
            `).run(newComment.bikeway_id, newComment.content)

        const result = {
            bikeway_id: newComment.bikeway_id,
            content: newComment.content,
            date: new Date().toISOString()
        }
        return result;
    } catch (error) {
        console.error(error);
    }

};

const updateComment = async (id, updatedComment) => {
    try {
        db.prepare(`
            UPDATE comment
            SET content = ?,
            date = DATETIME('now')
            WHERE id = ?;
            `).run(updatedComment.content, id)
        const upadtedResult = db.prepare(`
            SELECT * FROM comment
            WHERE id = ?;
            `).get(id)

        return upadtedResult;
    } catch (error) {
        console.error(error);
    }
};

const deleteComment = (id) => {

    try {

        const comment = db.prepare(`
            SELECT bikeway_id FROM comment WHERE id=?;
            `).get(id)

        if (!comment) {
            throw new Error(`Comment with id ${id} not found`);
        }

        db.prepare(`
            DELETE FROM comment
            WHERE id = ?;
            `).run(id)

        db.prepare(`
            UPDATE bikeway
            SET comment_count = comment_count-1
            WHERE bikewayId = ?;
            `).run(comment.bikeway_id)

        const updatedBikeway = db.prepare(`
            SELECT bikewayId, comment_count FROM bikeway
            WHERE bikewayId = ?;
            `).get(comment.bikeway_id)

        return updatedBikeway;

    } catch (error) {
        console.error(error);
    }
};

const commentModel = { getComments, getOneComment, uploadComment, updateComment, deleteComment, commentsByBikewayId };

export default commentModel;
