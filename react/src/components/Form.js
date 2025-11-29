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
        if (!props.openCommentForm) {
            setErrorMessage('');
        }
    }, [props.openCommentForm])




    return (
        <form style={{
            marginTop: '1rem', minWidth:'300px', minHeight:'300px', display: "flex", flexDirection: 'column', gap: '1rem', transition: 'all .35s ease', backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            boxShadow: '0 4px 6px 4px rgba(0,0,0,0.1)',
            marginTop: '1rem',
            padding: '1rem',
            fontFamily: 'sans-serif'
        }}>
            <button
                style={{ position: 'absolute', top: '.5rem', right: '.5rem', border: 'none', fontSize: '1.1rem', cursor: 'pointer', background: 'transparent' }}
                onClick={props.onClose}

            ><i class="fa-solid fa-x"></i></button>
            <h2 style={{ textAlign: 'center' }}>Comment</h2>
            {loading ? <p style={{ textAlign: 'center' }}>Uploading your comment...</p> : <textarea
                style={{ minHeight: '100px', width: '90%', maxWidth: '400px', borderRadius: '10px', alignSelf: 'center', padding: '.5rem', borderColor: '#4972ecff', resize: 'none' }}
                onChange={e => { setComment(e.target.value); setErrorMessage('') }}
            ></textarea>}
            {errorMessage && <p style={{ color: `${errorMessage.includes('success') ? '#34e57bff' : 'red'}`, fontWeight: 'semi-bold', textAlign: 'center' }}>{errorMessage}</p>}
            <button
                style={{ backgroundColor: '#4972ecff', borderRadius: '5px', color: 'white', padding: '1rem', border: 'none', minWidth: '200px', fontSize: '1.1rem', margin: 'auto',cursor:'pointer' }}
                onClick={postComment}
            >Submit</button>
        </form>
    )
}