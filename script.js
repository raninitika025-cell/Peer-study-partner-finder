
// =====================================
// PEER STUDY PARTNER FINDER
// JavaScript functionality
// =====================================

// GET DATA FROM LOCAL STORAGE

function getData(key, fallback = []) {
    return JSON.parse(localStorage.getItem(key)) || fallback;
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let users = getData("studyUsers");
let requests = getData("studyRequests");
let messages = getData("studyMessages");
let blocked = getData("studyBlocked");
let reports = getData("studyReports");

let currentUser = getData("studyCurrentUser", null);
let activeChat = null;


// SAMPLE STUDENTS FOR DEMONSTRATION

const sampleStudents = [
    {
        id: "sample1",
        name: "Rahul Kumar",
        email: "rahul@demo.com",
        college: "ABC Engineering College",
        course: "B.Tech",
        year: "1st Year",
        branch: "CSE",
        section: "A",
        subjects: "Python, Mathematics, Physics",
        strongSubject: "Python",
        weakSubject: "Mathematics",
        studyMethod: "Online",
        studyStyle: "Group Study",
        availability: "Evening",
        hours: "2-3 Hours",
        language: "English",
        goal: "Exam Preparation",
        level: "Beginner",
        visible: true
    },
    {
        id: "sample2",
        name: "Priya Sharma",
        email: "priya@demo.com",
        college: "ABC Engineering College",
        course: "B.Tech",
        year: "1st Year",
        branch: "CSE",
        section: "B",
        subjects: "Java, Python, Mathematics",
        strongSubject: "Java",
        weakSubject: "Physics",
        studyMethod: "Both",
        studyStyle: "One-to-one",
        availability: "Night",
        hours: "3-4 Hours",
        language: "Hindi",
        goal: "Learning New Skills",
        level: "Intermediate",
        visible: true
    },
    {
        id: "sample3",
        name: "Arjun Reddy",
        email: "arjun@demo.com",
        college: "XYZ Engineering College",
        course: "B.Tech",
        year: "2nd Year",
        branch: "ECE",
        section: "A",
        subjects: "Electronics, Physics, Mathematics",
        strongSubject: "Physics",
        weakSubject: "Mathematics",
        studyMethod: "Offline",
        studyStyle: "Group Study",
        availability: "Morning",
        hours: "1-2 Hours",
        language: "Telugu",
        goal: "Exam Preparation",
        level: "Intermediate",
        visible: true
    },
    {
        id: "sample4",
        name: "Sneha Patel",
        email: "sneha@demo.com",
        college: "ABC Engineering College",
        course: "B.Tech",
        year: "1st Year",
        branch: "CSE",
        section: "A",
        subjects: "Python, HTML, CSS",
        strongSubject: "HTML",
        weakSubject: "Python",
        studyMethod: "Online",
        studyStyle: "One-to-one",
        availability: "Evening",
        hours: "2-3 Hours",
        language: "English",
        goal: "Learning New Skills",
        level: "Beginner",
        visible: true
    }
];


// SAVE CURRENT USER

function saveCurrentUser() {
    saveData("studyCurrentUser", currentUser);
}


// NAVIGATION

function showSection(sectionId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "dashboard") {
        updateDashboard();
    }

    if (sectionId === "matches") {
        renderMatches();
    }

    if (sectionId === "requests") {
        renderRequests();
    }

    if (sectionId === "messages") {
        renderChats();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}


// NAVIGATION LINKS

document.querySelectorAll(".navbar nav a").forEach(link => {

    link.addEventListener("click", function(event) {

        const sectionId = this.getAttribute("href").substring(1);

        if (sectionId === "home") {
            document.querySelectorAll(".section").forEach(s =>
                s.classList.add("hidden")
            );

            document.getElementById("home").scrollIntoView();
        } else {
            event.preventDefault();

            if (!currentUser && sectionId !== "auth") {
                alert("Please login first.");
                showSection("auth");
                return;
            }

            showSection(sectionId);
        }
    });
});


// AUTHENTICATION TABS

function showAuthForm(type) {

    document.getElementById("registerForm")
        .classList.toggle("hidden", type !== "register");

    document.getElementById("loginForm")
        .classList.toggle("hidden", type !== "login");
}


// REGISTRATION

document.getElementById("registerForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("regEmail")
        .value.trim().toLowerCase();

    if (users.some(user => user.email === email)) {
        alert("This email is already registered.");
        return;
    }

    const newUser = {

        id: "user_" + Date.now(),

        name: document.getElementById("regName").value.trim(),

        email: email,

        // Demo only: never store real passwords in localStorage.
        password: document.getElementById("regPassword").value,

        college: document.getElementById("regCollege").value.trim(),

        course: document.getElementById("regCourse").value,

        year: document.getElementById("regYear").value,

        branch: document.getElementById("regBranch").value,

        section: document.getElementById("regSection").value.trim(),

        subjects: "",

        strongSubject: "",

        weakSubject: "",

        studyMethod: "Online",

        studyStyle: "One-to-one",

        availability: "Evening",

        hours: "1-2 Hours",

        language: "English",

        goal: "Exam Preparation",

        level: "Beginner",

        visible: true
    };

    users.push(newUser);

    saveData("studyUsers", users);

    currentUser = newUser;

    saveCurrentUser();

    alert("Registration successful!");

    loginSuccess();
});


