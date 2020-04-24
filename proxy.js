const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/:plate', async (req, res) => {
    const plate = req.params.plate;

    const availabilityResponse = await getPlateAvailability(plate);
	const contentResponse = await getPlateContent(plate);

	if (availabilityResponse.status === 200 && contentResponse.status === 200) {
		const data = {
			"availability" : availabilityResponse.available,
			"content" : contentResponse.data
		};
	
		res.header('Access-Control-Allow-Origin', '*')
		res.json(data);
	} else {
		res.header('Access-Control-Allow-Origin', '*')
		res.send("data unavailable");
	}
});

async function getPlateAvailability(plate) {
	const res = await fetch(`https://api.kiwiplates.nz/api//combination/${plate}`);
	
	if (res.ok) {
		const json = await res.json();
    	const available = json.Data.Available;

    	return {status: 200, "available" : available}
	} else {
		return {status: 500}
	}
};

async function getPlateContent(plate) {
    const res = await fetch(`https://www.carjam.co.nz/a/rvid_service::rnr?plate=${plate}`);
	
	if (res.ok) {
		const json = await res.json();
    	return { status: 200, "data": json}
	} else {
		return {status: 500}
	}
};

app.listen(8080, () => {
    console.log('proxy is up');
})