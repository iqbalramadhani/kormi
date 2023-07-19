import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import InputAdmin from './InputAdmin'

function CardAdmin(props) {
    return (
    <Card>
      <CardHeader title="Tambah Penggurus">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <InputAdmin />
      </CardBody>
    </Card>
    )
}

export default CardAdmin
