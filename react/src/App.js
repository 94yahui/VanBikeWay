import { useState } from "react";
import { Map } from "./components/Map.js";

const App = () => {
    const mainContainerStyle = {
        position: "relative"
    }

    return (<div style={mainContainerStyle}>
        <Map
        />
    </div>)
}

export default App;