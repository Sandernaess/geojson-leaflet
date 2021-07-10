import React, { useState } from 'react'

// Components 
import Map from  './map/Map';
import Preview from './preview/Preview';


// styling 
import '../style/main.css';

function Main() {

    const [GeoJSON, setGeoJSON] = useState('{"type":"FeatureCollection","features":[]}'); 
   
    return (
        <main>
            <header className="header">
                <h1>GeoJSON - Markers editor</h1>
            </header>
            
            <Map callback={setGeoJSON}/>
            <Preview geoJSON={GeoJSON} />
        </main>
    )
}

export default Main; 