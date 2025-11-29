
import { useState, useEffect } from "react";

export const Comment = props => {

    const [comments, setComments] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [openIndex, setOpenIndex] = useState(0);
    const [newComment, setNewComment] = useState({
        commentId: '',
        content: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fecth all the comments
    async function getAllComments() {
        try {
            const res = await fetch(`/api/comment/bikeway/${props.bikewayId}`);
            const data = await res.json();
            console.log(data);


            // Sort comments by ceated date
            const sortedByDateData = data.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).
                getTime());
            setComments(sortedByDateData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllComments();
        setEditMode(false);
    }, [props.bikewayId, props.commentCheck])

    // update the comment

    async function updateComment() {
        setLoading(false);
        setErrorMessage('');
        try {
            setLoading(true)
            const res = await fetch(`/api/comment/${newComment.commentId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: newComment.content
                    })
                }
            );

            const data = await res.json();
            console.log(data);
            setLoading(false);
            setEditMode(false);
            getAllComments()

        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }

    //Delete comment----------

    async function deleteComment(id) {
        setLoading(false);
        setErrorMessage('');
        try {
            setLoading(true)
            const res = await fetch(`/api/comment/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await res.json();
            console.log(data);
            setLoading(false);
            // getAllComments();
            setComments(prevComments => prevComments.filter(c => c.id !== id));

            props.reduceCommentCount(props.bikewayId);

        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }



    return (< div style={{position:'fixed', right:0,top:0,
        borderRadius: '12px',backgroundColor: '#97979785', fontFamily: 'sans-serif', backdropFilter: 'blur(20px)', padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 4px 6px 4px rgba(0,0,0,0.1)',
        marginTop: '1rem',
        height:'100vh',
        zIndex:1205
    }}>
        <button
            style={{ position: 'fixed', top: '.5rem', right: '.5rem', border: 'none', fontSize: '1.1rem', cursor: 'pointer', background: 'transparent' }}
            onClick={props.onClose}

        ><i class="fa-solid fa-x"></i></button>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '.5rem', marginTop: '1rem',height:'100%'}}>
            {comments && comments.map((comment, index) => (
                <>

                    {editMode && openIndex == index ?
                        <form
                            key={comment.id}
                            style={{ display: "flex", flexDirection: 'column', gap: '.5rem', padding: '.7rem', background: 'linear-gradient(45deg,lightgreen, lightblue)', borderRadius: '10px', height: '150px', width: '150px', flexShrink: 0, backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {!loading && <textarea
                                style={{ minHeight: '100px', width: '133px', borderRadius: '10px', padding: '.5rem', backgroundColor: '#ffffffff', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)', border: 'none', resize: 'none', outline: 'none', alignSelf: 'center' }}
                                defaultValue={comment.content}
                                onChange={(e) => setNewComment({
                                    commentId: comment.id,
                                    content: e.target.value
                                })}
                            >

                            </textarea>}
                            {loading && <p>Updating...</p>}
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem' }}>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    updateComment();
                                }}
                                    style={{flex:1,flexBasis:'50%', borderRadius: '10px', backgroundColor: '#4972ecff', border: 'none', padding: '.3rem', color: 'white' }}
                                >Update</button>
                                <button
                                    style={{ flex:1,flexBasis:'50%',borderRadius: '10px', backgroundColor: '#de4343ff', border: 'none', padding: '.3rem', color: 'white', borderRadius: '10px', border: 'none', padding: '.3rem' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteComment(comment.id);
                                        setEditMode(false);
                                    }}
                                >Delete</button>
                            </div>
                        </form> :
                        <div
                            key={comment.id}
                            style={{ display: "flex", flexDirection: 'column', gap: '.5rem', padding: '.7rem', background: 'linear-gradient(45deg,lightgreen, lightblue)', borderRadius: '10px', height: '150px', width: '150px', flexShrink: 0, backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', }}
                        >
                            <p
                                style={{ padding: '.5rem', backgroundColor: '#ffffffae', borderRadius: '10px', height: '50px', overflowY: 'auto', margin: 0, boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)', }}>{comment.content}</p>
                            <p style={{ fontSize: '.8rem' }}>{new Date(comment.date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </p>
                            <button
                                style={{ width: '100%', borderRadius: '10px', backgroundColor: '#4972ecff', border: 'none', padding: '.3rem', color: 'white' }}
                                onClick={() => {
                                    setEditMode(true);
                                    setOpenIndex(index);
                                }}
                            >Edit</button>
                        </div>
                    }
                </>
            ))}
        </div>
    </div>)

}