import { useState, useEffect, useRef } from 'react'
import { Octokit } from "octokit"
import { OctokitResponse, ReposGetResponseData } from "@octokit/types";
import { debounce } from 'lodash';

import Card from './components/Card';
import APIRes from './types/types';

function App() {

  const [inputValue, setInputValue] = useState('')
  const [repos, setRepos] = useState<APIRes[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const observerRef = useRef<HTMLDivElement | null>(null)

  async function getRepos(abortController: AbortController) {
    setLoading(true)
    setErrorMsg('')
    try{
      const octokit = new Octokit({
        auth: import.meta.env.VITE_GITHUB_TOKEN
      })
      const res: OctokitResponse<ReposGetResponseData[], number> = await octokit.request(`GET /users/{username}/repos?sort=updated&per_page=20&page=${page}`, {
        username: inputValue,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        signal: abortController.signal,
      })
      if (res.status !== 200){
        console.log('sdfsdfsdfhsdjkfhsdf')
        throw new Error(`fetch error: ${res.status}`)
      }
      const data = res.data
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setRepos((prev) => [...prev, ...data])
    }
    catch(error){
      console.error(error)
      setErrorMsg(String(error))
      setHasMore(false)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setRepos([])
    const abortController = new AbortController()
    const debouncedGetRepos = debounce(() => getRepos(abortController), 500)
    inputValue.length > 0 && debouncedGetRepos()
    return () => {
      abortController.abort()
      debouncedGetRepos.cancel()
    }
  }, [inputValue])

  useEffect(() => {
    const abortController = new AbortController();
    const debouncedGetRepos = debounce(() => getRepos(abortController), 500)
    inputValue.length > 0 && debouncedGetRepos()
    return () => {
      abortController.abort()
      debouncedGetRepos.cancel()
    }
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [loading])

  return (
    <div className='w-4/5 max-w-[900px] mx-auto mt-[30px]'>
      <form className='w-full mb-[30px] mx-auto'>
        <input className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' placeholder='search by username' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      </form>
      <div className='flex flex-col gap-[15px]'>
        {!errorMsg && repos.length > 0 ? (
          repos.map(elem => (
            <Card
              key={elem.id}
              id={elem.id}
              name={elem.name}
              created_at={elem.created_at}
              updated_at={elem.updated_at}
              html_url={elem.html_url}
              stargazers_count={elem.stargazers_count}
              description={elem.description}
            />
          ))
        ) : !loading && !errorMsg && (
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6">
            <p className="text-xl font-semibold text-gray-800 break-words w-fit mx-auto">No repos found</p>
          </div>
        )}
        
        {errorMsg && (
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6">
            <p className="text-xl font-semibold text-red-500 break-words w-fit mx-auto">{errorMsg}</p>
          </div>
        )}
        
        <div ref={observerRef}></div>
        
        {loading && (
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6">
            <p className="text-xl font-semibold text-gray-800 break-words w-fit mx-auto">Loading...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
