// --- Helpers ---
function $(id) {
    return document.getElementById(id);
}

function getSelectedArticleType() {
    // Radios in the HTML do not have "value", so we map by id
    if ($("opinionRadio").checked) return "opinion";
    if ($("recipeRadio").checked) return "recipe";
    if ($("lifeRadio").checked) return "update"; // Life Update maps to class "update"
    return null;
}

function setDisplay(el, show) {
    el.style.display = show ? "" : "none";
}

// --- Toggle UI Sections ---
// Matches HTML onclick="showFilter()" and onclick="showAddNew()" :contentReference[oaicite:1]{index=1}
function showFilter() {
    const filterForm = $("filterContent");
    const newForm = $("newContent");

    // Toggle filter form
    const isCurrentlyVisible = getComputedStyle(filterForm).display !== "none";
    filterForm.style.display = isCurrentlyVisible ? "none" : "block";

    // Hide add form when showing filter
    if (!isCurrentlyVisible) {
        newForm.style.display = "none";
    }
}

function showAddNew() {
    const filterForm = $("filterContent");
    const newForm = $("newContent");

    // Toggle add form
    const isCurrentlyVisible = getComputedStyle(newForm).display !== "none";
    newForm.style.display = isCurrentlyVisible ? "none" : "flex"; // CSS expects flex :contentReference[oaicite:2]{index=2}

    // Hide filter form when showing add form
    if (!isCurrentlyVisible) {
        filterForm.style.display = "none";
    }
}

// --- Filtering ---
// Matches HTML onclick="filterArticles()" on checkboxes :contentReference[oaicite:3]{index=3}
function filterArticles() {
    const showOpinion = $("opinionCheckbox").checked;
    const showRecipe = $("recipeCheckbox").checked;
    const showUpdate = $("updateCheckbox").checked;

    document.querySelectorAll("#articleList article").forEach((article) => {
        if (article.classList.contains("opinion")) setDisplay(article, showOpinion);
        else if (article.classList.contains("recipe")) setDisplay(article, showRecipe);
        else if (article.classList.contains("update")) setDisplay(article, showUpdate);
    });
}

// --- Add New Article ---
// Matches HTML onclick="addNewArticle()" button :contentReference[oaicite:4]{index=4}
function addNewArticle() {
    const title = $("inputHeader").value.trim();
    const text = $("inputArticle").value.trim();
    const typeClass = getSelectedArticleType();

    // Basic validation
    if (!title) {
        alert("Please enter a title.");
        return;
    }
    if (!typeClass) {
        alert("Please select an article type.");
        return;
    }
    if (!text) {
        alert("Please enter article text.");
        return;
    }

    // Build the new <article> to match existing structure/styles :contentReference[oaicite:5]{index=5}
    const article = document.createElement("article");
    article.classList.add(typeClass);

    const marker = document.createElement("span");
    marker.className = "marker";
    marker.textContent =
        typeClass === "opinion" ? "Opinion" : typeClass === "recipe" ? "Recipe" : "Update";

    const h2 = document.createElement("h2");
    h2.textContent = title;

    const pText = document.createElement("p");
    pText.textContent = text;

    const pLink = document.createElement("p");
    const a = document.createElement("a");
    a.href = "moreDetails.html";
    a.textContent = "Read more...";
    pLink.appendChild(a);

    article.appendChild(marker);
    article.appendChild(h2);
    article.appendChild(pText);
    article.appendChild(pLink);

    // Add to the article list
    $("articleList").appendChild(article);

    // Clear form + hide it (so it matches the screenshot flow)
    $("inputHeader").value = "";
    $("inputArticle").value = "";
    $("opinionRadio").checked = false;
    $("recipeRadio").checked = false;
    $("lifeRadio").checked = false;

    $("newContent").style.display = "none";

    // Apply filter immediately so the new article is shown/hidden correctly
    filterArticles();
}

// --- Initial setup ---
document.addEventListener("DOMContentLoaded", () => {
    // Start with the add form hidden (CSS already does this) :contentReference[oaicite:6]{index=6}

    // If you want the filter menu hidden until clicking "Filter Articles",
    // hide it on load (your CSS currently shows it by default) :contentReference[oaicite:7]{index=7}
    $("filterContent").style.display = "none";

    // Ensure initial filtering state is applied
    filterArticles();
});