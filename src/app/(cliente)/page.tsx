'use client'

import { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowForward } from 'react-icons/io'

export default function Home() {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    toast.error('Funcionalidade em desenvolvimento')
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[calc(100vh-203.83px)] lg:min-h-[calc(100vh-227.83px)]">
      <div className="w-full max-w-screen-xl flex flex-col items-center gap-12 px-4 xl:px-0">
        <h3 className="w-full md:w-[60%] bg-primary text-secondary font-medium text-xl p-2 text-center rounded-md">
          Consulte seu pedido
        </h3>
        <form className="flex flex-col items-center gap-8">
          <h4 className="text-lg">Chave de acesso</h4>
          <input
            placeholder="Digite sua chave"
            className="p-2 text-lg rounded-xl border-2 border-black w-full md:w-fit text-center"
          />
          <button
            type="submit"
            className="bg-secondary flex gap-1 items-center text-white py-2 px-8 rounded-xl hover:bg-primary duration-300"
            onClick={handleSubmit}
          >
            Procurar
            <IoIosArrowForward size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}