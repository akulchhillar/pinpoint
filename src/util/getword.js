import { generate, count } from "random-words";
let date = new Date()

export async function getword(force = false){
	let word = null
	if(force){
	word = "swim"
	}
	else{
	word = generate({ min: 1, max: 1, seed: date.toDateString() })[0]
	}
	
    const url = `https://twinword-twinword-bundle-v1.p.rapidapi.com/word_theme/?entry=${word}`;
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e74e894982mshb77791afba41122p131c45jsn29370d1e47db',
		'x-rapidapi-host': 'twinword-twinword-bundle-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	
	return [result,word]
	
} catch (error) {
	return (error,888);
}
}