// LOGIN

document.getElementById("loginForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    currentUser = user;

    saveCurrentUser();

    alert("Login successful!");

    loginSuccess();
});


// AFTER LOGIN

function loginSuccess() {

    document.getElementById("logoutBtn")
        .classList.remove("hidden");

    document.getElementById("auth")
        .classList.add("hidden");

    document.getElementById("home")
        .classList.add("hidden");

    showSection("dashboard");
}


// LOGOUT

function logout() {

    currentUser = null;

    activeChat = null;

    localStorage.removeItem("studyCurrentUser");

    document.getElementById("logoutBtn")
        .classList.add("hidden");

    document.getElementById("home")
        .classList.remove("hidden");

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    alert("Logged out successfully!");
}


// SAVE STUDY PREFERENCES

document.getElementById("preferencesForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    const updatedUser = {

        ...currentUser,

        subjects: document.getElementById("subjects").value.trim(),

        strongSubject: document.getElementById("strongSubject").value,

        weakSubject: document.getElementById("weakSubject").value,

        studyMethod: document.getElementById("studyMethod").value,

        studyStyle: document.getElementById("studyStyle").value,

        availability: document.getElementById("availability").value,

        hours: document.getElementById("hours").value,

        language: document.getElementById("language").value,

        goal: document.getElementById("goal").value,

        level: document.getElementById("level").value
    };

    currentUser = updatedUser;

    users = users.map(user =>
        user.id === currentUser.id ? updatedUser : user
    );

    saveData("studyUsers", users);

    saveCurrentUser();

    alert("Study preferences saved successfully!");

    showSection("dashboard");
});


// GET ALL STUDENTS

function getAllStudents() {

    const registeredStudents = users.filter(user =>
        user.id !== currentUser.id
    );

    return [...sampleStudents, ...registeredStudents];
}


// DASHBOARD

function updateDashboard() {

    if (!currentUser) return;

    const allStudents = getAllStudents();

    const myRequests = requests.filter(request =>
        request.to === currentUser.id &&
        request.status === "pending"
    );

    const myPartners = requests.filter(request =>
        request.status === "accepted" &&
        (
            request.from === currentUser.id ||
            request.to === currentUser.id
        )
    );

    document.getElementById("welcomeText").innerText =
        "Welcome, " + currentUser.name + "!";

    document.getElementById("matchCount").innerText =
        allStudents.filter(student => isMatch(student)).length;

    document.getElementById("requestCount").innerText =
        myRequests.length;

    document.getElementById("partnerCount").innerText =
        myPartners.length;

    document.getElementById("myProfile").innerHTML = `
        <p><b>Name:</b> ${escapeHTML(currentUser.name)}</p>
        <p><b>Email:</b> ${escapeHTML(currentUser.email)}</p>
        <p><b>College:</b> ${escapeHTML(currentUser.college)}</p>
        <p><b>Course:</b> ${escapeHTML(currentUser.course)}</p>
        <p><b>Branch:</b> ${escapeHTML(currentUser.branch)}</p>
        <p><b>Year:</b> ${escapeHTML(currentUser.year)}</p>
        <p><b>Section:</b> ${escapeHTML(currentUser.section)}</p>
        <p><b>Subjects:</b> ${escapeHTML(currentUser.subjects || "Not selected")}</p>
    `;

    document.getElementById("profileVisible").checked =
        currentUser.visible !== false;
}


// MATCHING ALGORITHM

function isMatch(student) {

    if (!currentUser || !student) return false;

    if (student.visible === false) return false;

    if (blocked.includes(student.id)) return false;

    const mySubjects = (currentUser.subjects || "")
        .toLowerCase()
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    const theirSubjects = (student.subjects || "")
        .toLowerCase();

    const commonSubjects = mySubjects.filter(subject =>
        theirSubjects.includes(subject)
    );

    // Require at least one common subject.
    return commonSubjects.length > 0;
}


// FIND MATCHING STUDENTS

