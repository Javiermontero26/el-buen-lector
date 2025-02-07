import React from 'react'
import PopularBooks from '../GraficosEstadisticos/PopularBooks'
import StockChart from '../GraficosEstadisticos/StockChart'
import Tarjetas from '../GraficosEstadisticos/Tarjetas'

const Dasboard = () => {
  return (
    <div>
        <h1 className='text-center text-dark m-3'>BIENVENIDO A "EL BUEN LECTOR"</h1>
        <Tarjetas />
        {/* <PopularBooks/> */}
        {/*  <StockChart /> */}
    </div>
  )
}

export default Dasboard
