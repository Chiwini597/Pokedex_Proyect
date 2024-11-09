const listaPokemon = document.querySelector("#listaPokemon");  
const botonesHeader = document.querySelectorAll(".btn-header");
const buscarPorIdForm = document.querySelector("#buscarPorIdForm");
const URL = "https://pokeapi.co/api/v2/pokemon/";

// Cargar los Pokémon al inicio
for (let i = 1; i <= 251; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data));
}

// Función para mostrar Pokémon
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<span class="badge bg-primary m-1">${type.type.name}</span>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("col-md-10", "mb-9"); 
    div.innerHTML = `
        <div class="card text-center shadow">
            <div class="card-header">
                <p class="text-muted">#${pokeId}</p>
            </div>
            <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="${poke.name}">
            <div class="card-body">
                <h5 class="card-title text-capitalize fw-bold">${poke.name}</h5>
                <div class="mb-2">
                    ${tipos}
                </div>
                <div class="pokemon-stats">
                    <p class="card-text mb-1"><strong>Height:</strong> ${poke.height}m</p>
                    <p class="card-text"><strong>Weight:</strong> ${poke.weight}kg</p>
                </div>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Evento de los botones de tipo de Pokémon
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 251; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }
            });
    }
}));

// Evento de búsqueda por ID o nombre
buscarPorIdForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonId = document.querySelector("#pokemonId").value.toLowerCase().trim();
    listaPokemon.innerHTML = "";

    if (pokemonId) {
        fetch(URL + pokemonId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Pokémon no encontrado");
                }
            })
            .then(data => mostrarPokemon(data))
            .catch(error => {
                listaPokemon.innerHTML = `<p class="text-center text-danger">Pokémon no encontrado</p>`;
            });
    }
});
