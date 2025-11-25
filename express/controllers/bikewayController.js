import bikewayModel from "../models/bikewayModel.js";

export const getBikeways = async (req, res) => {
    try {
        const results = await bikewayModel.getBikeways();
        if (!results) {
            return res.status(404).json("Not found")
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error")
    }
};

export const getLikedBikeways = async (req, res) => {
    try {
        const results = await bikewayModel.getLikedBikeways();
        if (!results) {
            return res.status(404).json("Not found")
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error")
    }
};


export const updateLikeStatus = async (req, res) => {
    try {
        const results = await bikewayModel.updateLikeStatus(req.params.id);
        if (!results) {
            return res.status(404).json("Not found")
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error")
    }
};

export const getBikewaysBySurfaceType = async (req, res) => {
    try {
        const results = await bikewayModel.getBikewaysBySurfaceType();
        if (!results) {
            return res.status(404).json("Not found")
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error")
    }
};

