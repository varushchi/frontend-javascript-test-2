import React from 'react'
import APIRes from '../types/types'

export default function Card(props: APIRes) {
  return (
    <div id={String(props.id)}>
      <p>{props.name}</p>
      {props.description && <p>{props.description}</p>}
      <p>{props.html_url}</p>
      <p>{props.updated_at}</p>
      <p>{props.stargazers_count}</p>
    </div>
  )
}
