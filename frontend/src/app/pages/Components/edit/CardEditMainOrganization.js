import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import EditMainOrganization from './EditMainOrganization'

function CardEditMainOrganization(props) {
    return (
    <Card>
      <CardHeader title="Edit Induk Organisasi">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <EditMainOrganization />
      </CardBody>
    </Card>
    )
}

export default CardEditMainOrganization
