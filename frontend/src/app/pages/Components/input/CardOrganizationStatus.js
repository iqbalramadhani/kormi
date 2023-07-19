import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import InputOrganizationStatus from './InputOrganizationStatus'

function CardOrganizationStatus(props) {
    return (
    <Card>
      <CardHeader title="Tambah Status Organisasi">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <InputOrganizationStatus />
      </CardBody>
    </Card>
    )
}

export default CardOrganizationStatus
