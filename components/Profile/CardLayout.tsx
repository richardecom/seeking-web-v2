import React from 'react'
import { Card } from '../ui/card'

const CardLayout = ({cardTitle, children}) => {
  return (
    <Card>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">
          {cardTitle}
        </h3>
      </div>
      <div className="p-6 pt-0">
        {children}
      </div>
    </Card>
  )
}

export default CardLayout
