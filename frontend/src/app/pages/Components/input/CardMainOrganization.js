import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import InputMainOrganization from './InputMainOrganization'

function CardMainOrganization(props) {
    return (
    <Card>
      <CardHeader title="Tambah Induk Organisasi">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <InputMainOrganization />
      </CardBody>
    </Card>
    )
}

export default CardMainOrganization
