const assert = require('assert');
const fetch = require('isomorphic-fetch');

let expect = require('chai').expect;

describe('return github users', function() {
    it('check if username is a string', function(){
        
        fetch("/searchtest")
        .then(res => res.json())     
        .then((result) => {
            expect(result.hubItems.username).to.be.a("string");
            expect(result.labItems.username).to.be.a("string");
        }),
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
       console.log(error);
      }    
    });
})

describe('return gitlab repos', function() {
    it('checks if the name value is a string', function(){
        fetch("/repoGitlabTest")
        .then(res => res.json())     
        .then((result) => {
            expect(result[0].name).to.be.a("string");
        }),
      (error) => {
       console.log(error);
      }    
    });
})

describe('return github repos', function() {
    it('checks if the name value is a string', function(){    
        fetch("/repoGithubTest")
        .then(res => res.json())     
        .then((result) => {
            expect(result[0].name).to.be.a("string");
        }),
      (error) => {
       console.log(error);
      }    

    });
})