function renderMatches() {

    if (!currentUser) return;

    const search = document.getElementById("searchSubject")
        .value.toLowerCase().trim();

    const branch = document.getElementById("filterBranch").value;

    const year = document.getElementById("filterYear").value;

    const students = getAllStudents().filter(student => {

        const matchesSearch =
            !search ||
            student.subjects.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search);

        const matchesBranch =
            !branch || student.branch === branch;

        const matchesYear =
            !year || student.year === year;

        return matchesSearch && matchesBranch && matchesYear &&
            student.visible !== false &&
            !blocked.includes(student.id);
    });

    const container = document.getElementById("studentCards");

    container.innerHTML = "";

    if (students.length === 0) {
        container.innerHTML = "<p>No students found.</p>";
        return;
    }

    students.forEach(student => {

        const common = isMatch(student);

        const alreadyRequested = requests.some(request =>
            (
                request.from === currentUser.id &&
                request.to === student.id
            ) ||
            (
                request.from === student.id &&
                request.to === currentUser.id
            )
        );

        const card = document.createElement("div");

        card.className = "student-card";

        card.innerHTML = `

            <div class="avatar">
                ${escapeHTML(student.name.charAt(0).toUpperCase())}
            </div>

            <h3>${escapeHTML(student.name)}</h3>

            <p>${escapeHTML(student.course)} -
                ${escapeHTML(student.branch)}</p>

            <p>${escapeHTML(student.year)} |
                Section ${escapeHTML(student.section)}</p>

            <p><b>Subjects:</b>
                ${escapeHTML(student.subjects || "Not selected")}</p>

            <p><b>Availability:</b>
                ${escapeHTML(student.availability)}</p>

            <p><b>Study Method:</b>
                ${escapeHTML(student.studyMethod)}</p>

            <p><b>Matching:</b>
                ${common ? "⭐ Common Subjects" : "Other Student"}</p>

            <button class="btn"
                ${alreadyRequested ? "disabled" : ""}
                onclick="sendRequest('${student.id}')">

                ${alreadyRequested ? "Request Already Sent" : "Send Partner Request"}

            </button>

            <button class="btn secondary"
                onclick="blockStudent('${student.id}')">
                Block
            </button>

            <button class="btn secondary"
                onclick="reportStudent('${student.id}')">
                Report
            </button>
        `;

        container.appendChild(card);
    });
}


// SEND PARTNER REQUEST

function sendRequest(studentId) {

    if (requests.some(request =>
        (request.from === currentUser.id && request.to === studentId) ||
        (request.from === studentId && request.to === currentUser.id)
    )) {
        alert("A request already exists.");
        return;
    }

    requests.push({

        id: "request_" + Date.now(),

        from: currentUser.id,

        to: studentId,

        status: "pending"
    });

    saveData("studyRequests", requests);

    alert("Partner request sent successfully!");

    renderMatches();

    updateDashboard();
}


// REQUEST MANAGEMENT

function renderRequests() {

    if (!currentUser) return;

    const container = document.getElementById("requestList");

    container.innerHTML = "";

    const myRequests = requests.filter(request =>
        request.from === currentUser.id ||
        request.to === currentUser.id
    );

    if (myRequests.length === 0) {
        container.innerHTML = "<p>No partner requests yet.</p>";
    }

    myRequests.forEach(request => {

        const incoming = request.to === currentUser.id;

        const otherId = incoming ? request.from : request.to;

        const student = getAllStudents().find(s =>
            s.id === otherId
        );

        if (!student) return;

        const card = document.createElement("div");

        card.className = "request-card";

        let buttons = "";

        if (request.status === "pending" && incoming) {

            buttons = `
                <button class="btn"
                    onclick="acceptRequest('${request.id}')">
                    Accept
                </button>

                <button class="btn secondary"
                    onclick="rejectRequest('${request.id}')">
                    Reject
                </button>
            `;

        } else if (request.status === "pending") {

            buttons = "<span>Waiting for response</span>";

        } else if (request.status === "accepted") {

            buttons = "<span>✓ Accepted</span>";

        } else {

            buttons = "<span>Rejected</span>";
        }

        card.innerHTML = `
            <div>
                <h3>${escapeHTML(student.name)}</h3>
                <p>${incoming ? "Incoming Request" : "Outgoing Request"}</p>
                <p>${escapeHTML(student.branch)} -
                    ${escapeHTML(student.year)}</p>
            </div>

            <div>${buttons}</div>
        `;

        container.appendChild(card);
    });

    renderPartners();
}


// ACCEPT REQUEST

function acceptRequest(requestId) {

    requests = requests.map(request =>
        request.id === requestId
            ? { ...request, status: "accepted" }
            : request
    );

    saveData("studyRequests", requests);

    alert("Partner request accepted!");

    renderRequests();

    updateDashboard();
}


// REJECT REQUEST

