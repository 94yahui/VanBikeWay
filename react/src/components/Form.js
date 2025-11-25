import { useState, useEffect } from "react";

export const Form = props => {

    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const postComment = async (e) => {
        e.preventDefault();
        setLoading(false);
        setErrorMessage('');
        try {
            setLoading(true);
            const res = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bikeway_id: props.bikewayId,
                    content: comment
                })
            });


            const data = await res.json();
            setLoading(false);
            data.message.includes('success') ? setErrorMessage(data.message) : setErrorMessage('Failed to upload comment');
            setComment('');
            if (res.ok) {
                props.setCommentCheck(!props.commentCheck)
                props.onCommentSubmit?.();
                console.log(data);
            }
        } catch (error) {
            setErrorMessage(error)
            console.error(error);
        }
    }

    useEffect(() => {
        if (!props.isOpen) {
            setComment('');
            setErrorMessage('');
            setLoading(false);
        }

    }, [props.isOpen])




    return (
        <form style={{ marginTop: '1rem', display: "flex", flexDirection: 'column', gap: '.5rem', transition: 'all .35s ease' }}>
            <h2 style={{ textAlign: 'center' }}>Comment</h2>
            {loading ? <p>Uploading your comment...</p> : <textarea
                style={{ minHeight: '100px' }}
                onChange={e => setComment(e.target.value)}
            ></textarea>}
            {errorMessage && <p style={{ color: `${errorMessage.includes('success') ? '#34e57bff' : 'red'}` }}>{errorMessage}</p>}
            <button
                style={{ backgroundColor: '#2D9CDB', borderRadius: '10px', color: 'white' }}
                onClick={postComment}
            >Submit</button>
        </form>
    )
}