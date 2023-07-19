import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import EditCommission from './EditCommission'

function CardEditCommission(props) {
    return (
    <Card>
      <CardHeader title="Edit Komisi">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <EditCommission />
      </CardBody>
    </Card>
    )
}

export default CardEditCommission
