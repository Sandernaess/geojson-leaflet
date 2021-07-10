import React from 'react'

// MUI components
import { Divider } from '@material-ui/core';

//styling 
import '../preview/preview.css';

function Preview(props) {

    const obj = JSON.parse(props.geoJSON);

    return (
        <article className="preview">
            <h1>Preview</h1>
            <Divider />
            <p><b>Markers</b>: {obj ? obj.features.length : 0}</p>
            
            <article className="preview-geojson">
                <pre>
                    <code>
                    {JSON.stringify(obj, undefined, 2)}
                    </code>
                </pre>          
            </article>
        </article>
    )
}

export default Preview
