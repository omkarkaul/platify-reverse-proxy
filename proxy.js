const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/plate', async (req, res) => {
    const availability = await getPlateAvailability('reee');
    const content = await getPlateContent('reee');

    const data = {
        "availability" : availability,
        "content" : content
    };

    res.header("Access-Control-Allow-Origin", "*");
    res.send(data);
});

async function getPlateAvailability(plate) {
    const res = await fetch(`https://api.kiwiplates.nz/api//combination/${plate}`);
    const json = await res.json();
    const available = json.Data.Available;

    return available;
};

async function getPlateContent(plate) {
    const res = await fetch(`https://www.carjam.co.nz/a/rvid_service::rnr?plate=${plate}`);
    const json = await res.json();

    return json;
};

app.listen(8080, () => {
    console.log('proxy is up');
})