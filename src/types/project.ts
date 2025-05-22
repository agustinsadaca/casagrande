export type ProjectItem = {
  id: string
  imageHomeUrls?: string[]
  projectName?: string
  subtitle?: string
  imageDetailUrls?: string[]
  details: {
    project?: ProjectDetail
    area?: ProjectDetail
    ubication?: ProjectDetail
    material?: ProjectDetail
  }
}

type ProjectDetail = {
  title: string
  description: string | string[]
}