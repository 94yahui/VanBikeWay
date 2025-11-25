import commentModel from "../models/commentModel.js";

const getComments = async (req, res) => {
    try {
        const results = await commentModel.getComments();
        if (!results) {
            res.status(404).json("Not found")
        }

        res.json({
            message: "Fetch all comments successfully",
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error")
    }
};

const getOneComment = async (req, res) => {
    try {
        const result = await commentModel.getOneComment(req.params.id);
        if (!result) {
            res.status(404).json("Not found")
        }

        res.json({
            message: 'Fetch the comment successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error")
    }
};

const commentsByBikewayId = async (req, res) => {
    try {
        const result = await commentModel.commentsByBikewayId(req.params.bikewayId);
        if (result.length===0) {
            res.status(404).json("Not found")
        }

        res.json({
            message: 'Fetch comments successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error")
    }
};

const uploadComment = async (req, res) => {
    try {

        // complement parameters
        const result = await commentModel.uploadComment(req.body);

        res.json({
            message: 'Upload comment successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

const updateComment = async (req, res) => {


    try {
        // complement parameters
        const result = await commentModel.updateComment(req.params.id, req.body);
        if (!result) {
            res.status(404).json("Not found")
        }

        res.json({
            message: 'Update comment successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

const deleteComment = async (req, res) => {



    try {

        const resultExits = await commentModel.getOneComment(req.params.id);
        if (!resultExits) {
            return res.status(404).json("Couldn't find this comment")
        }

        const result = commentModel.deleteComment(req.params.id);

        res.json({
            message: 'Delete comment successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

export { getComments, getOneComment, uploadComment, updateComment, deleteComment, commentsByBikewayId };