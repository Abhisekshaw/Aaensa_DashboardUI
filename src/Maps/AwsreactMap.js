import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import "./reactmap.css"

AWS.config.region = 'ap-southeast-2'; // Set your AWS region
AWS.config.credentials = new AWS.Credentials('AKIAVX25R4T2YWIIQKO6', 'BQ7edVSBNzaeM40eqQYD+7z8CW4ysGmEzoSssdPy');
const locationService = new AWS.Location();

const AwsLocationSearch = () => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    useEffect(()=>{
        const searchPlaceIndexForText = () => {
            const params = {
                IndexName: 'NextGen_MapServices', // Set your place index name
                Text: searchText // Get search text from state
            };
    
            locationService.searchPlaceIndexForText(params, (err, data) => {
                if (err) {
                    console.error('Error:', err);
                } else {
                    console.log('Search Results:', data);
                    setResults(data.Results || []);
                }
            });
        }
        searchPlaceIndexForText();
    },[searchText])
    return (
        <div className="container">
            <h1>AWS Location Service Search</h1>
            <input
                type="text"
                value={searchText}
                placeholder="Enter search text"
                onChange={(e) => setSearchText(e.target.value)}
            />
            {/* <button onClick={searchPlaceIndexForText}>Search</button> */}
            <div id="results">
                {results.map((result, index) => (
                    <div key={index} className="result">
                       <button>
                        {/* <strong>Address:</strong> {result.Place && result.Place.Label} */}
                        <span>{result.Place && result.Place.Label}</span>
                       </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default AwsLocationSearch;
