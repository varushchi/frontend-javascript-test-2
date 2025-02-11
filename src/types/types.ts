export default interface APIRes{
  id: number,
  name: string,
  created_at: string,
  updated_at: string
  html_url: string,
  stargazers_count: number,
  description: string | null

}