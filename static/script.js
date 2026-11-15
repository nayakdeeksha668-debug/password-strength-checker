
// =====================================
// SECURECHECK PRO - JAVASCRIPT
// =====================================


// 1. Get HTML elements

const passwordInput = document.getElementById("password");

const toggleButton = document.getElementById("togglePassword");

const checkButton = document.getElementById("checkButton");

const resultSection = document.getElementById("resultSection");

const scoreElement = document.getElementById("score");

const strengthElement = document.getElementById("strength");

const progressBar = document.getElementById("progressBar");

const suggestions = document.getElementById("suggestions");

const errorMessage = document.getElementById("errorMessage");


// 2. Show or hide password

toggleButton.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        toggleButton.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        toggleButton.textContent = "Show";

    }

});


// 3. Update security checklist

function updateChecklist(checks) {

    const checklistItems = {
        length: "lengthCheck",
        uppercase: "upperCheck",
        lowercase: "lowerCheck",
        number: "numberCheck",
        special: "specialCheck"
    };

    for (const key in checklistItems) {

        const element = document.getElementById(
            checklistItems[key]
        );

        const passed = checks[key];

        element.textContent =
            (passed ? "✓ " : "✗ ") +
            {
                length: "At least 8 characters",
                uppercase: "Uppercase letters",
                lowercase: "Lowercase letters",
                number: "Numbers",
                special: "Special characters"
            }[key];

        element.style.color = passed
            ? "#22c55e"
            : "#f87171";

    }

}


// 4. Display password strength

function displayResult(data) {

    resultSection.classList.remove("hidden");

    scoreElement.textContent = data.score + "/100";

    strengthElement.textContent = data.strength;

    progressBar.style.width = data.score + "%";


    // Change progress bar colour

    if (data.score < 40) {

        progressBar.style.background = "#ef4444";

    } else if (data.score < 60) {

        progressBar.style.background = "#f59e0b";

    } else if (data.score < 80) {

        progressBar.style.background = "#3b82f6";

    } else {

        progressBar.style.background = "#22c55e";

    }


    // Update checklist

    updateChecklist(data.checks);


    // Display suggestions

    suggestions.replaceChildren();

    if (data.feedback.length === 0) {

        const item = document.createElement("li");

        item.textContent = "Excellent! All basic checks passed.";

        item.style.color = "#22c55e";

        suggestions.appendChild(item);

    } else {

        data.feedback.forEach(function (message) {

            const item = document.createElement("li");

            item.textContent = message;

            item.style.marginBottom = "10px";

            item.style.color = "#f87171";

            suggestions.appendChild(item);

        });

    }

}


// 5. Check password using Flask

checkButton.addEventListener("click", async function () {

    const password = passwordInput.value;

    errorMessage.textContent = "";

    if (password.length === 0) {

        resultSection.classList.add("hidden");

        errorMessage.textContent =
            "Please enter a password first.";

        return;

    }

    checkButton.disabled = true;

    checkButton.textContent = "Checking...";

    try {

        const response = await fetch("/check-password", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                password: password
            })

        });


        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error || "Password check failed.");

        }

        displayResult(data);

    } catch (error) {

        resultSection.classList.add("hidden");

        errorMessage.textContent =
            "Error: " + error.message;

    } finally {

        checkButton.disabled = false;

        checkButton.textContent = "Check Password →";

    }

});


// 6. Clear old results when password changes

passwordInput.addEventListener("input", function () {

    resultSection.classList.add("hidden");

    errorMessage.textContent = "";

});
