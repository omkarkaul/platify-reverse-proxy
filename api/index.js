const fetch = require('node-fetch');

module.exports = async (req, res) => {
	const { plate = '' } = req.query;
	const availabilityResponse = await getPlateAvailability(plate);
	const contentResponse = await getPlateContent(plate);

	if (availabilityResponse.status === 200 && contentResponse.status === 200) {
		const data = {
			"availability" : availabilityResponse.available,
			"content" : contentResponse.data
		};
	
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.json(data);
	} else {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.send("data unavailable");
	}
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