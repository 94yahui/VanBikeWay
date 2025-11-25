
import { db } from "./data.js";

const getBikeways = async () => {
    try {
        let allBikeways = db.prepare(`
            SELECT * FROM bikeway_overview ORDER BY bikeway_name;
            `).all();
        return allBikeways;
    } catch (error) {
        console.error(error);
    }
};

const getBikewaysBySurfaceType = async () => {
    try {
        let bikeways = db.prepare(`
            SELECT surface_type.name, COUNT(bikeway.bikewayId) AS count FROM bikeway
            JOIN surface_type ON surface_type.id = bikeway.surface_type_id
            GROUP BY surface_type.name;
            `).all();
        return bikeways;
    } catch (error) {
        console.error(error);
    }
};

const getLikedBikeways = async () => {
    try {
        const likedBikeways = db.prepare(`
            SELECT * FROM likes;
            `).all()
        return likedBikeways;
    } catch (error) {
        console.error(error);
    }
};

const updateLikeStatus = async (id) => {
    try {
        const serachResult = db.prepare(`
            SELECT * FROM likes
            WHERE bikeway_id = ?;
            `).get(id)

        if (serachResult) {
            db.prepare(`
                    DELETE FROM likes
                    WHERE bikeway_id = ?;
                    `).run(id)

            return {status:`Removed from likes`}
        } else {
            db.prepare(`
                    INSERT INTO likes (bikeway_id)
                    VALUES(?);
                    `).run(id)

            const newLike = db.prepare(`
            SELECT * FROM likes
            WHERE bikeway_id = ?;
            `).get(id)

            return newLike

        }

    } catch (error) {
        console.error(error);
    }
};

const bikewayModel = { getBikeways, updateLikeStatus, getBikewaysBySurfaceType, getLikedBikeways};

export default bikewayModel;