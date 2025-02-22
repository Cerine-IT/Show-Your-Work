// script.js
// Chargement des soumissions et initialisation
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeNumber = urlParams.get("challenge");
    if (challengeNumber) {
        document.getElementById("challenge-number").innerText = challengeNumber;
        loadSubmissions(challengeNumber);
    }

    // Gestion du bouton d'ajout de soumission
    document.getElementById("add-submission").addEventListener("click", function () {
        document.getElementById("submission-form").style.display = "block";
    });

    // Gestion du bouton d'annulation du formulaire
    document.getElementById("cancel-button").addEventListener("click", closeForm);

    // Gestion du bouton de soumission du formulaire
    document.getElementById("submit-btn").addEventListener("click", function () {
        addSubmission(challengeNumber);
    });

    // Affichage des cartes de soumission au défilement
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Pour afficher les cartes déjà visibles au chargement
});

// Fonction pour ajouter une soumission
function addSubmission(challenge) {
    const name = document.getElementById("name").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const link = document.getElementById("link").value.trim();

    if (!name || !firstname || !link) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // Récupérer les soumissions existantes ou initialiser un tableau vide
    const submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];

    // Ajouter la nouvelle soumission
    submissions.push({ name, firstname, link });

    // Enregistrer dans le localStorage
    localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));

    // Recharger les soumissions pour afficher la nouvelle
    loadSubmissions(challenge);

    // Fermer le formulaire
    closeForm();
}

// Fonction pour charger les soumissions
function loadSubmissions(challenge) {
    const submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];
    const submissionList = document.getElementById("submission-list");
    submissionList.innerHTML = "";

    submissions.forEach((submission, index) => {
        const div = document.createElement("div");
        div.classList.add("submission-card");

        div.innerHTML = `
            <p><strong>${submission.name} ${submission.firstname}</strong></p>
            <a href="${submission.link}" target="_blank">🔗 Voir le travail</a>
            <button class="edit-button" onclick="editSubmission(${challenge}, ${index})">✏️ Modifier</button>
            <button class="delete-button" onclick="deleteSubmission(${challenge}, ${index})">🗑️ Supprimer</button>
            <div id="edit-section-${index}" style="display: none;">
                <input type="text" id="edit-name-${index}" value="${submission.name}">
                <input type="text" id="edit-firstname-${index}" value="${submission.firstname}">
                <input type="url" id="edit-link-${index}" value="${submission.link}">
                <button onclick="saveSubmission(${challenge}, ${index})">💾 Sauvegarder</button>
            </div>
        `;

        submissionList.appendChild(div);

    /*loadComments(challenge, index);*/
    });
}
// Fonction pour modifier une soumission
function editSubmission(challenge, index) {
    document.getElementById(`edit-section-${index}`).style.display = "block";
}

// Fonction pour sauvegarder une soumission modifiée
function saveSubmission(challenge, index) {
    const name = document.getElementById(`edit-name-${index}`).value.trim();
    const firstname = document.getElementById(`edit-firstname-${index}`).value.trim();
    const link = document.getElementById(`edit-link-${index}`).value.trim();

    if (!name || !firstname || !link) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];
    submissions[index] = { name, firstname, link };

    localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));
    loadSubmissions(challenge);
}

// Fonction pour supprimer une soumission
function deleteSubmission(challenge, index) {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette soumission ?");
    if (confirmDelete) {
        const submissions = JSON.parse(localStorage.getItem(`submissions-${challenge}`)) || [];
        submissions.splice(index, 1);
        localStorage.setItem(`submissions-${challenge}`, JSON.stringify(submissions));
        loadSubmissions(challenge);
    }
}

// Fonction pour fermer le formulaire
function closeForm() {
    document.getElementById("submission-form").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("firstname").value = "";
    document.getElementById("link").value = "";
}

// Fonction pour afficher les cartes au défilement
function revealOnScroll() {
    const cards = document.querySelectorAll(".submission-card");
    cards.forEach((card) => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight - 100;

        if (cardPosition < screenPosition) {
            card.classList.add("visible");
        }
    });
}

