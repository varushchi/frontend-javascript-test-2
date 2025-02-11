import React from 'react'
import APIRes from '../types/types'

export default function Card(props: APIRes) {

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate)
  
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
  }

  return (
    <div 
      id={String(props.id)} 
      className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <p className="text-xl font-semibold text-gray-800 break-words">{props.name}</p>
      {props.description && (
        <p className="text-gray-600 mt-2">{props.description}</p>
      )}
      <p className="text-blue-500 hover:text-blue-600 mt-2 break-words">
        <a href={props.html_url} target="_blank" rel="noopener noreferrer">
          {props.html_url}
        </a>
      </p>
      <p className="text-sm text-gray-500 mt-2">Last updated on <span className='font-medium'>{formatDate(props.updated_at)}</span></p>
      <p className="text-sm text-gray-500 mt-2">Stars: {props.stargazers_count}</p>
    </div>
  );
}