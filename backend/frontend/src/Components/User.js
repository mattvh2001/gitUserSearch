import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import './User.css';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
        error: null,
        userSearch: 'User',
        userResults: {},
        gitHubRepoResults: {},
        gitLabRepoResults: {},
        isUserFetched: false,
        isGitHubRepoFetched: false,
        isGitLabRepoFetched:false,
        }
    }
    //Updates the usersearch state
    handleChange =(event) =>{
        this.setState({userSearch: event.target.value});
    }
    
    //fetches the user information from github and gitlab upon submission of the form
    handleSubmit = (e) =>{
        e.preventDefault();
          let stringUrl = "/search/" + this.state.userSearch;
        fetch(stringUrl)
        .then(res => res.json())
        .then(
            (result) => {           
                this.setState({userResults: result,
                    isUserFetched: true,
                    isGitHubRepoFetched: false,
                    isGitLabRepoFetched:false,
                }); 
                  
            },
            // Note: it's important to handle errors here instead of a catch()
            // we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({isUserFetched: true,
                    isGitHubRepoFetched: false,
                    isGitLabRepoFetched:false,})
                console.log(error);
            });
        
      }

      //fetches repository data upon clicking event of the github Repos heading
    handleClickGitHubRepo = (e) =>{
        e.preventDefault();
        
        let url = "/repo/github/" + this.state.userResults.hubItems.login;
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {   
                this.setState({
                    gitHubRepoResults: result,
                    isGitHubRepoFetched: true
                });      
            },
            // Note: it's important to handle errors here instead of a catch()
            // we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({isUserFetched: true})
                console.log(error);
            });
            
      }
      //fetches repository data upon clicking event of the gitlab Repos heading
      handleClickGitLabRepo = (e) =>{
        e.preventDefault();

        let url = "/repo/gitlab/" + this.state.userResults.labItems.id;
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {   
                this.setState({
                    gitLabRepoResults: result,
                    isGitLabRepoFetched: true
                });      
            },
            // Note: it's important to handle errors here instead of a catch()
            // we don't swallow exceptions from actual bugs in components.
            (error) => {
                this.setState({isUserFetched: true})
                console.log(error);
            });         
      }

    render() {
        let gitLabUser;
        let gitHubUser;

        let gitHubRepos;
        let gitLabRepos;
        if(this.state.isGitHubRepoFetched){
            if(!(this.state.gitHubRepoResults.hasOwnProperty('message'))){
                
                const listHubItems = this.state.gitHubRepoResults.gitHubRepoRes.map((repo) =>{
                    //checks if there is an array contained within fiveCommits(If there are no commits an object is returned)
                    if (Array.isArray(repo.fiveCommits)){
                        //returns a list of the current Repository's details including a list of 5 commits
                        return(
                        <ul>
                            <li>Name: {repo.name}</li>
                            <li>Description: {repo.description}</li>
                            <li>Creation Date: {repo.created_at}</li>
                           
                            <li>{repo.fiveCommits.map((object1) =>
                                <ul>
                                    <li>Message: {object1.commit.message}</li>
                                    <li>Commit Date: {object1.commit.author.date}</li>
                                </ul>)}</li>
                        </ul>)
                    }
                    else{
                        //returns a list of the current Repository's details excluding a list of 5 commits
                        return(
                            <ul>
                                <li>Name: {repo.name}</li>
                                <li>Description: {repo.description}</li>
                                <li>Creation Date: {repo.created_at}</li>
                            </ul>)          
                    }
                })

                gitHubRepos =(
                <div>
                    <h2>Github Repos</h2>
                    {listHubItems}
                </div>)
            }
            else{
                gitLabUser = <h2>Github repos not found</h2>
            }
        }
           
        if(this.state.isGitLabRepoFetched){

            //checks if object was fetched successfully
            if(!(this.state.gitLabRepoResults.hasOwnProperty('message')) || this.state.gitLabRepoResults.length !== 0){
                
                const listLabItems = this.state.gitLabRepoResults.gitLabRepoRes.map((repo) =>{
                    //checks if there is an array contained within fiveCommits(If there are no commits an object is returned)
                    if (Array.isArray(repo.fiveCommits))
                    //returns a list of the current Repository's details including a list of 5 commits
                        return(
                        <ul>
                            <li>Name: {repo.name}</li>
                            <li>description: {repo.description}</li>
                            <li>Creation Date: {repo.created_at}</li>
                            <li>Commits: {repo.fiveCommits.map((commit) =>
                                <ul>
                                    <li>Message: {commit.message}</li>
                                    <li>Commit date: {commit.committed_date}</li>
                                </ul>)}</li>
                        </ul>)
                    else{
                        return(
                            //returns a list of the current Repository's details excluding a list of 5 commits
                            <ul>
                                <li>Name: {repo.name}</li>
                                <li>Description: {repo.description}</li>
                                <li>Created: {repo.created_at}</li>                           
                            </ul>)          
                    }
                })
                
            gitLabRepos = (
                <div>
                    <h2>Gitlab Repos</h2>
                    {listLabItems}
                </div>)
            }else{
                gitLabUser = <h2>GitLab repos not found</h2>
            }
        }
        
        if(this.state.isUserFetched){
            //checks if object was fetched successfully
            if(!(this.state.userResults.hubItems.hasOwnProperty('message'))){
               
            gitHubUser = (
                <div>
                    <h1>User Details</h1>
                    <h2>Github User: {this.state.userResults.hubItems.login}</h2>
                    <h3>Name: {this.state.userResults.hubItems.name}</h3>
                    <h3>Location: {this.state.userResults.hubItems.location}</h3>
                    <h3>Company: {this.state.userResults.hubItems.company}</h3>
                    <h3>Email: {this.state.userResults.hubItems.email}</h3>
                    <h3>Hireable: {this.state.userResults.hubItems.hireable}</h3>
                    <h3><a href = {this.state.userResults.hubItems.avatar_url}>Profile picture url</a></h3>
                    <h2 className = "click"  onClick = {this.handleClickGitHubRepo}>Click here to show {this.state.userResults.hubItems.login}'s' Repos</h2>
                    {gitHubRepos}
                </div>)
            }else{
                gitHubUser = <h2>Github user not found</h2>
            }
            //checks if object was fetched successfully
            if(typeof this.state.userResults.labItems !== 'undefined' && this.state.userResults.labItems.length !== 0){
                gitLabUser = (
                <div>
                    <h2>GitLab User {this.state.userResults.labItems.username}</h2>
                    <h3>Name: {this.state.userResults.labItems.name}</h3>
                    <h3>User url: {this.state.userResults.labItems.login}</h3>
                    <h3>State: {this.state.userResults.labItems.state}</h3>
                    <h3><a href= {this.state.userResults.labItems.avatar_url}>Profile picture url</a></h3>
                    <h2 className = "click" onClick = {this.handleClickGitLabRepo}>Click here to show {this.state.userResults.labItems.username}'s Repos</h2>
                {gitLabRepos}
                
            </div>)
            }else{
                gitLabUser = <h2>GitLab user not found</h2>
            }
        }

        return (
            <div className = "smallcontainer">
                <div>
                    <h1>Repository user search</h1>
                </div>
                <form onSubmit = {this.handleSubmit}>
                    <label>User Search: </label>
                    <input type = 'text' value = {this.state.userSearch} onChange = {this.handleChange}/>
                    <input type = 'submit'/>
                </form>
                {gitHubUser}
                {gitLabUser}
            </div>
        );
    }
}

export default User;