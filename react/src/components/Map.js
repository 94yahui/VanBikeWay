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
        height: "600px",
        borderRadius: "15px",
        position: 'relative',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
        width: '30px',
        height: '30px',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    }

    const [bikeways, setBikeways] = useState([]);
    const [bikewayId, setBikewayId] = useState('');
    // const [isOpen, setIsOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const [openCommentForm, setOpenCommentForm] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [commentCheck, setCommentCheck] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [liked, setLiked] = useState(false);
    const [likedBikeways, setLikedBikeways] = useState([]);
    const [chooseLiked, setChooseliked] = useState(false);
    const [status, setStatus] = useState('');
    const [speedLimit, setSpeedLimit] = useState({
        minSpeed: '',
        maxSpeed: ''
    });
    const [year, setYear] = useState({
        minYear: '',
        maxYear: ''
    });


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

    const bikewayStatus = [...new Set(filteredBikeways.map(b => b.status))];

    const filteredData = filteredBikeways.filter(b => {
        const statusMatch = status ? b.status === status : true;

        const speedMatch = (!speedLimit.minSpeed || b.speedLimit >= speedLimit.minSpeed) &&
            (!speedLimit.maxSpeed || b.speedLimit <= speedLimit.maxSpeed);

        const yearMatch = (!year.minYear || b.year >= year.minYear) &&
            (!year.maxYear || b.year <= year.maxYear);

        return statusMatch && speedMatch && yearMatch;

    })



    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(45deg,lightgreen, lightblue)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '1rem',
                fontFamily: 'sans-serif'
            }}><h1>Vancouver Bikeways</h1></div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '1rem',
                fontFamily: 'sans-serif'
            }}>
                {/* Status Card */}
                <div style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    minWidth: '150px'
                }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                        <i class="fa-solid fa-location-crosshairs"></i> Status
                    </label>
                    <select
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '0.95rem'
                        }}
                        value={status}
                    >
                        <option value="">All Status</option>
                        {bikewayStatus.map((s, index) =>
                            <option key={index} value={s}>{s}</option>
                        )}
                    </select>
                </div>

                {/* Speed Limit Card */}
                <div style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0'
                }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                        <i class="fa-solid fa-bicycle"></i> Speed Limit (km/h)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            onChange={(e) => setSpeedLimit({ ...speedLimit, minSpeed: Number(e.target.value) })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem'
                            }}
                            value={speedLimit.minSpeed}
                        />
                        <span style={{ color: '#999' }}>~</span>
                        <input
                            type="number"
                            placeholder="Max"
                            onChange={(e) => setSpeedLimit({ ...speedLimit, maxSpeed: Number(e.target.value) })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem'
                            }}
                            value={speedLimit.maxSpeed}
                        />
                    </div>
                </div>

                {/* Year Card */}
                <div style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0'
                }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                        <i class="fa-regular fa-calendar"></i> Year
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="From"
                            onChange={(e) => setYear({ ...year, minYear: Number(e.target.value) })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem'
                            }}
                            value={year.minYear}
                        />
                        <span style={{ color: '#999' }}>~</span>
                        <input
                            type="number"
                            placeholder="To"
                            onChange={(e) => setYear({ ...year, maxYear: Number(e.target.value) })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '0.95rem'
                            }}
                            value={year.maxYear}
                        />
                    </div>
                </div>
                <div style={{
                    // flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '1rem',
                    backgroundColor: '#e0e0e0ff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0'
                }}
                    onClick={() => {
                        setStatus('');
                        setSpeedLimit({
                            minSpeed: '',
                            maxSpeed: ''
                        }
                        );
                        setYear({
                            minYear: '',
                            maxYear: ''
                        });
                        setChooseliked(false);
                    }}
                >Reset</div>
            </div>
            <MapContainer style={mapStyle} zoom={13} center={[49.2827, -123.1207]}>
                <div style={{ position: 'absolute', top: '1rem', left: '5rem', zIndex: 1200, padding: '.5rem', backgroundColor: '#ffffff93', borderRadius: '50px', display: 'flex', flexDirection: 'row', gap: '1rem', backdropFilter: 'blur(10px)', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            style={{ borderRadius: '30px', border: 'none', padding: '1rem', backgroundColor: '#ffffffff' }}
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
                    <span
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: 'center', borderRadius: '30px', height: '40px', width: '40px', backgroundColor: '#d0d0d0ab', cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
                        onClick={() => setChooseliked(!chooseLiked)}
                    ><i class="fa-solid fa-heart"></i></span>
                </div>
                <button
                    style={buttonStyle}
                    onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <i class="fa-solid fa-sun" style={{ color: 'white' }}></i> : <i class="fa-solid fa-moon"></i>}
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
                    {filteredData.map((b, index) => (
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
                                    >{checkLikedStatus(b.bikewayId) ? <i class="fa-solid fa-heart" style={{ color: 'red' }}></i> : <i class="fa-regular fa-heart"></i>}</div></div>
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
                                            style={{ fontWeight: "bold", margin: 0, cursor: 'pointer', textDecoration: 'underline', color: '#4972ecff' }}
                                            onClick={() => { setBikewayId(b.bikewayId); setCommentCheck(!commentCheck), setOpenComment(true); }}

                                        >{b.comment_count}</p>
                                    </div>
                                    <InfoRow
                                        title='Surface Type'
                                        content={b.surface_type}
                                    />
                                    <button
                                        style={{ backgroundColor: '#4972ecff', borderRadius: '10px', color: 'white', border: 'none', padding: '.5rem', cursor: 'pointer' }}
                                        onClick={() => setOpenCommentForm(true)}
                                    >Write comment</button>
                                </div>
                            </Popup>

                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
            {openCommentForm &&
                <div
                    style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(10px)', zIndex: 1200, backgroundColor: '#8888885d' }}
                >

                </div>}

            {openCommentForm &&
                <div style={{
                    position: 'fixed', inset: 0, display:'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1300
                }}><Form
                        bikewayId={bikewayId}
                        // isOpen={isOpen}
                        onCommentSubmit={() => updateBikewayCommentCount(bikewayId)}
                        commentCheck={commentCheck}
                        setCommentCheck={setCommentCheck}
                        onClose={() => setOpenCommentForm(false)}
                        openCommentForm={openCommentForm}
                    />
                </div>
            }

            {openComment && <Comment
                bikewayId={bikewayId}
                commentCheck={commentCheck}
                onClose={() => { setOpenComment(false) }}
                reduceCommentCount={reduceCommentCount}
                openComment={openComment}
            />}
        </div>
    )
}