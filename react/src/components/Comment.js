
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
            getAllComments();

            props.reduceCommentCount(props.bikewayId);
            

        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }



    return (< div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '10px', zIndex: 1100, backgroundColor: '#2d9bdb77' }}>
        <button
            style={{ position: 'absolute', top: 0, left: 0 }}
            onClick={props.onClose}

        >Close</button>
        <div style={{ overflowX: 'auto', display: 'flex', flexDirection: 'row', gap: '1rem', padding: '2rem', }}>
            {comments && comments.map((comment, index) => (
                <>

                    {editMode && openIndex == index ?
                        <form
                            key={comment.id}
                            style={{ padding: '.7rem', backgroundColor: 'white', borderRadius: '10px', height: '200px', width: '150px', flexShrink: 0 }}>
                            {!loading && <textarea
                                style={{ minHeight: '150px', width: '144px' }}
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
                            }}>Update</button>
                        </form> :
                        <div
                            key={comment.index}
                            style={{ padding: '.7rem', backgroundColor: 'white', borderRadius: '10px', height: '200px', width: '150px', flexShrink: 0 }}
                        >
                            <p
                                style={{ padding: '1rem', backgroundColor: '#efefefff', borderRadius: '10px', height: '110px', overflowY: 'auto', margin: 0 }}>{comment.content}</p>
                            <p style={{ fontSize: '.8rem' }}>{new Date(comment.date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem' }}>
                                <button
                                    style={{ width: '100%' }}
                                    onClick={() => {
                                        setEditMode(true);
                                        setOpenIndex(index);
                                    }}
                                >Edit</button>
                                <button
                                    style={{ width: '100%' }}
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