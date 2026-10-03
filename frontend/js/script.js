import { getJobs, createJob ,deleteJob ,updateJob } from "./api.js";

const addJobbtn = document.getElementById("add-job-btn");
const sectionTitle = document.querySelector(".section-title");
const jobForm = document.getElementById("job-form");
const jobCards = document.getElementById("job-cards");

const logoutButton = document.getElementById("logout-button");

const searchInput = document.getElementById("search-input");

const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");

const cancelEditBtn = document.getElementById("cancel-edit-btn");

const statusFilter = document.getElementById("status-filter");

const sortJobs = document.getElementById("sort-jobs");

const errorMessage = document.getElementById("error-message");



sectionTitle.textContent = "My Job Applications";
sectionTitle.style.color = "darkcyan";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();

const formattedMonth = String(month).padStart(2,'0');
const formattedDay = String(day).padStart(2, "0");

const applicationDateInput = document.getElementById("application-date");
const todayDate = year + "-" + formattedMonth + "-" + formattedDay;
applicationDateInput.value = todayDate;

let editingCard = null;
let editingJobId = null;

const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "login.html";
}

function setStatusStyle(statusText,status) {
    
    statusText.classList.remove(
        "status-applied",
        "status-interview",
        "status-offer",
        "status-rejected",
        "status-saved",
        "status-withdrawn"
    )
     if (status === "Applied") {
            statusText.classList.add("status-applied");
        }
        else if(status ===  "Offer") {
            statusText.classList.add("status-offer");
        }
        else if(status === "Interview") {
            statusText.classList.add("status-interview");
        }
        else if (status === "Withdrawn") {
            statusText.classList.add("status-withdrawn");
        }
        else if(status === "Rejected") {
            statusText.classList.add("status-rejected");
        }
        else if(status === "Saved"){
            statusText.classList.add("status-saved");
        }
}

jobForm.addEventListener("submit",async function(event){
    event.preventDefault();
    const formData = new FormData(jobForm);
    const job = Object.fromEntries(formData);

    if (job.location === "") {
        job.location = null;
    }

    if (job.salary === "") {
        job.salary = null;
    }
    
    if (editingCard !== null){
        try{
            await updateJob(editingJobId,job);
        }catch(error){
            errorMessage.textContent = "Failed to update job.please check details.";
            return;
        }
        const companyHeading = editingCard.querySelector(".job-company");
        companyHeading.textContent = job.company;

        const roleText = editingCard.querySelector(".job-role");
        roleText.textContent = job.role;

        const locationText = editingCard.querySelector(".job-location");
        if (job.location === null){
            locationText.textContent = "Not Specified";
        }else {
            locationText.textContent = job.location;
        }

        const salaryText = editingCard.querySelector(".job-salary");
        if (job.salary === null){
            salaryText.textContent = "Salary: Not Specified";
        }else {
            salaryText.textContent = "Salary: " + job.salary;
        }

        const applicationDate = editingCard.querySelector(".job-application-date");
        applicationDate.textContent = job.application_date;

        const statusText = editingCard.querySelector(".job-status");
        statusText.textContent = "Status: " + job.status;

        
        setStatusStyle(statusText, job.status);

        formTitle.textContent = "Add a Job";
        submitBtn.value = "Save job";
        editingCard = null;
        jobForm.reset();
        applicationDateInput.value = todayDate;
        return;
    }


    try {
        const savedJob = await createJob(job);
    } catch(error){
        console.log(error);
        errorMessage.textContent = "Failed to create job.Please check your details.";
        return;
    }

    const card = document.createElement("article");
    card.className = "job-card";
    
    const companyHeading = document.createElement("h3");
    companyHeading.className = "job-company";
    companyHeading.textContent = job.company;

    const roleText = document.createElement("p");
    roleText.className = "job-role";
    roleText.textContent = job.role;

    const locationText = document.createElement("p");
    locationText.className = "job-location";
    if (job.location === null){
        locationText.textContent = "Not Specified";
    }else {
        locationText.textContent = job.location;
    }

    const salaryText = document.createElement("p");
    salaryText.className = "job-salary";
    if (job.salary === null){
        salaryText.textContent = "Not Specified";
    }else {
        salaryText.textContent = job.salary;
    }

    const applicationDate = document.createElement("p");
    applicationDate.className = "job-application-date";
    applicationDate.textContent = job.application_date;

    const statusText = document.createElement("p");
    statusText.className = "job-status";
    statusText.textContent = "Status: " + job.status;

    setStatusStyle(statusText, job.status);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = 'edit-btn';
    editButton.textContent = "Edit";
    console.log("Created edit button for:", job.company);

    card.appendChild(companyHeading);
    card.appendChild(roleText);
    card.appendChild(locationText);
    card.appendChild(salaryText);
    card.appendChild(applicationDate);
    card.appendChild(statusText);
    card.appendChild(deleteButton);
    card.appendChild(editButton);
    jobCards.appendChild(card);
    
    jobForm.reset();

    deleteButton.addEventListener("click",async function(){
        try{
            await deleteJob(savedJob.id);
        }catch(error) {
            console.log(error);
            errorMessage.textContent = "Failed to delete job";
            return;
        }
        card.remove();
    });
    
    const companyInput = document.getElementById("company");
    const roleInput = document.getElementById("role");
    const locationInput = document.getElementById("location");
    const salaryInput = document.getElementById("salary");
    const statusInput = document.getElementById("status");

    editButton.addEventListener("click" ,function(){
        console.log("Edit button clicked");

        editingCard = card;
        editingJobId = job.id;
        console.log("Editing job ID:", editingJobId);
        formTitle.textContent ="Edit Job";
        submitBtn.value = "Update Job";
        companyInput.value = job.company;
        roleInput.value = job.role;
        locationInput.value = job.location;
        salaryInput.value = job.salary;
        statusInput.value = job.status;
        applicationDateInput.value = job.application_date;
    });

});


