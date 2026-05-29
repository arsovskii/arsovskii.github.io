document.getElementById("btn").addEventListener("click", function () {
    let ime1 = document.getElementById("ime1").value.toLowerCase();
    let ime2 = document.getElementById("ime2").value.toLowerCase();
    let ime1vrednost = 0;
    let ime2vrednost = 0;
    let ispecateno = "";
    console.log(ime1)
    if (!ime1 || !ime2) {
        document.getElementById("final").innerHTML = `Внесете две имиња!`;
    }


    else {

        for (let i = 0; i < ime1.length; i++) {

            ime1vrednost = ime1vrednost + ime1[i].charCodeAt(0)
        }
        for (let i = 0; i < ime2.length; i++) {

            ime2vrednost = ime2vrednost + ime2[i].charCodeAt(0)
        }
        var seed = ime1vrednost + ime2vrednost;
        function procent() {

            var result = (seed * seed).toString().padStart(4, "0").slice(1, 3);
            // pad with zero when necessary and extract the middle value.

            seed = parseInt(result);

            return parseInt(result);

        }
        ispecateno = `${procent()}% Компатибилност!`
        console.log(ispecateno)
    }

    document.getElementById("final").innerHTML = `<span style="color:#00BBF9;"><3 <3 </span> ${ispecateno} <span style="color:#00BBF9;"><3 <3 </span> `;
});