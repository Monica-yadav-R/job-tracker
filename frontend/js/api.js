export async function getJobs(){

    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/jobs`,{
            headers: {
                "Authorization":"Bearer " + token
            }
    }
    );    
    const data = await response.json();

    return data;
}

export async function createJob(job){
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/jobs`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer "+ token
        },
        body:JSON.stringify(job)
    });
    // if(!response.ok){
    //     throw new Error("Something went wrong");
    // }
    if (!response.ok) {
    const errorData = await response.json();
    console.log("Create job error:", JSON.stringify(errorData, null, 2));
    throw new Error(errorData.detail);
    }
    const data = await response.json();
    return data;
}

export async function deleteJob(jobId){
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer " + token
        }
    });
    const data = await response.json();
    return data;
}

export async function updateJob(jobId,job){
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`,{
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body:JSON.stringify(job)
    });
    if(!response.ok){
        throw new Error("Failed to update job");
    }
    const data = await response.json();
    return data;
}