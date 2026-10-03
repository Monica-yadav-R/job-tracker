const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "login.html";
}

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
});


async function loadDashboard() {

    const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load jobs");
    }

    const jobs = await response.json();


    const totalJobs = jobs.length;

    const appliedJobs = jobs.filter(function (job) {
        return job.status === "Applied";
    }).length;

    const interviewJobs = jobs.filter(function (job) {
        return job.status === "Interview";
    }).length;

    const offerJobs = jobs.filter(function (job) {
        return job.status === "Offer";
    }).length;

    const savedJobs = jobs.filter(function (job) {
        return job.status === "Saved";
    }).length;

    const withdrawnJobs = jobs.filter(function (job) {
        return job.status === "Withdrawn";
    }).length;

    const rejectedJobs = jobs.filter(function (job) {
        return job.status === "Rejected";
    }).length;


    document.getElementById("total-jobs").textContent = totalJobs;
    document.getElementById("applied-jobs").textContent = appliedJobs;
    document.getElementById("interview-jobs").textContent = interviewJobs;
    document.getElementById("offer-jobs").textContent = offerJobs;
    document.getElementById("saved-jobs").textContent = savedJobs;
    document.getElementById("withdrawn-jobs").textContent = withdrawnJobs;
    document.getElementById("rejected-jobs").textContent = rejectedJobs;
}


loadDashboard();