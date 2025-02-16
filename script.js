document.addEventListener("DOMContentLoaded", function(){
    const urlParams = new URLSearchParams(window.location.search);
    const challengeNumber = urlParams.get("challenge");
    document.getElementById("challenge-number").innerText = challengeNumber;
    loadSubmissions(challengeNumber);
});

    function addSubmission(challenge) {
    let name = document.getElementById("submission-name").value;
    let link = document.getElementById("submission-link").value;

    if (!name || !link) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    let submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];
    submissions.push({ name, link });

    localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));

    // Ajouter la nouvelle soumission avec effet d’apparition
    const submissionList = document.getElementById(`submissions-${challenge}`);
    const div = document.createElement("div");
    div.classList.add("submission-card");
    div.innerHTML = `
        <p><strong>${name}</strong></p>
        <a href="${link}" target="_blank">🔗 Voir le travail</a>
        <button class="edit-button" onclick="editSubmission(${challenge}, ${submissions.length - 1})">✏️ Modifier</button>
        <button class="delete-button" onclick="deleteSubmission(${challenge}, ${submissions.length - 1})">🗑️ Supprimer</button>
    `;

    submissionList.appendChild(div);

    // Effacer les champs après l'ajout
    document.getElementById("submission-name").value = "";
    document.getElementById("submission-link").value = "";
}




    function loadSubmissions(challenge) {
    let submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];

    const submissionList = document.getElementById(`submissions-${challenge}`);
    submissionList.innerHTML = "";

    submissions.forEach((submission, index) => {
        const div = document.createElement("div");
        div.classList.add("submission-card");

        div.innerHTML = `
            <p id="submission-name-${index}"><strong>${submission.name}</strong></p>
            <a id="submission-link-${index}" href="${submission.link}" target="_blank">🔗 Voir le travail</a>
            <button class="edit-button" onclick="editSubmission(${challenge}, ${index})">✏️ Modifier</button>
            <button class="delete-button" onclick="deleteSubmission(${challenge}, ${index})">🗑️ Supprimer</button>
            <div id="edit-section-${index}" style="display: none;">
                <input type="text" id="edit-name-${index}" value="${submission.name}">
                <input type="url" id="edit-link-${index}" value="${submission.link}">
                <button onclick="saveSubmission(${challenge}, ${index})">💾 Sauvegarder</button>
            </div>
        `;

        submissionList.appendChild(div);
    });
}

function editSubmission(challenge, index) {
    document.getElementById(`edit-section-${index}`).style.display = "block";
}

function saveSubmission(challenge, index) {
    let submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];

    submissions[index].name = document.getElementById(`edit-name-${index}`).value;
    submissions[index].link = document.getElementById(`edit-link-${index}`).value;

    localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));

    loadSubmissions(challenge);
}

