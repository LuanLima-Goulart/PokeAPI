let pokemonsData = [];

async function pokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");

        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}.`);
        }

        const data = await response.json();
        const listaPokemon = data.results;

        const infoPokemons = listaPokemon.map(async (pokemons) => {
            const infoResponse = await fetch(pokemons.url);
            if (!infoResponse.ok) throw new Error("Erro ao buscar info.");
            return await infoResponse.json();
        });

        pokemonsData = await Promise.all(infoPokemons);

        renderPokedex(pokemonsData);
    } catch (error) {
        console.error("Erro ao carregar a Pokédex:", error);
        alert("Não foi possível carregar os Pokémons, tente novamente mais tarde!");
    }
}

function renderPokedex(pokemons) {
    const grid = document.getElementById("pokedex-grid");
    grid.innerHTML = "";

    pokemons.forEach((poke, index) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

        col.innerHTML = `<div class="card h-100 text-center pokemon-card" style="cursor: pointer;" onclick="openModal(${index})">
                <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top mx-auto" alt="${poke.name}" style="width: 120px;">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${poke.name}</h5>
                </div>
            </div>`

        grid.appendChild(col);
    });

}

function abrirModal(index) {
    const poke = pokemonsData[index];

    document.getElementById("modalName").textContent = poke.name;
    document.getElementById("modalImage").src = poke.sprites.other["official-artwork"].front_default;

    const typeStr = poke.types.map
}

pokemons();