
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



    return (< div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '12px', zIndex: 1100, backgroundColor: '#ffffff32', fontFamily:'sans-serif', backdropFilter:'blur(20px)'}}>
        <button
            style={{ position: 'absolute', top: 0, right: 0, border:'none', fontSize:'1.1rem', cursor:'pointer'}}
            onClick={props.onClose}

        ><i class="fa-solid fa-x"></i></button>
        <div style={{ overflowX: 'auto', display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem', }}>
            {comments && comments.map((comment, index) => (
                <>

                    {editMode && openIndex == index ?
                        <form
                            key={comment.id}
                            style={{display: "flex", flexDirection: 'column', gap: '.5rem', padding: '.7rem', backgroundColor: '#ffffff5e', borderRadius: '10px', height: '200px', width: '150px', flexShrink: 0, backdropFilter:'blur(10px)'}}>
                            {!loading && <textarea
                                style={{ minHeight: '150px', width: '133px', borderRadius: '10px',padding:'.5rem',backgroundColor:'#ffffff51',boxShadow:'inset 0 0 2px 0' }}
                                defaultValue={comment.content}
                                onChange={(e) => setNewComment({
                                    commentId: comment.id,
                                    content: e.target.value
                                })}
                            >

                            </textarea>}
                            {loading && <p>Updating...</p>}
                            <button onClick={(e) => {
                                e.preventDefault();
                                updateComment();
                            }}
                            style={{borderRadius: '10px', backgroundColor:'#4972ecff', border:'none', padding:'.3rem', color:'white'}}
                            >Update</button>
                        </form> :
                        <div
                            key={comment.id}
                            style={{display: "flex", flexDirection: 'column', gap: '.5rem', padding: '.7rem', backgroundColor: '#ffffff5e', borderRadius: '10px', height: '200px', width: '150px', flexShrink: 0 , backdropFilter:'blur(10px)'}}
                        >
                            <p
                                style={{ padding: '.5rem', backgroundColor: '#ffffffff', borderRadius: '10px', height: '110px', overflowY: 'auto', margin: 0}}>{comment.content}</p>
                            <p style={{ fontSize: '.8rem' }}>{new Date(comment.date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem'}}>
                                <button
                                    style={{ width: '100%', borderRadius: '10px', backgroundColor:'#4972ecff', border:'none', padding:'.3rem', color:'white' }}
                                    onClick={() => {
                                        setEditMode(true);
                                        setOpenIndex(index);
                                    }}
                                >Edit</button>
                                <button
                                    style={{ width: '100%', borderRadius: '10px', backgroundColor:'#de4343ff', border:'none', padding:'.3rem', color:'white', borderRadius: '10px', border:'none', padding:'.3rem'}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteComment(comment.id);
                                    }}
                                >Delete</button>
                            </div>
                        </div>
                    }
                </>
            ))}
        </div>
    </div>)

}