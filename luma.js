const form = document.getElementById("study-form");
const result = document.getElementById("study-plan");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const topicsInput = document.getElementById("topics").value.trim();
    const time = parseFloat(document.getElementById("time").value);

    if (!subject || !topicsInput || !time || time <= 0) {
        alert("Please fill in all the fields.");
        return;
    }


    const topics = topicsInput
        .split(",")
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0);

    if (topics.length === 0) {
        alert("Please enter at least one topic.");
        return;
    }

    generatePlan(subject, topics, time);
});


function generatePlan(subject, topics, totalHours) {

  

    const totalMinutes = Math.round(totalHours * 60);

  
    const minutesPerTopic = Math.floor(totalMinutes / topics.length);

    let remainingMinutes = totalMinutes;

    let sessions = [];


    topics.forEach((topic, index) => {

        let sessionTime;

        // Give the last topic all remaining minutes
        if (index === topics.length - 1) {
            sessionTime = remainingMinutes;
        } else {
            sessionTime = minutesPerTopic;
        }

        remainingMinutes -= sessionTime;

      

        if (sessionTime >= 40) {

            const learningTime = Math.round(sessionTime * 0.65);
            const practiceTime = sessionTime - learningTime;

            sessions.push({
                topic: topic,
                time: learningTime,
                type: "Learn",
                description:
                    `Understand the main concepts of ${topic}. Focus on definitions, formulas and examples.`
            });

            sessions.push({
                topic: topic,
                time: practiceTime,
                type: "Practice",
                description:
                    `Test yourself on ${topic}. Do questions without looking at your notes and identify weak areas.`
            });

        } else {

            sessions.push({
                topic: topic,
                time: sessionTime,
                type: "Focus",
                description:
                    `Focus on the most important concepts and exam-style questions for ${topic}.`
            });

        }

    });


    renderPlan(subject, sessions, totalMinutes);
}


function renderPlan(subject, sessions, totalMinutes) {

    result.innerHTML = `

        <div class="plan-header">

            <p class="eyebrow">LUMA'S PLAN</p>

            <h3>${escapeHTML(subject)}</h3>

            <p>
                ${sessions.length} focused sessions
                • ${totalMinutes} minutes total
            </p>

            <div class="plan-progress">
                <div
                    class="plan-progress-bar"
                    id="progress-bar"
                ></div>
            </div>

            <p class="progress-text" id="progress-text">
                0% complete
            </p>

        </div>

        <div id="sessions-container"></div>

        <button
            class="primary-button full-button"
            id="regenerate"
        >
            ↻ Regenerate Plan
        </button>
    `;


    const container = document.getElementById("sessions-container");


    sessions.forEach((session, index) => {

        const sessionElement = document.createElement("div");

        sessionElement.className = "session";

        sessionElement.innerHTML = `

            <div class="session-top">

                <span class="session-number">
                    SESSION ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="session-time">
                    ${session.time} min
                </span>

            </div>

            <h4>
                ${escapeHTML(session.type)} — ${escapeHTML(session.topic)}
            </h4>

            <p>
                ${escapeHTML(session.description)}
            </p>

            <label class="session-check">

                <input
                    type="checkbox"
                    class="completion-checkbox"
                >

                Mark as complete

            </label>
        `;


        container.appendChild(sessionElement);

    });


    const checkboxes =
        document.querySelectorAll(".completion-checkbox");

    checkboxes.forEach(checkbox => {

        checkbox.addEventListener("change", updateProgress);

    });


    updateProgress();


    document
        .getElementById("regenerate")
        .addEventListener("click", function() {

            generatePlan(
                subject,
                sessions.map(session => session.topic),
                totalMinutes / 60
            );

        });

}


function updateProgress() {

    const checkboxes =
        document.querySelectorAll(".completion-checkbox");

    const completed =
        document.querySelectorAll(
            ".completion-checkbox:checked"
        ).length;

    const total = checkboxes.length;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    document.getElementById("progress-bar").style.width =
        percentage + "%";

    document.getElementById("progress-text").textContent =
        `${percentage}% complete`;


    checkboxes.forEach(checkbox => {

        const session =
            checkbox.closest(".session");

        if (checkbox.checked) {
            session.classList.add("completed");
        } else {
            session.classList.remove("completed");
        }

    });

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}