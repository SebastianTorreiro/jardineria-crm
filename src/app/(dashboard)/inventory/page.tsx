import { getTools, getSupplies } from './actions'
import InventoryClient from './InventoryClient'

export default async function InventoryPage() {
  // 1. Buscamos la data en el servidor antes de mandar nada al navegador
  const initialTools = await getTools()
  const initialSupplies = await getSupplies()

  // 2. Se la pasamos al componente de cliente que ya tenés armado
  return (
    <InventoryClient 
      initialTools={initialTools} 
      initialSupplies={initialSupplies} 
    />
  )
}