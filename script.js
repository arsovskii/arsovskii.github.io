var songspace = document.getElementById('song');

fetch("./spotify.json")
.then(response => {
   return response.json();
})
.then(data =>{

    let randomIndex = Math.random() * data[0].tracks.length;
    randomIndex = Math.floor(randomIndex);
 

    let elementToAdd = document.createElement('a');
    elementToAdd.innerText = `${data[0].tracks[randomIndex].name} - ${data[0].tracks[randomIndex].artist}`
    let uri = data[0].tracks[randomIndex].uri;
    uri = uri.split(":");

    elementToAdd.href = `https://open.spotify.com/track/${uri[2]}`;
    elementToAdd.target = "_blank";

    songspace.appendChild(elementToAdd);
    console.log("Благодарам на Исидора за листата со песни");

} );