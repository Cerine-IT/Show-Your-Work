document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get("challenge");
    const container = document.getElementById("cards-container");
    const title = document.getElementById("challenge-title");

    let data = [];
    if (challengeId === "1") {
        title.textContent = "Challenge 1 - Profile Cards";
        data = cards;
    } else if (challengeId === "2") {
        title.textContent = "Challenge 2 - Games";
        data = games;
    } else {
        title.textContent = "Challenge 3 - Coming Soon";
    }

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<h3>${item.name}</h3>
                          <a href="${item.link}" target="_blank">View Work</a>`;
        container.appendChild(card);
    });
});
