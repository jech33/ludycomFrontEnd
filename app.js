// Get data from API
api_url = "https://restcountries.eu/rest/v2/all";
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    let regions = [];
    let allCountries = {};

    // Get regions (continents)
    for (element in data) {
        if (regions.includes(data[element]["region"])===false) {
            regions.push(data[element]["region"]);
        }
    }
    const countriesRegions = regions.sort().slice(1,6);

    // Get countries by its region
    for (let i=0; i<countriesRegions.length; i++) {
        allCountries[countriesRegions[i]] = {};
        for (let j=0; j<data.length; j++) {
            if (data[j]["region"] == countriesRegions[i]) {
                allCountries[countriesRegions[i]][data[j]["name"]] = data[j];
            }
        }
    }
    console.log(allCountries["Africa"])

    // Write it in the html file
    function displayCountries(countriesByContinent) {
        for (continent in countriesByContinent) {
            for (continentCountry in countriesByContinent[continent]) {
                // Strcuture of html element --------->   <img src="https://restcountries.eu/data/gha.svg" alt="ghana-flag" width="30" height="18"> <p class="flag-country">Ghana</p>
                let div = document.createElement("div");
                div.className = "flag-text";

                let img = document.createElement("img");
                img.src = countriesByContinent[continent][continentCountry]["flag"];
                img.alt = countriesByContinent[continent][continentCountry]["name"]+"-flag";
                img.width = "30px";
                img.height = "18px";
                let p = document.createElement("p");
                p.id = countriesByContinent[continent][continentCountry]["name"];
                p.className = "flag-country";
                p.setAttribute("data-modal-target", "#modal")

                let text = document.createTextNode(countriesByContinent[continent][continentCountry]["name"])
                
                let favbtn = document.createElement("button")
                favbtn.className = "fav-btn"
                p.appendChild(text);
                div.innerHTML += '<img src="'+img.src+'" alt="'+img.alt+'" width="30px" height="auto" />';
                div.appendChild(p);
                favbtn.innerHTML+= '<i class="fa fa-star fa-1g" aria-hidden="true"></i>'
                div.appendChild(favbtn);

                if (continent == "Africa") {
                    //console.log(countriesByContinent[continent][continentCountry]["flag"]);
                    let continentToAppend = document.getElementById("africa");
                    continentToAppend.appendChild(div);
                }
                if (continent == "Americas") {
                    let continentToAppend = document.getElementById("america");
                    continentToAppend.appendChild(div);
                }
                if (continent == "Asia") {
                    let continentToAppend = document.getElementById("asia");
                    continentToAppend.appendChild(div);
                }
                if (continent == "Europe") {
                    let continentToAppend = document.getElementById("europa");
                    continentToAppend.appendChild(div);
                }
                if (continent == "Oceania") {
                    let continentToAppend = document.getElementById("oceania");
                    continentToAppend.appendChild(div);
                }
            }
        }
    }
    displayCountries(allCountries);

    
    //Selectors: declaring variables that select the elements needed from the DOM
    const searchButton = document.getElementById("searchbtn");
    let searchInput = document.getElementById("search_input").value;
    let openModalButtons = document.querySelectorAll('[data-modal-target]');
    let closeModalButtons = document.querySelectorAll('[data-close-button]');
    let overlay = document.getElementById("overlay");
    console.log(searchInput)


    //Event listeners 
    /* 
        When an event occurs (click), the corresponding variable (search_button) executes the function (lookUpCountry)
        variable.addEventListener('event', function)
    */
    

    //document.addEventListener('DOMContentLoaded', getFavorites);
    //country.addEventListener('click', showCountry);
    //searchButton.addEventListener('click', lookUpCountry);

    searchButton.addEventListener('click', lookUpCountry)

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            let nameOfCountry = button.innerHTML;
            let selectedName = document.getElementById("selectedCountry");
            selectedName.innerHTML = nameOfCountry
            for (continent in allCountries) {
                for (continentCountry in allCountries[continent]) {
                    if (continentCountry == nameOfCountry) {
                        let nameOfRegion = allCountries[continent][nameOfCountry]["region"];
                        let population = allCountries[continent][nameOfCountry]["population"];
                        let capital = allCountries[continent][nameOfCountry]["capital"];
                        let currency = allCountries[continent][nameOfCountry]["currencies"][0]["name"];
                        let language = allCountries[continent][nameOfCountry]["languages"][0]["name"];
                        let borderCountries = allCountries[continent][nameOfCountry]["borders"];
                        let imgFlag = document.createElement("img");
                        imgFlag.src = allCountries[continent][continentCountry]["flag"];
                        imgFlag.alt = allCountries[continent][continentCountry]["name"]+"-flag";
                        document.getElementById("selected-region").innerHTML="Region: "+nameOfRegion;
                        document.getElementById("selected-population").innerHTML="Population: "+population;
                        document.getElementById("selected-capital").innerHTML="Capital: "+capital;
                        document.getElementById("selected-currency").innerHTML="Currency: "+currency;
                        document.getElementById("selected-language").innerHTML="Language: "+language;
                        document.getElementById("selected-borderCountries").innerHTML="Border Countries: "+borderCountries;
                        document.getElementById("selected-flag").innerHTML='<img class="img-flag" src="'+imgFlag.src+'" alt="'+imgFlag.alt+'" width="30" height="auto" />';;
                        console.log(allCountries[continent][nameOfCountry]);
                    }
                }
            }
            openModal(modal);
        })
    })

    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal=>{
            closeModal(modal)
        })
    })

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        })
    })


    // Functions
    
    function lookUpCountry(){
        searchInput = document.getElementById("search_input").value.toLowerCase();
        let filteredCountries = data.filter((country)=>{
            return country["name"].toLowerCase().includes(searchInput)
        });

        // for (continent in allCountries) {
        //     for (continentCountry in allCountries[continent]) {
        //     }
        // }
        let filterC = {};
        for (let i=0; i<countriesRegions.length; i++) {
            filterC[countriesRegions[i]] = {};
            for (let j=0; j<filteredCountries.length; j++) {
                if (filteredCountries[j]["region"] == countriesRegions[i]) {
                    filterC[countriesRegions[i]][filteredCountries[j]["name"]] = filteredCountries[j];
                }
            }
        }
        document.getElementById("africa").innerHTML = "";
        document.getElementById("america").innerHTML = "";
        document.getElementById("asia").innerHTML = "";
        document.getElementById("europa").innerHTML = "";
        document.getElementById("oceania").innerHTML = "";
        displayCountries(filterC)
        console.log(filteredCountries)
    }

    function openModal(modal) {
        if (modal == null) return
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    function closeModal(modal) {
        if (modal == null) return
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }
    
}

getData(api_url)
