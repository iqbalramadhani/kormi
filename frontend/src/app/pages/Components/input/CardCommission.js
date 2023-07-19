import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import InputCommission from './InputCommission'

function CardCommission(props) {
    return (
    <Card>
      <CardHeader title="Tambah Penggurus">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <InputCommission />
      </CardBody>
    </Card>
    )
}

export default CardCommission