function deleteSubmission(challenge, index) {
    let submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];

    submissions.splice(index, 1);
    localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));

    loadSubmissions(challenge);
}


    function saveSubmission() {
        const name = document.getElementById("name").value;
        const firstname = document.getElementById("firstname").value;
        const link = document.getElementById("link").value;

        if (!name || !firstname || !link) return alert("Please fill in all fields");

        const urlParams = new URLSearchParams(window.location.search);
        const challengeNumber = urlParams.get("challenge");
        let submissions = JSON.parse(localStorage.getItem(`challenge-${challengeNumber}`)) || [];

        submissions.push({ name, firstname, link });
        localStorage.setItem(`challenge-${challengeNumber}`, JSON.stringify(submissions));
        closeForm();
        loadSubmissions(challengeNumber);
    }

    function closeForm() {
        document.getElementById("submission-form").style.display = "none";
    }

    document.getElementById("add-submission").addEventListener("click", function (){
        document.getElementById("submission-form").style.display = "block";
    });

    function toggleCommentForm(challenge, index) {
        const section = document.getElementById(`comment-section-${challenge}-${index}`);
        section.style.display = (section.style.display === "none") ? "block" : "none";
    }

    function addComment(challenge, index){
        const input= document.getElementById(`comment-input-${challenge}-${index}`);
        const commentText = input.value.trim();

        if (commentText===""){
            alert("Comment can't be empty !");
            return;
        }

        let comments = JSON.parse(localStorage.getItem(`comment-${challenge}-${index}`)) || [];
        comments.push(commentText);

        localStorage.setItem(`comments-${challenge}-${index}`, JSON.stringify(comments));

        input.value= "";
        loadComments(challenge, index);
    }

    function loadComments(challenge, index, sorted = false) {
        let comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];
        let likes = JSON.parse(localStorage.getItem(`likes-${challenge}-${index}`)) || {};

        const commentList = document.getElementById(`comments-${challenge}-${index}`);
        commentList.innerHTML = "";

        let commentsWithLikes = comments.map((comment, commentIndex) => ({
            text: comment,
            index: commentIndex,
            likes: likes[commentIndex] || 0
        }));

        if (sorted) {
            commentsWithLikes.sort((a, b) => b.likes - a.likes);
        }

        commentsWithLikes.forEach(({ text, index: commentIndex, likes }) => {
            const div = document.createElement("div");
            div.classList.add("comment-item");

        div.innerHTML = `
            <p id="comment-text-${challenge}-${index}-${commentIndex}">${text}</p>
            <button onclick="editComment(${challenge}, ${index}, ${commentIndex})">✏️</button>
            <button onclick="deleteComment(${challenge}, ${index}, ${commentIndex})">🗑️</button>
            <button onclick="likeComment(${challenge}, ${index}, ${commentIndex})">👍 <span id="like-count-${challenge}-${index}-${commentIndex}">${likes}</span></button>
            <div id="edit-section-${challenge}-${index}-${commentIndex}" style="display: none;">
                <input type="text" id="edit-input-${challenge}-${index}-${commentIndex}" value="${text}">
                <button onclick="saveComment(${challenge}, ${index}, ${commentIndex})">💾</button>
            </div>
        `;

        commentList.appendChild(div);
    });
}

    function sortComments(challenge, index) {
        loadComments(challenge, index, true);
}

    function deleteComment(challenge, index, commentIndex) {
        const confirmDelete = confirm("Es-tu sûr de vouloir supprimer ce commentaire ?");
    
        if (confirmDelete) {
            let comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];

            comments.splice(commentIndex, 1);

            localStorage.setItem(`comments-${challenge}-${index}`, JSON.stringify(comments));

            loadComments(challenge, index);
    }
}


    function editComment(challenge, index, commentIndex) {
        document.getElementById(`comment-text-${challenge}-${index}-${commentIndex}`).style.display = "none";
        document.getElementById(`edit-section-${challenge}-${index}-${commentIndex}`).style.display = "block";
}

    function saveComment(challenge, index, commentIndex) {
        const input = document.getElementById(`edit-input-${challenge}-${index}-${commentIndex}`);
        const newText = input.value.trim();

        if (newText === "") {
            alert("Comment can't be empty !");
            return;
    }

        let comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];
        comments[commentIndex] = newText;

        localStorage.setItem(`comments-${challenge}-${index}`, JSON.stringify(comments));

        loadComments(challenge, index);
}

    function likeComment(challenge, index, commentIndex) {
        let likes = JSON.parse(localStorage.getItem(`likes-${challenge}-${index}`)) || {};
        let userLikes = JSON.parse(localStorage.getItem(`userLikes-${challenge}-${index}`)) || {};

        if (userLikes[commentIndex]) {
            alert("You've already liked this comment !");
            return;
        }

        likes[commentIndex] = (likes[commentIndex] || 0) + 1;
        userLikes[commentIndex] = true;

        localStorage.setItem(`likes-${challenge}-${index}`, JSON.stringify(likes));
        localStorage.setItem(`userLikes-${challenge}-${index}`, JSON.stringify(userLikes));

        document.getElementById(`like-count-${challenge}-${index}-${commentIndex}`).innerText = likes[commentIndex];
}

    function renderCommentSection(challenge, index) {
        const commentSection = document.getElementById(`comment-section-${challenge}-${index}`);
        commentSection.innerHTML = `
            <button onclick="sortComments(${challenge}, ${index})">🔼 Trier par popularité</button>
            <div id="comments-${challenge}-${index}"></div>
        `;

    loadComments(challenge, index);
}

function revealOnScroll() {
    let cards = document.querySelectorAll(".submission-card");

    cards.forEach((card) => {
        let cardPosition = card.getBoundingClientRect().top;
        let screenPosition = window.innerHeight - 100; // Ajuster la sensibilité

        if (cardPosition < screenPosition) {
            card.classList.add("visible");
        }
    });
}

// Exécuter la fonction à chaque scroll
window.addEventListener("scroll", revealOnScroll);

// Exécuter la fonction au chargement (pour détecter les cartes déjà visibles)
document.addEventListener("DOMContentLoaded", revealOnScroll);
 });
