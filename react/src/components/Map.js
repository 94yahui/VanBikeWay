import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from 'leaflet';
import { InfoRow } from "./InfoRow.js";
import { Form } from "./Form.js";
import { Comment } from "./Comment.js";

export const Map = props => {

    const mapStyle = {
        height: "98.5vh",
        borderRadius: "20px",
        position: 'relative'
    }

    const markerClusterStyle = `
    background-color: #0096c7;
    backdrop-filter:blur(5px);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size:1.2rem;
    padding:.2rem
`

    const buttonStyle = {
        position: "absolute",
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '.5rem',
        borderRadius: '10px',
        fontSize: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderColor: 'black',
        width:'30px',
        height:'30px',
        display:"flex",
        justifyContent:'center',
        alignItems:'center',
        cursor:'pointer'
    }

    const [bikeways, setBikeways] = useState([]);
    const [bikewayId, setBikewayId] = useState('');
    // const [isOpen, setIsOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [commentCheck, setCommentCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [liked, setLiked] = useState(false);
    const [likedBikeways, setLikedBikeways] = useState([]);
    const [chooseLiked, setChooseliked] = useState(false);


    //fetch all the bikeways----------------------------------
    async function getAllBikeways() {
        try {
            const res = await fetch('/api/bikeway');
            const data = await res.json();
            setBikeways(data);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getAllBikeways();
    }, [])


    //fetch all the liked bikeways--------------------------------

    async function getLikedBikeways() {
        try {
            const res = await fetch('/api/bikeway/likes');
            const data = await res.json();
            setLikedBikeways(data);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getLikedBikeways();
    }, [liked])

    //Change liked status--------------------
    async function changeLikedStatus(id) {
        try {
            const res = await fetch(`/api/bikeway/${id}/likes`,
                {
                    method: "PATCH"
                }
            );
            const data = await res.json();
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    //Check if bikeway has been liked------------------
    function checkLikedStatus(id) {
        return likedBikeways.some(likedBikeway =>
            likedBikeway.bikeway_id == id
        )
    }

    const updateBikewayCommentCount = (bikewayId) => {
        setBikeways(prev =>
            prev.map(b =>
                b.bikewayId === bikewayId
                    ? { ...b, comment_count: b.comment_count + 1 }
                    : b
            )
        );
    };

    const reduceCommentCount = (bikewayId) => {
        setBikeways(prev =>
            prev.map(b =>
                b.bikewayId === bikewayId
                    ? { ...b, comment_count: b.comment_count - 1 }
                    : b
            )
        );
    };

    const filteredBikeways = bikeways.filter(b => {

        if (chooseLiked) {
            return checkLikedStatus(b.bikewayId) && b.bikeway_name.toLowerCase().includes(searchValue.trim().toLowerCase())
        }

        return b.bikeway_name.toLowerCase().includes(searchValue.trim().toLowerCase())
    }
    )




    return (
        <div style={{ position: 'relative' }}>
            <MapContainer style={mapStyle} zoom={13} center={[49.2827, -123.1207]}>
                <div style={{ position: 'absolute', top: '2rem', left: '5rem', zIndex: 1200, padding: '.5rem', backgroundColor: '#ffffff93', borderRadius: '50px', display: 'flex', flexDirection: 'row', gap: '1rem', backdropFilter: 'blur(10px)', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            style={{ borderRadius: '30px', border: 'none', padding: '1rem', backgroundColor:'#ffffffff'}}
                            onChange={(e) => setSearchValue(e.target.value)}
                            value={searchValue}
                        ></input>
                        {searchValue && <div
                            style={{ position: 'absolute', right: '1rem', top: '.9rem', cursor: 'pointer' }}
                            onClick={() => setSearchValue('')}
                        >
                            <i class="fa-solid fa-x"></i>
                        </div>}
                    </div>
                    <div style={{fontSize:'1.1rem', color:'#00000077', cursor:'pointer'}}>
                        <i class="fa-solid fa-filter"></i>
                    </div>
                    <span
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: 'center', borderRadius: '30px', height: '40px', width: '40px', backgroundColor: '#d0d0d0ab', cursor: 'pointer', fontSize: '1.2rem', color:'red'}}
                        onClick={() => setChooseliked(!chooseLiked)}
                    ><i class="fa-solid fa-heart"></i></span>
                </div>
                <button
                    style={buttonStyle}
                    onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <i class="fa-solid fa-sun" style={{color:'white'}}></i> : <i class="fa-solid fa-moon"></i>}
                </button>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {darkMode && <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
                />}
                <MarkerClusterGroup
                    iconCreateFunction={(cluster) => {
                        const count = cluster.getChildCount();
                        return L.divIcon({
                            html: `<div style="${markerClusterStyle}">${count}</div>`,
                            className: 'custom-cluster',
                            // iconSize: L.point(40, 40),
                        });
                    }}
                >
                    {filteredBikeways.map((b, index) => (
                        <Marker position={[b.lat, b.lon]} key={index}>
                            <Popup
                                eventHandlers={{
                                    add: () => {
                                        setBikewayId(b.bikewayId);
                                    }
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: 'column', gap: '.5rem' }}>
                                    <div
                                        style={{ display: "flex", justifyContent: 'center' }}
                                    ><div
                                        style={{ fontSize: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                                        onClick={async () => {
                                            setLiked(!liked);
                                            await changeLikedStatus(b.bikewayId)
                                        }}
                                    >{checkLikedStatus(b.bikewayId) ? <i class="fa-solid fa-heart" style={{color:'red'}}></i>: <i class="fa-regular fa-heart"></i>}</div></div>
                                    <InfoRow
                                        title='Name'
                                        content={b.bikeway_name}
                                    />
                                    <InfoRow
                                        title='Year'
                                        content={b.year}
                                    />
                                    <InfoRow
                                        title='Status'
                                        content={b.status}
                                    />
                                    <InfoRow
                                        title='SpeedLimit'
                                        content={`${b.speedLimit} KM/h`}
                                    />

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', gap: '1rem' }}>
                                        <p style={{ margin: 0 }}>Comments:</p>
                                        <p
                                            style={{ fontWeight: "bold", margin: 0, cursor: 'pointer', textDecoration: 'underline', color: 'orange' }}
                                            onClick={() => { setBikewayId(b.bikewayId); setCommentCheck(!commentCheck), setOpenComment(true); }}

                                        >{b.comment_count}</p>
                                    </div>
                                    <InfoRow
                                        title='Surface Type'
                                        content={b.surface_type}
                                    />
                                    {/* <button
                                        style={{ backgroundColor: 'orange', borderRadius: '10px', color: 'white' }}
                                        onClick={() => { setIsOpen(!isOpen); setBikewayId(b.bikewayId); }}
                                    >Write comment</button> */}
                                    <Form
                                        bikewayId={bikewayId}
                                        // isOpen={isOpen}
                                        onCommentSubmit={() => updateBikewayCommentCount(b.bikewayId)}
                                        commentCheck={commentCheck}
                                        setCommentCheck={setCommentCheck}
                                    />
                                </div>
                            </Popup>

                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {openComment && <Comment
                bikewayId={bikewayId}
                commentCheck={commentCheck}
                onClose={() => { setOpenComment(false) }}
                reduceCommentCount={reduceCommentCount}
            />}
        </div>
    )
}