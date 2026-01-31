window.addEventListener("DOMContentLoaded", () => {
    fetch("/api/getMessages")
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const messagesContainer = document.getElementById("messagesContainer");
            messagesContainer.innerHTML = "";
            data.messages.forEach(message => {
                const messageElement = document.createElement("div");
                const messageDelete = document.createElement("button");
                messageDelete.innerHTML = "Löschen";
                messageElement.classList.add("messageCard");
                messageElement.innerHTML = `
                    <div class="messageCardChild1">
                        <h3>${message.name}</h3>
                        <div class="mailContainer">
                            <img src="assets/icon/pngtree-mail-icon-image_1287429.png">
                            <a href="mailto:${message.email}">${message.email}</a>
                        </div>
                    </div>
                    <div class="messageCardChild2">
                        <h3><u>Nachricht:</u></h3>
                        <p>${message.message}</p>
                    </div>
                `;
                messageElement.appendChild(messageDelete);
                messagesContainer.appendChild(messageElement);

                messageDelete.addEventListener("click", () => {
                    fetch("/api/deleteMessage", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: message.id })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        window.location.reload();
                    });
                });
            });
        }
    });
});