const API_BASE = "https://pokeapi.co/api/v2/pokemon/";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

const pokeInput = document.getElementById("pokeInput");
const findBtn = document.getElementById("findBtn");
const addBtn = document.getElementById("addBtn");

const statusEl = document.getElementById("status");
const pokeImg = document.getElementById("pokeImg");
const pokeAudio = document.getElementById("pokeAudio");

const moveSelects = [
    document.getElementById("move1"),
    document.getElementById("move2"),
    document.getElementById("move3"),
    document.getElementById("move4"),
];

const teamTable = document.getElementById("teamTable");

let currentPokemon = null; // { name, sprite, moves[], cryUrl }
let team = [];

const memCache = new Map();

function setStatus(msg, isError = true) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#b00020" : "#1a7f37";
}

function normalizeQuery(q) {
    return String(q || "").trim().toLowerCase();
}

function cacheKey(q) {
    return `pokeapi_pokemon_${q}`;
}

function loadFromLocalCache(q) {
    try {
        const raw = localStorage.getItem(cacheKey(q));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.time || !parsed.data) return null;

        const age = Date.now() - parsed.time;
        if (age > CACHE_TTL_MS) return null;

        return parsed.data;
    } catch {
        return null;
    }
}

function saveToLocalCache(q, data) {
    try {
        localStorage.setItem(
            cacheKey(q),
            JSON.stringify({ time: Date.now(), data })
        );
    } catch {
        // ignore storage issues
    }
}

async function fetchPokemon(query) {
    const q = normalizeQuery(query);
    if (!q) throw new Error("Enter a Pokemon name or ID.");

    // in-memory cache
    if (memCache.has(q)) return memCache.get(q);

    // localStorage cache
    const cached = loadFromLocalCache(q);
    if (cached) {
        memCache.set(q, cached);
        return cached;
    }

    const res = await fetch(API_BASE + encodeURIComponent(q));
    if (!res.ok) {
        throw new Error("Pokemon not found. Try a name (e.g. snorlax) or ID (1-151).");
    }

    const data = await res.json();
    memCache.set(q, data);
    saveToLocalCache(q, data);

    // Also cache by canonical name + id to reduce repeats
    if (data?.name) {
        memCache.set(data.name, data);
        saveToLocalCache(data.name, data);
    }
    if (data?.id != null) {
        memCache.set(String(data.id), data);
        saveToLocalCache(String(data.id), data);
    }

    return data;
}

function pickBestSprite(pokeJson) {
    // Prefer "front_default"; fallback to other common sprites if missing
    return (
        pokeJson?.sprites?.front_default ||
        pokeJson?.sprites?.other?.["official-artwork"]?.front_default ||
        pokeJson?.sprites?.other?.home?.front_default ||
        ""
    );
}

function pickCryUrl(pokeJson) {
    // PokeAPI provides "cries" (latest/legacy). Use whichever exists.
    return pokeJson?.cries?.latest || pokeJson?.cries?.legacy || "";
}

function fillMoveDropdowns(moveNames) {
    for (const sel of moveSelects) {
        sel.innerHTML = "";
        for (const m of moveNames) {
            const opt = document.createElement("option");
            opt.value = m;
            opt.textContent = m;
            sel.appendChild(opt);
        }
    }

    // Default-select first 4 distinct moves if possible
    for (let i = 0; i < moveSelects.length; i++) {
        moveSelects[i].selectedIndex = Math.min(i, moveNames.length - 1);
    }
}

function clearDisplay() {
    pokeImg.src = "";
    pokeImg.alt = "";
    pokeAudio.removeAttribute("src");
    pokeAudio.load();

    for (const sel of moveSelects) sel.innerHTML = "";
    currentPokemon = null;
}

function updateDisplayFromPokemon(pokeJson) {
    const name = pokeJson?.name || "";
    const sprite = pickBestSprite(pokeJson);
    const cryUrl = pickCryUrl(pokeJson);

    const moveNames = (pokeJson?.moves || [])
        .map(m => m?.move?.name)
        .filter(Boolean);

    currentPokemon = {
        name,
        sprite,
        cryUrl,
        moves: moveNames,
    };

    // Image
    if (sprite) {
        pokeImg.src = sprite;
        pokeImg.alt = name;
    } else {
        pokeImg.src = "";
        pokeImg.alt = "";
    }

    // Audio
    if (cryUrl) {
        pokeAudio.src = cryUrl;
    } else {
        pokeAudio.removeAttribute("src");
    }
    pokeAudio.load();

    // Move dropdowns
    if (moveNames.length > 0) {
        fillMoveDropdowns(moveNames);
    } else {
        for (const sel of moveSelects) sel.innerHTML = "";
    }
}

function renderTeam() {
    teamTable.innerHTML = "";

    for (const member of team) {
        const tr = document.createElement("tr");

        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.className = "teamSprite";
        img.src = member.sprite;
        img.alt = member.name;
        tdImg.appendChild(img);

        const tdMoves = document.createElement("td");
        const ul = document.createElement("ul");
        ul.className = "teamMoves";

        for (const mv of member.chosenMoves) {
            const li = document.createElement("li");
            li.textContent = mv;
            ul.appendChild(li);
        }

        tdMoves.appendChild(ul);

        tr.appendChild(tdImg);
        tr.appendChild(tdMoves);
        teamTable.appendChild(tr);
    }
}

async function onFind() {
    setStatus("");
    clearDisplay();

    try {
        const q = pokeInput.value;
        const data = await fetchPokemon(q);
        updateDisplayFromPokemon(data);
    } catch (err) {
        setStatus(err.message || "Something went wrong.", true);
    }
}

function onAddToTeam() {
    setStatus("");

    if (!currentPokemon) {
        setStatus("Find a Pokemon first.", true);
        return;
    }

    const chosenMoves = moveSelects.map(s => s.value).filter(Boolean);

    if (chosenMoves.length !== 4) {
        setStatus("Select 4 moves before adding to your team.", true);
        return;
    }

    team.push({
        name: currentPokemon.name,
        sprite: currentPokemon.sprite,
        chosenMoves,
    });

    renderTeam();
    setStatus("Added to team!", false);
}

findBtn.addEventListener("click", onFind);
addBtn.addEventListener("click", onAddToTeam);

// Optional: press Enter to search
pokeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onFind();
});

// Initial state similar to screenshot 1 (blank but ready)
clearDisplay();