addJobbtn.addEventListener("click",function(){
    jobForm.scrollIntoView({
        behavior:"smooth"
    })
    jobForm.reset();
    applicationDateInput.value = todayDate;
    formTitle.textContent = "Add a Job";
    submitBtn.value = "Save job";
    editingCard = null;
})

cancelEditBtn.addEventListener("click", function() {
    editingCard = null;
    jobForm.reset();
    applicationDateInput.value = todayDate;
    formTitle.textContent = "Add a Job";
    submitBtn.value = "Save job";
});

searchInput.addEventListener("input", function() { 
    const searchText = searchInput.value.toLowerCase().trim(); 
    const cards = document.querySelectorAll(".job-card"); 
    cards.forEach(function(card) { 
        const company = card.querySelector(".job-company").textContent.toLowerCase();
        const role = card.querySelector(".job-role").textContent.toLowerCase(); 
        if (company.includes(searchText) || role.includes(searchText)) { 
            card.style.display = ""; } else { card.style.display = "none"; 

            } 
        }); 
    });


function filterJobs() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const cards = document.querySelectorAll(".job-card");

    cards.forEach(function(card) {

        const company = card
            .querySelector(".job-company")
            .textContent
            .toLowerCase();

        const role = card
            .querySelector(".job-role")
            .textContent
            .toLowerCase();

        const statusText = card.querySelector(".job-status").textContent;
        const actualStatus = statusText
            .replace("Status: ", "")
            .trim();

        const searchMatches =
            company.includes(searchText) ||
            role.includes(searchText);

        const statusMatches =
            selectedStatus === "All Statuses" ||
            selectedStatus === actualStatus;

        if (searchMatches && statusMatches) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

searchInput.addEventListener("input", filterJobs);

statusFilter.addEventListener("change", filterJobs);


let jobs = []
getJobs().then(function(data){
    jobs = data;
    if (data.length === 0){
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No applications";
        jobCards.appendChild(emptyMessage);
    }else {
        data.forEach(function(job){
            const card = document.createElement("article");
            card.className = "job-card";

            const companyHeading = document.createElement("h3");
            companyHeading.className = "job-company";
            companyHeading.textContent = job.company;

            const roleText = document.createElement("p");
            roleText.className = "job-role";
            roleText.textContent = job.role;

            const locationText = document.createElement("p");
            locationText.className = "job-location";
            if (job.location === null){
                locationText.textContent = "Location: Not Specified";
            }else {
                locationText.textContent = "Location: " + job.location;
            }

            const salaryText = document.createElement("p");
            salaryText.className = "job-salary";
            if (job.salary === null){
                salaryText.textContent = "Salary: Not Specified";
            }else {
                salaryText.textContent = "Salary: " + job.salary;
            }

            const applicationDate = document.createElement("p");
            applicationDate.className = "job-application-date";
            applicationDate.textContent = job.application_date;

            const statusText = document.createElement("p");
            statusText.className = "job-status";
            statusText.textContent = "Status: " + job.status;

            setStatusStyle(statusText, job.status);

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = 'edit-btn';
            editButton.textContent = "Edit";

            card.appendChild(companyHeading);
            card.appendChild(roleText);
            card.appendChild(locationText);
            card.appendChild(salaryText);
            card.appendChild(applicationDate);
            card.appendChild(statusText);
            card.appendChild(deleteButton);
            card.appendChild(editButton);
            jobCards.appendChild(card);

            deleteButton.addEventListener("click",async function(){
                 try{
                    await deleteJob(job.id);
                }catch(error) {
                    errorMessage.textContent = "Failed to delete job";
                    return;
                }
                card.remove();
            });
            
            const companyInput = document.getElementById("company");
            const roleInput = document.getElementById("role");
            const locationInput = document.getElementById("location");
            const salaryInput = document.getElementById("salary");
            const statusInput = document.getElementById("status");

            editButton.addEventListener("click", function(){
            console.log("Edit button clicked");

            editingCard = card;
            editingJobId = job.id;

            console.log("Editing job ID:", editingJobId);

            formTitle.textContent = "Edit Job";
            submitBtn.value = "Update Job";

            companyInput.value = job.company;
            roleInput.value = job.role;
            locationInput.value = job.location;
            salaryInput.value = job.salary;
            statusInput.value = job.status;
            applicationDateInput.value = job.application_date;
        });
        });
    }
});


sortJobs.addEventListener("change", function(event) {
    if(sortJobs.value == "company-az"){
        jobs.sort(function(a,b){
            return a.company.localeCompare(b.company);  
        });
    }else if(sortJobs.value == "company-za"){
        jobs.sort(function(a,b){
            return b.company.localeCompare(a.company);  
        });
    }else if (sortJobs.value == "newest") {

    jobs.sort(function(a, b) {
        return new Date(b.application_date) - new Date(a.application_date);
    });

    } else if (sortJobs.value == "oldest") {

    jobs.sort(function(a, b) {
        return new Date(a.application_date) - new Date(b.application_date);
    });

    }
    jobCards.innerHTML = "";

    jobs.forEach(function(job){
        const card = document.createElement("article");
    console.log("Creating card for:", job.company);
    card.className = "job-card";

    const companyHeading = document.createElement("h3");
    companyHeading.className = "job-company";
    companyHeading.textContent = job.company;

    const roleText = document.createElement("p");
    roleText.className = "job-role";
    roleText.textContent = job.role;

    const locationText = document.createElement("p");
    locationText.className = "job-location";
    if (job.location === null){
        locationText.textContent = "Location: Not Specified";
    }else {
        locationText.textContent = "Location: " + job.location;
    }
    

    const salaryText = document.createElement("p");
    salaryText.className = "job-salary";
    if (job.salary === null){
        salaryText.textContent = "Salary: Not Specified";
    }else {
        salaryText.textContent = "Salary: " + job.salary;
    }

    const applicationDate = document.createElement("p");
    applicationDate.className = "job-application-date";
    applicationDate.textContent = job.application_date;

    const statusText = document.createElement("p");
    statusText.className = "job-status";
    statusText.textContent = "Status: " + job.status;

    setStatusStyle(statusText, job.status);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = 'edit-btn';
    editButton.textContent = "Edit";

    card.appendChild(companyHeading);
    card.appendChild(roleText);
    card.appendChild(locationText);
    card.appendChild(salaryText);
    card.appendChild(applicationDate);
    card.appendChild(statusText);
    card.appendChild(deleteButton);
    card.appendChild(editButton);
    jobCards.appendChild(card);

    deleteButton.addEventListener("click",async function(){
        try{
            await deleteJob(job.id);
        }catch(error) {
            errorMessage.textContent = "Failed to delete job";
            return;
        }
        card.remove();
    });
    
    const companyInput = document.getElementById("company");
    const roleInput = document.getElementById("role");
    const locationInput = document.getElementById("location");
    const salaryInput = document.getElementById("salary");
    const statusInput = document.getElementById("status");

    editButton.addEventListener("click", function(){

    editingCard = card;
    editingJobId = job.id;


    formTitle.textContent = "Edit Job";
    submitBtn.value = "Update Job";

    companyInput.value = job.company;
    roleInput.value = job.role;
    locationInput.value = job.location;
    salaryInput.value = job.salary;
    statusInput.value = job.status;
    applicationDateInput.value = job.application_date;
    });
    });
});

logoutButton.addEventListener("click",function(){
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
});