import { IResponseListProjects } from '@/@types/project'
import { AdminContext } from '@/contexts/AdminContext'
import { useDeleteProject } from '@/hooks/projects/deleteProject'
import { useListProjects } from '@/hooks/projects/listProjects'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6'

export function useDashboardHook() {
  const [projects, setProjects] = useState<IResponseListProjects[]>([])
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key:
      | keyof IResponseListProjects['project']
      | keyof IResponseListProjects['client']
    direction: 'ascending' | 'descending' | null
  } | null>(null)

  const {
    data: dataListProjects,
    isLoading: isLoadingListProjects,
    error: errorListProjects,
    isFetching: isFetchingListProjects,
    refetch: refetchListProjects,
  } = useListProjects()

  const {
    mutateAsync: mutateDeleteProject,
    isPending: isPendingDeleteProject,
    variables: variablesDeleteProject,
  } = useDeleteProject()

  async function handleDeleteProject(id: number) {
    await mutateDeleteProject(id)
  }

  const router = useRouter()

  const { setTitleHeader } = useContext(AdminContext)

  useEffect(() => {
    setTitleHeader('Painel do Administrador')
  }, [setTitleHeader])

  useEffect(() => {
    if (dataListProjects) {
      setProjects(dataListProjects)
    }
  }, [dataListProjects])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const filteredProjects = projects
    ? projects.filter(
        (project: IResponseListProjects) =>
          project.client.name.toLowerCase().includes(search.toLowerCase()) ||
          project.project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.project.key?.toLowerCase().includes(search.toLowerCase()),
      )
    : []

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortConfig !== null) {
      const aKey =
        sortConfig.key === 'name' || sortConfig.key === 'key'
          ? a.project[sortConfig.key]
          : a.client[sortConfig.key as keyof IResponseListProjects['client']]
      const bKey =
        sortConfig.key === 'name' || sortConfig.key === 'key'
          ? b.project[sortConfig.key]
          : b.client[sortConfig.key as keyof IResponseListProjects['client']]
      if (aKey && bKey && aKey < bKey) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aKey && bKey && aKey > bKey) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
    }
    return 0
  })

  const requestSort = (
    key:
      | keyof IResponseListProjects['project']
      | keyof IResponseListProjects['client'],
  ) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (
    key:
      | keyof IResponseListProjects['project']
      | keyof IResponseListProjects['client'],
  ) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    if (sortConfig.direction === 'ascending') {
      return <FaArrowUp className="inline ml-1" />
    }
    return <FaArrowDown className="inline ml-1" />
  }

  return {
    search,
    handleSearch,
    requestSort,
    getSortIcon,
    refetchListProjects,
    handleDeleteProject,
    isPendingDeleteProject,
    variablesDeleteProject,
    isFetchingListProjects,
    isLoadingListProjects,
    errorListProjects,
    router,
    sortedProjects,
  }
}
