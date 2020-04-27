const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const { plate = '' } = req.query;
	const availabilityResponse = await getPlateAvailability(plate);
	const contentResponse = await getPlateContent(plate);

	let data;

	if (availabilityResponse.status === 200 && contentResponse.status === 200) {
		data = {
			"status": 200,
			"availability" : availabilityResponse.available,
			"content" : contentResponse.data
		};
	} else {
		data = {
			status: 500,
			message: "Data unavailable!"
		}
	}

	res.setHeader('Access-Control-Allow-Origin', '*')
	res.json(data)
}

async function getPlateAvailability(plate) {
	const res = await fetch(process.env.KP+`${plate}`);
	
	if (res.ok) {
		const json = await res.json();
    	const available = json.Data.Available;

    	return {status: 200, "available" : available}
	} else {
		return {status: 500}
	}
};

async function getPlateContent(plate) {
    const res = await fetch(process.env.CJ+`${plate}`);
	
	if (res.ok) {
		const json = await res.json();
    	return { status: 200, "data": json}
	} else {
		return {status: 500}
	}
};