'use client'

import { FormEvent, useContext, useEffect, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { AdminContext } from '@/contexts/AdminContext'
import { Button } from '@/components/Button'
import { useRouter } from 'next/navigation'
import { ModalGeneric } from '@/components/Modal'
import { useListStatus } from '@/hooks/status/listStatus'
import { IResponseGetProject } from '@/@types/project'
import { DraggableItemComponent } from './stepItem'
import { addDays, format } from 'date-fns'
import { formatedProject, validateProject } from '../utils'
import { useCreateProject } from '@/hooks/projects/createProject'
import { ptBR } from 'date-fns/locale'

export default function CriarProjeto() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { mutateAsync: mutateCreateProject } = useCreateProject()
  const { data: dataListStatus } = useListStatus()

  const { setTitleHeader } = useContext(AdminContext)
  const [dataApiProject, setDataApiProject] = useState<IResponseGetProject>({
    project: {
      name: '',
      id: 0,
    },
    client: {
      name: '',
      email: '',
      id: 0,
    },
    timeline: [
      {
        ranking: {
          id: 0,
          rank: '1',
          last_update: format(addDays(new Date(), 1), 'yyyy-MM-dd', {
            locale: ptBR,
          }),
          note: 'waiting',
          description: '',
          condition: {
            id: 0,
            name: '',
          },
        },
      },
    ],
  })

  useEffect(() => {
    setTitleHeader('Criar projeto')
  }, [setTitleHeader, dataApiProject?.project.name])

  async function handleSubmitContact(e: FormEvent) {
    e.preventDefault()

    setIsSubmitting(true)
    if (!dataApiProject) {
      return
    }

    // Validações dos dados
    validateProject(dataApiProject)
    const formattedData = formatedProject(dataApiProject)

    // Cria o projeto
    await mutateCreateProject(formattedData)

    setIsSubmitting(false)
  }

  const removeStep = (index: number) => {
    setDataApiProject((prevSteps) => {
      const newSteps = prevSteps?.timeline.filter(
        (_, indexValue) => indexValue !== index,
      )
      return { ...prevSteps, timeline: newSteps } as IResponseGetProject
    })
  }

  const addStep = () => {
    const newStep = {
      condition: {
        id: 0,
        name: '',
      },
      ranking: {
        id: 0,
        rank: (dataApiProject?.timeline.length
          ? dataApiProject.timeline.length + 1
          : 0
        ).toString(),
        last_update: format(addDays(new Date(), 1), 'yyyy-MM-dd', {
          locale: ptBR,
        }),
        note: 'waiting',
        description: '',
      },
    }
    setDataApiProject((prevSteps) => {
      const newSteps = prevSteps?.timeline
        ? [...prevSteps?.timeline, newStep]
        : [newStep]
      return { ...prevSteps, timeline: newSteps } as IResponseGetProject
    })
  }

  const moveItemLeft = (index: number) => {
    if (index > 0) {
      const newTimeline = [...(dataApiProject?.timeline || [])]
      ;[newTimeline[index - 1], newTimeline[index]] = [
        newTimeline[index],
        newTimeline[index - 1],
      ]
      setDataApiProject(
        (prev) => ({ ...prev, timeline: newTimeline }) as IResponseGetProject,
      )
    }
  }

  const moveItemRight = (index: number) => {
    if (dataApiProject && index < dataApiProject.timeline.length - 1) {
      const newTimeline = [...dataApiProject.timeline]

      // Realiza a troca dos itens
      ;[newTimeline[index + 1], newTimeline[index]] = [
        newTimeline[index],
        newTimeline[index + 1],
      ]

      // Atualiza o estado com o novo array `newTimeline`
      setDataApiProject((prev) => {
        const updatedProject = {
          ...prev,
          timeline: newTimeline,
        } as IResponseGetProject
        return updatedProject
      })
    }
  }

  return (
    <section className="w-full flex justify-center items-center">
      <div className="w-full max-w-screen-xl px-4 xl:px-0 py-4 lg:py-20 flex justify-center">
        <form
          className="w-full flex flex-col gap-16 items-center"
          onSubmit={handleSubmitContact}
        >
          <div className="w-full flex flex-col gap-4 max-w-screen-md">
            <div className="text-center md:text-left flex flex-col gap-2">
              <label
                className="cursor-pointer font-bold text-xl"
                htmlFor="project_name"
              >
                Nome do projeto
              </label>
              <input
                type="text"
                id="project_name"
                value={dataApiProject?.project.name}
                onChange={(e) => {
                  setDataApiProject(
                    (prev) =>
                      ({
                        ...prev,
                        project: { ...prev?.project, name: e.target.value },
                      }) as IResponseGetProject,
                  )
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nome do projeto"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full text-center md:text-left flex flex-col gap-2">
                <label
                  className="cursor-pointer font-bold text-xl"
                  htmlFor="client_name"
                >
                  Nome do cliente
                </label>
                <input
                  type="text"
                  id="client_name"
                  value={dataApiProject?.client.name}
                  onChange={(e) => {
                    setDataApiProject(
                      (prev) =>
                        ({
                          ...prev,
                          client: { ...prev?.client, name: e.target.value },
                        }) as IResponseGetProject,
                    )
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="w-full text-center md:text-left flex flex-col gap-2">
                <label
                  className="cursor-pointer font-bold text-xl"
                  htmlFor="email"
                >
                  E-mail de notificação
                </label>
                <input
                  type="email"
                  id="client_email"
                  value={dataApiProject?.client.email}
                  onChange={(e) => {
                    setDataApiProject(
                      (prev) =>
                        ({
                          ...prev,
                          client: { ...prev?.client, email: e.target.value },
                        }) as IResponseGetProject,
                    )
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Email de notificação"
                />
              </div>
            </div>
          </div>
          <ul className="characters flex gap-8 md:gap-4 flex-wrap flex-row items-start w-full">
            <div className="hidden lg:flex flex-col gap-6 items-center md:items-start w-fit">
              <h3 className="text-2xl font-bold">Etapa</h3>
              <h3 className="text-2xl font-bold">Status</h3>
              <h3 className="text-2xl font-bold">Data</h3>
              <h3 className="text-2xl font-bold">Descrição</h3>
            </div>
            {dataApiProject?.timeline.map((step, index) => (
              <DraggableItemComponent
                key={index}
                step={step}
                setDataApiProject={setDataApiProject}
                dataApiProject={dataApiProject}
                dataListStatus={dataListStatus}
                index={index}
                moveLeft={() => moveItemLeft(index)}
                moveRight={() => moveItemRight(index)}
                removeStep={() => removeStep(index)}
              />
            ))}
            <AiOutlinePlusCircle
              size={35}
              className="cursor-pointer hover:scale-105 duration-300 w-full md:w-fit"
              onClick={addStep}
            />
          </ul>

          <div className="flex gap-4">
            <ModalGeneric
              button={<Button variant="secondary" title="Voltar" />}
              title="Voltar para a dashboard"
              description="Deseja realmente voltar para a dashboard? Todas as alterações não salvas serão perdidas."
              onConfirm={() => router.push('/admin/dashboard')}
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              title="Salvar"
            />
          </div>
        </form>
      </div>
    </section>
  )
}
