import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../../_metronic/_partials/controls'
import InputMember from './InputMember'

function CardInputMember(props) {
    return (
    <Card>
      <CardHeader title="Tambah Anggota">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
       <InputMember />
      </CardBody>
    </Card>
    )
}

export default CardInputMember
