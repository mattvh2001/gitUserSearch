const express = require('express')
const fetch = require('isomorphic-fetch');
const fs = require('fs')
const app = express()
const port = process.env.PORT || 3001

const helmet = require("helmet");


app.use(helmet());

const bodyParser = require('body-parser');

//Body parser is used to read data from the body. Body parser is deprecated but I had issues with the other method
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());



//returns a user object from both gitlab and github if it exists.
app.get('/search/:user', async (req, res)=>{
    console.log("params = " + req.params.user)
    const gitHubResult = await fetch("https://api.github.com/users/" + req.params.user);
    const gitHubRes = await gitHubResult.json();

    const gitLabResult = await fetch("https://gitlab.com/api/v4/users?username=" + req.params.user) 
    const gitLabRes = await gitLabResult.json();
    console.log(gitLabRes[0]);
    
    
    res.json({hubItems: gitHubRes,labItems: gitLabRes[0]});
})

//used for testing the '/search/:user' endpoint with a fixed value
app.get('/searchtest', async (req, res)=>{
  const user = "user";
  const gitHubResult = await fetch("https://api.github.com/users/" + user);
  const gitHubRes = await gitHubResult.json();

  const gitLabResult = await fetch("https://gitlab.com/api/v4/users?username=" + user) 
  const gitLabRes = await gitLabResult.json();
  
  res.json({hubItems: gitHubRes,labItems: gitLabRes[0]});
})

//returns the user's gitHub repositories and commit messages for each repository
app.get('/repo/github/:user', async (req, res)=>{
    const gitHubRepoResult = await fetch("https://api.github.com/users/" + req.params.user + "/repos")
    const gitHubRepoRes = await gitHubRepoResult.json();

    let repo;
    //loops through the array of repository objects and adds an array of commits to each repository object
    for (let i = 0; i < gitHubRepoRes.length; i++){
        const commitFetchRes = await fetch("https://api.github.com/repos/" + req.params.user + "/" +gitHubRepoRes[i].name +"/commits?per_page=5") ;
        const commitRes = await commitFetchRes.json();
        
        let repo = gitHubRepoRes[i];
        repo["fiveCommits"] = commitRes;
        gitHubRepoRes[i] = repo;
      };
    res.json({gitHubRepoRes})  
})

//used for testing the '/repo/github/:user' endpoint with a fixed value
app.get('/repoGithubTest', async (req, res)=>{
  const user = 'john';
  const gitHubRepoResult = await fetch("https://api.github.com/users/" + user + "/repos")
  const gitHubRepoRes = await gitHubRepoResult.json();

  let repo;
  //loops through the array of repository objects and adds an array of commits to each repository object
  for (let i = 0; i < gitHubRepoRes.length; i++){
      const commitFetchRes = await fetch("https://api.github.com/repos/" + user + "/" +gitHubRepoRes[i].name +"/commits?per_page=5") ;
      const commitRes = await commitFetchRes.json();
      
      let repo = gitHubRepoRes[i];
      repo["fiveCommits"] = commitRes;
      gitHubRepoRes[i] = repo;
    };
  res.json({gitHubRepoRes})  
})

//returns the user's gitlab repositories and commit messages for each repository
app.get('/repo/gitlab/:id', async (req, res)=>{
    const gitLabRepoResult = await fetch("https://gitlab.com/api/v4/users/" + req.params.id + "/projects")
    const gitLabRepoRes = await gitLabRepoResult.json();

      //loops through the array of repository objects and adds an array of commits to each repository object
      for (let i = 0; i < gitLabRepoRes.length; i++){
        const commitFetchRes = await fetch("https://gitlab.com/api/v4/projects/" + gitLabRepoRes[i].id + "/repository/commits?per_page=5") ;
        const commitRes = await commitFetchRes.json();
        
        let repo = gitLabRepoRes[i];
        repo["fiveCommits"] = commitRes;
        gitLabRepoRes[i] = repo;
      };

    res.json({gitLabRepoRes})  
})

//used for testing
app.get('/repoGitlabTest', async (req, res)=>{
  const id = 796;
  const gitLabRepoResult = await fetch("https://gitlab.com/api/v4/users/" + id + "/projects")
  const gitLabRepoRes = await gitLabRepoResult.json();

    //loops through the array of repository objects and adds an array of commits to each repository object
    for (let i = 0; i < gitLabRepoRes.length; i++){
      const commitFetchRes = await fetch("https://gitlab.com/api/v4/projects/" + gitLabRepoRes[i].id + "/repository/commits?per_page=5") ;
      const commitRes = await commitFetchRes.json();
      
      let repo = gitLabRepoRes[i];
      repo["fiveCommits"] = commitRes;
      gitLabRepoRes[i] = repo;
    };

  res.json({gitLabRepoRes})  
})

app.listen(port, ()=>console.log('Listening engaged'))