function rejectRequest(requestId) {

    requests = requests.map(request =>
        request.id === requestId
            ? { ...request, status: "rejected" }
            : request
    );

    saveData("studyRequests", requests);

    alert("Partner request rejected.");

    renderRequests();

    updateDashboard();
}


// ACCEPTED PARTNERS

function getPartners() {

    const partnerIds = requests
        .filter(request =>
            request.status === "accepted" &&
            (
                request.from === currentUser.id ||
                request.to === currentUser.id
            )
        )
        .map(request =>
            request.from === currentUser.id
                ? request.to
                : request.from
        );

    return getAllStudents().filter(student =>
        partnerIds.includes(student.id)
    );
}


function renderPartners() {

    const container = document.getElementById("partnerList");

    container.innerHTML = "";

    const partners = getPartners();

    if (partners.length === 0) {
        container.innerHTML = "<p>No accepted partners yet.</p>";
        return;
    }

    partners.forEach(partner => {

        const card = document.createElement("div");

        card.className = "student-card";

        card.innerHTML = `
            <div class="avatar">
                ${escapeHTML(partner.name.charAt(0))}
            </div>

            <h3>${escapeHTML(partner.name)}</h3>

            <p>${escapeHTML(partner.branch)}</p>

            <button class="btn"
                onclick="openChat('${partner.id}')">
                Message Partner
            </button>
        `;

        container.appendChild(card);
    });
}


// MESSAGING SYSTEM

function renderChats() {

    const contacts = document.getElementById("chatContacts");

    contacts.innerHTML = "";

    const partners = getPartners();

    if (partners.length === 0) {
        contacts.innerHTML = "<p>No partners available.</p>";
    }

    partners.forEach(partner => {

        const div = document.createElement("div");

        div.className = "contact";

        div.innerText = partner.name;

        div.onclick = () => openChat(partner.id);

        contacts.appendChild(div);
    });
}


// OPEN CHAT

function openChat(partnerId) {

    const partner = getAllStudents().find(student =>
        student.id === partnerId
    );

    if (!partner) return;

    activeChat = partnerId;

    document.getElementById("chatHeader").innerText =
        "Chat with " + partner.name;

    renderMessages();
}


// DISPLAY MESSAGES

function renderMessages() {

    const container = document.getElementById("chatMessages");

    container.innerHTML = "";

    if (!activeChat) return;

    const chatMessages = messages.filter(message =>
        (
            message.from === currentUser.id &&
            message.to === activeChat
        ) ||
        (
            message.from === activeChat &&
            message.to === currentUser.id
        )
    );

    chatMessages.forEach(message => {

        const div = document.createElement("div");

        div.className = "message " +
            (message.from === currentUser.id ? "sent" : "");

        div.innerText = message.text;

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}


// SEND MESSAGE

document.getElementById("messageForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!activeChat) {
        alert("Please select a study partner.");
        return;
    }

    const partner = getPartners().find(p =>
        p.id === activeChat
    );

    if (!partner) {
        alert("You can only message accepted partners.");
        return;
    }

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (!text) return;

    messages.push({

        from: currentUser.id,

        to: activeChat,

        text: text,

        time: Date.now()
    });

    saveData("studyMessages", messages);

    input.value = "";

    renderMessages();
});


// BLOCK STUDENT

function blockStudent(studentId) {

    if (!confirm("Are you sure you want to block this student?")) {
        return;
    }

    if (!blocked.includes(studentId)) {
        blocked.push(studentId);
    }

    saveData("studyBlocked", blocked);

    alert("Student blocked successfully.");

    renderMatches();
}


// REPORT STUDENT

function reportStudent(studentId) {

    const reason = prompt("Enter the reason for reporting:");

    if (!reason || !reason.trim()) return;

    reports.push({

        studentId: studentId,

        reportedBy: currentUser.id,

        reason: reason.trim(),

        date: Date.now()
    });

    saveData("studyReports", reports);

    alert("Report submitted successfully.");
}


// PRIVACY SETTINGS

function savePrivacy() {

    if (!currentUser) return;

    currentUser.visible =
        document.getElementById("profileVisible").checked;

    users = users.map(user =>
        user.id === currentUser.id ? currentUser : user
    );

    saveData("studyUsers", users);

    saveCurrentUser();

    alert("Privacy settings saved!");
}


// HTML SAFETY

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


// AUTOMATIC LOGIN SESSION

if (currentUser) {

    // Refresh the current user from saved registration data.
    const savedUser = users.find(user =>
        user.id === currentUser.id
    );

    if (savedUser) {
        currentUser = savedUser;
        saveCurrentUser();
        loginSuccess();
    } else {
        currentUser = null;
        localStorage.removeItem("studyCurrentUser");
    }
}


// INITIAL PAGE

if (!currentUser) {
    showAuthForm("register");
}