// Fonctions pour les commentaires
function toggleCommentForm(challenge, index) {
    const section = document.getElementById(`comment-section-${challenge}-${index}`);
    section.style.display = section.style.display === "none" ? "block" : "none";
}

function addComment(challenge, index) {
    const input = document.getElementById(`comment-input-${challenge}-${index}`);
    const commentText = input.value.trim();

    if (!commentText) {
        alert("Le commentaire ne peut pas être vide !");
        return;
    }

    const comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];
    comments.push(commentText);

    localStorage.setItem(`comments-${challenge}-${index}`, JSON.stringify(comments));
    input.value = "";
    loadComments(challenge, index);
}

function loadComments(challenge, index, sorted = false) {
    const comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];
    const likes = JSON.parse(localStorage.getItem(`likes-${challenge}-${index}`)) || {};
    const commentList = document.getElementById(`comments-${challenge}-${index}`);
    commentList.innerHTML = "";

    const commentsWithLikes = comments.map((comment, commentIndex) => ({
        text: comment,
        likes: likes[commentIndex] || 0,
    }));

    if (sorted) {
        commentsWithLikes.sort((a, b) => b.likes - a.likes);
    }

    commentsWithLikes.forEach((comment, commentIndex) => {
        const div = document.createElement("div");
        div.classList.add("comment-item");

        div.innerHTML = `
            <p>${comment.text}</p>
            <button onclick="likeComment(${challenge}, ${index}, ${commentIndex})">👍 ${comment.likes}</button>
            <button onclick="deleteComment(${challenge}, ${index}, ${commentIndex})">🗑️ Supprimer</button>
        `;

        commentList.appendChild(div);
    });
}

function likeComment(challenge, index, commentIndex) {
    const likes = JSON.parse(localStorage.getItem(`likes-${challenge}-${index}`)) || {};
    likes[commentIndex] = (likes[commentIndex] || 0) + 1;

    localStorage.setItem(`likes-${challenge}-${index}`, JSON.stringify(likes));
    loadComments(challenge, index);
}

function deleteComment(challenge, index, commentIndex) {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?");
    if (confirmDelete) {
        const comments = JSON.parse(localStorage.getItem(`comments-${challenge}-${index}`)) || [];
        comments.splice(commentIndex, 1);

        localStorage.setItem(`comments-${challenge}-${index}`, JSON.stringify(comments));
        loadComments(challenge, index);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const submissionsList = document.getElementById("submissions-list");
    const submissionForm = document.getElementById("submission-form");
    const nameInput = document.getElementById("name");
    const submissionInput = document.getElementById("submission");

    // Charger les soumissions sauvegardées
    const savedSubmissions = JSON.parse(localStorage.getItem("submissions")) || [];
    savedSubmissions.forEach(addSubmissionToList);

    submissionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        const submissionText = submissionInput.value.trim();
        
        if (name && submissionText) {
            const newSubmission = { name, submissionText, comments: [] };
            savedSubmissions.push(newSubmission);
            localStorage.setItem("submissions", JSON.stringify(savedSubmissions));
            addSubmissionToList(newSubmission);
            nameInput.value = "";
            submissionInput.value = "";
        }
    });

    function addSubmissionToList(submission, index) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${submission.name}</strong>: ${submission.submissionText}`;

        const commentSection = document.createElement("div");
        commentSection.classList.add("comment-section");

        const commentList = document.createElement("ul");
        submission.comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.textContent = comment;
            commentList.appendChild(commentItem);
        });
        
        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Ajouter un commentaire";
        
        const commentButton = document.createElement("button");
        commentButton.textContent = "Commenter";
        commentButton.addEventListener("click", function () {
            const commentText = commentInput.value.trim();
            if (commentText) {
                submission.comments.push(commentText);
                localStorage.setItem("submissions", JSON.stringify(savedSubmissions));
                
                const commentItem = document.createElement("li");
                commentItem.textContent = commentText;
                commentList.appendChild(commentItem);
                
                commentInput.value = "";
            }
        });
        
        commentSection.appendChild(commentList);
        commentSection.appendChild(commentInput);
        commentSection.appendChild(commentButton);
        listItem.appendChild(commentSection);
        submissionsList.appendChild(listItem);
    }
});
