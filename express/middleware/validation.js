const validateUploadComment = (req, res, next) => {
    const { bikeway_id, content } = req.body;
    if (!bikeway_id || !content) {
        return res.status(400).json({ message: "bikeway_id, content are required." })
    }

    if (bikeway_id && typeof bikeway_id !== 'number') {
        return res.status(400).json({ message: "bikeway_id must be a number." });
    }

    if (content && typeof content !== 'string') {
        return res.status(400).json({ message: "content must be a string." });
    }

    next();

}

const validateUpdateComment = (req, res, next) => {
    const { content } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: `Bad Request, request body shouldn't be empty` })
    }

    for (let key of Object.keys(req.body)) {
        if (!['content'].includes(key)) {
            return res.status(400).json({ message: `Bad Request, ${key} is not correct` })
        }
    }

    if (content && typeof content !== 'string') {
        return res.status(400).json({ message: "content must be a string." });
    }

    next();

}

const validation = { validateUploadComment, validateUpdateComment };

export default validation;