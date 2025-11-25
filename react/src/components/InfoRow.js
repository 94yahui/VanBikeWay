export const InfoRow = props => {
    return (<div style={{display:"flex", justifyContent:"space-between", alignItems:'center', gap:'1rem'}}>
        <p style={{margin:0}}>{props.title}:</p>
        <p style={{fontWeight:"bold", margin:0}}>{props.content}</p>
    </div>)
}