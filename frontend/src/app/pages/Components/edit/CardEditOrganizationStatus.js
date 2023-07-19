import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import EditOrganizationStatus from './EditOrganizationStatus'

function CardEditOrganizationStatus(props) {
    return (
    <Card>
      <CardHeader title="Edit Status Organisasi">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <EditOrganizationStatus />
      </CardBody>
    </Card>
    )
}

export default CardEditOrganizationStatus
