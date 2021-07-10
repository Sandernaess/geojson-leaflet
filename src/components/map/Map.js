import React, { useEffect, useState } from 'react'

// Styling 
import './map.css'

// Components
import Editor from '../editor/Editor'; 

// MUI Components
import { IconButton, Tooltip } from '@material-ui/core';

// MUI Icons
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import pinIcon from '../../img/placeholder.png';

let L, map, layer; 

function Map({callback}) {
    
    const [clickedMarker, setClickedMarker] = useState(null);
 
    // customize each feature added
    function onEachFeature (feature, layer) {
        layer.bindPopup(feature.properties.title ? "<h2>" + feature.properties.title + "</h2>" : "<h2>No title</h2>");

        layer.on('click', (e) => {
            setClickedMarker(layer);
            //layer.bindPopup(feature.properties.title ? "<h2>" + feature.properties.title + "</h2>" : "<h2>No title</h2>");
        }); 

        layer.on('dragend', (e) => {       
            feature.geometry.coordinates = [e.target.getLatLng().lng, e.target.getLatLng().lat];
            setClickedMarker({...layer});
            updateGeoJSON(); 
            layer.fireEvent('click'); 
        });

        layer.getPopup().on('remove', (e) => {
            setClickedMarker(null);
        });
    }


    // Delete a feature from the layer
    function deleteMarker () {
        layer.removeLayer(clickedMarker);
        setClickedMarker(null);
        updateGeoJSON(); 
    }

    // adds a feature to the map
    function onMapClick (e) {

        let feature = {
            "type": "Feature", 
            "properties": {
                
              },
            "geometry": {
                "type": "Point",
                "coordinates": [e.latlng.lng, e.latlng.lat]
            }
        }

        layer.addData(feature); 

        updateGeoJSON(); 
    }

    // update the GeoJSON preview
    function updateGeoJSON() {
        callback(JSON.stringify(layer.toGeoJSON(6)));
    }

    // changes the title and snippet
    function handleChange (title, snippet) {
        clickedMarker.feature.properties.title = title; 
        clickedMarker.feature.properties.snippet = snippet;

        setClickedMarker({...clickedMarker});
        
        clickedMarker.bindPopup("<h2>" + title + "<h2>");
        clickedMarker.fireEvent('click'); 
        clickedMarker.openPopup();

        updateGeoJSON();
    }

    // Delete all the layers/markers placed on the map
    function deleteAll() {
        layer.eachLayer((layers) => {
            layer.removeLayer(layers);
        });

        updateGeoJSON();
    }
   
    // When component mount, initialize map and layer
    useEffect(() => {
          
        // Adds tile and click listener to the map
        function initializeMap() {
            L = window.L; 
            map = L.map('map').setView([60.165426, 10.26123], 7); 
        
            // tile for map
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', onMapClick); 
        }

        function initializeLayer() {

            // Custom marker icon
            let icon = new L.icon({
                iconUrl: pinIcon, 
                iconSize: [35, 35]
            });


            // Check if user has saved GeoSJON locally 
            if (localStorage.getItem('GeoJSON')) {
                let geoJSON = JSON.parse(localStorage.getItem('GeoJSON'));  

                layer = L.geoJSON(geoJSON, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: icon, draggable: true}); 
                    },
                    onEachFeature: onEachFeature
                }).addTo(map);

                updateGeoJSON();
            } else {
                // if none saved, start with clear screen
                layer = L.geoJSON(null, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: icon, draggable: true}); 
                    },
                    onEachFeature: onEachFeature
                }).addTo(map); 
            }
        }

        initializeMap();
        initializeLayer();

        // Clean up the map when unmounting
        return function cleanup() {
            map.off();
            map.remove();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Saves the current GeoJSON locally
    function saveGeoJSON() {
        localStorage.setItem('GeoJSON', JSON.stringify(layer.toGeoJSON(6)));
    }

    return (
        <section className="map">

            <div className="map-tools">                     
                <IconButton color="primary" className="save-geoJSON" onClick={saveGeoJSON}>
                    <Tooltip title="Save GeoJSON" aria-label="Save as GeoJSON" placement="bottom">
                        <SaveAltIcon />
                    </Tooltip>
                </IconButton>
            

                <IconButton color="secondary" className="save-geoJSON" onClick={deleteAll}>
                    <Tooltip title="Clear" aria-label="Delete all markers" placement="bottom">
                        <DeleteForeverIcon />
                    </Tooltip>
                </IconButton>
            </div>
            
            <div id="map" />
          
            {clickedMarker ? <div className="map-actions">
                <p>{JSON.stringify(clickedMarker.feature.geometry.coordinates)}</p>

                <Editor feature={clickedMarker.feature} callback={handleChange}/>

                <IconButton onClick={deleteMarker} color="secondary">
                    <Tooltip title="Delete marker" aria-label="Delete a marker" placement="bottom">
                        <DeleteIcon />
                    </Tooltip>
                </IconButton>
            </div> : null}
        </section>
    )
}

export default Map;