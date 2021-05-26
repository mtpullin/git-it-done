var userFormEl= document.querySelector("#user-form")
var nameInputEl= document.querySelector("#username")
var repoContainerEl= document.querySelector("#repos-container");
var repoSearchTerm= document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons")
var getFeaturedRepos = function(language) {
    var apirUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    
    fetch(apirUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            })
        } else {
            alert("error: github user not found,")
        }
    })
}
var formSubmitHander = function(event) {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value = "";
    }else {
            alert("Please enter a GitHub username");
        }
    }
    console.log(event)
var displayRepos = function(repos, searchTerm) {
    //clear old content
    repoContainerEl.textContent="";
    repoSearchTerm.textContent=searchTerm;
    //check if api returned any repos
    if (repos.lenght === 0) {
        repoContainerEl.textContent = "no repositories found."
        return;
    }
   
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        //creat a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center"
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)
    
        //creat a span element to hold repository name
        var titleEl= document.createElement("span");
        titleEl.textContent = repoName;
    
        //append to container
        repoEl.appendChild(titleEl);
    
        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times satus-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container
        repoEl.appendChild(statusEl);
        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/"+ user + "/repos";

    //make request to url
    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if(response.ok) {
            response.json().then(function(data){
                displayRepos(data, user);
            });
        }else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error){
        //notice this '.catch()' getting chained onto the end of the '.then()'
        alert("unable to connec to github");
    });
};
var buttonClickHandler = function(event){
var language = event.target.getAttribute("data-language")
if(language) {
    getFeaturedRepos(language);

    //clear old content
    repoContainerEl.textContent = ""
}
}
userFormEl.addEventListener("submit", formSubmitHander);
languageButtonsEl.addEventListener("click", buttonClickHandler);