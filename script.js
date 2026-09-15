const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const countryInfo = document.getElementById("countryInfo");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

async function searchCountry() {
    const countryName = countryInput.value.trim();

    if (countryName === "") {
        errorMessage.textContent = "Please enter a country name.";
        countryInfo.innerHTML = "";
        return;
    }

    loading.textContent = "Loading...";
    errorMessage.textContent = "";
    countryInfo.innerHTML = "";

    try {
        const response = await fetch(
            `https://countries.dev/name/${encodeURIComponent(countryName)}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();

        // Exact country matching
        const searchText = countryName.toLowerCase();

        let country = data.find(function (item) {
            return item.name.toLowerCase() === searchText;
        });

        // Common country name corrections
        if (!country && searchText === "india") {
            country = data.find(function (item) {
                return item.name.toLowerCase() === "india";
            });
        }

        if (!country && 
            (searchText === "usa" ||
             searchText === "us" ||
             searchText === "united states" ||
             searchText === "united state")) {

            country = data.find(function (item) {
                return item.alpha2Code === "US";
            });
        }

        if (!country) {
            throw new Error("Country not found");
        }

        const currency = country.currencies?.[0];

        countryInfo.innerHTML = `
            <img
                src="${country.flag}"
                alt="${country.name} flag"
            >

            <h2>${country.name}</h2>

            <div class="info-grid">

                <div class="info-item">
                    <strong>Capital</strong>
                    <span>${country.capital || "N/A"}</span>
                </div>

                <div class="info-item">
                    <strong>Population</strong>
                    <span>
                        ${country.population
                            ? country.population.toLocaleString()
                            : "N/A"}
                    </span>
                </div>

                <div class="info-item">
                    <strong>Region</strong>
                    <span>${country.region || "N/A"}</span>
                </div>

                <div class="info-item">
                    <strong>Currency</strong>
                    <span>
                        ${
                            currency
                                ? `${currency.name} (${currency.symbol || ""})`
                                : "N/A"
                        }
                    </span>
                </div>

            </div>
        `;

    } catch (error) {
        console.error(error);

        errorMessage.textContent =
            "Country not found. Please try another country.";
    }

    loading.textContent = "";
}

searchBtn.addEventListener("click", searchCountry);

countryInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchCountry();
    }
});