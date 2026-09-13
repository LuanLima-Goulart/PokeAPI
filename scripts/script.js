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

    if (pokemons.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center mt-5">
                <h3 class="text-danger fw-bold">Nenhum pokémon encontrado</h3>
            </div>
        `;
        return;
    }

    pokemons.forEach((poke, index) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

        col.innerHTML = `<div class="card h-100 text-center pokemon-card" style="cursor: pointer;" onclick="abrirModal('${poke.name}')">
                <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top mx-auto" alt="${poke.name}" style="width: 120px;">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${poke.name}</h5>
                </div>
            </div>`

        grid.appendChild(col);
    });

}

function abrirModal(nome) {
    const poke = pokemonsData.find(p => p.name === nome);

    document.getElementById("modalName").textContent = poke.name;
    document.getElementById("modalImage").src = poke.sprites.other["official-artwork"].front_default;

    const typeStr = poke.types.map(t => t.type.name).join(" | ");
    const alturaMetros = poke.height / 10;
    const pesoKg = poke.weight / 10;
    document.getElementById("modalTypes").innerHTML = `
    <strong>Tipo:</strong> ${typeStr} <br>
    <strong>Altura:</strong> ${alturaMetros} m <br>
    <strong>Peso:</strong> ${pesoKg} kg
    `;

    const statsHtml = poke.stats.map(s => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-capitalize">${s.stat.name}</span>
            <span class="badge bg-primary rounded-pill">${s.base_stat}</span>
        </li>`
    ).join("");
    document.getElementById("modalStats").innerHTML = statsHtml;

    const meuModal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    meuModal.show();
}

const buscaInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

buscaInput.addEventListener("input", aplicarFiltros);
sortSelect.addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
    const textoBusca = buscaInput.value.toLowerCase();
    const opcaoOrdem = sortSelect.value;

    let pokemonsFiltrados = pokemonsData.filter(poke => 
        poke.name.toLowerCase().includes(textoBusca)
    );

    if (opcaoOrdem === "az") {
        pokemonsFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (opcaoOrdem !== "") {
        const partes = opcaoOrdem.split("_");
        const statName = partes[0]; 
        const ordem = partes[1];    

        pokemonsFiltrados.sort((a, b) => {
            const valorA = a.stats.find(s => s.stat.name === statName).base_stat;
            const valorB = b.stats.find(s => s.stat.name === statName).base_stat;

            if (ordem === "desc") {
                return valorB - valorA;
            } else {
                return valorA - valorB;
            }
        });
    }

    renderPokedex(pokemonsFiltrados);
}

pokemons();