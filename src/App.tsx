import { useState, useEffect } from 'react'
import { Octokit } from "octokit"
import { OctokitResponse, ReposGetResponseData } from "@octokit/types";

import Card from './components/Card';
import APIRes from './types/types';

function App() {

  const [inputValue, setInputValue] = useState('')
  const [repos, setRepos] = useState<APIRes[]>([]);

  useEffect(() => {
    
    async function getRepos() {
      try{
        const octokit = new Octokit({
          auth: import.meta.env.GITHUB_TOKEN
        })
        const res: OctokitResponse<ReposGetResponseData[], number> = await octokit.request(`GET /users/{username}/repos`, {
          username: inputValue,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
        if (res.status !== 200){
          throw new Error(`fetch error: ${res.status}`)
        }
        const data = res.data
        setRepos(data)
      }
      catch(error){
        console.error(error)
      }
    }

    getRepos()


  }, [inputValue])


  console.log(repos)

  return (
    <div>
      <form className='w-fit mx-auto'>
        <input className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' placeholder='search by username' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      </form>
      <div>
        {repos.map(elem => {
          return(
            <Card
              id = {elem.id}
              name = {elem.name}
              created_at = {elem.created_at}
              updated_at = {elem.updated_at}
              html_url = {elem.html_url}
              stargazers_count = {elem.stargazers_count}
              description = {elem.description}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
