import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls'
import TableEvent from './TableEvent'
import { Dropdown } from 'react-bootstrap'

function CardTableEvent(props) {
    return (
    <Card>
      <CardHeader title="Acara">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className='row'>
          <div className='col-md-6'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Pilih Aksi
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div>
          <div className='col-md-6'>
          <div className='d-flex mb-6 float-right'>
            <div className='mr-5 border border-dark rounded'>
                <input placeholder='Pencarian' style={{width: '191px'}} className='border-0 py-1 px-2' type="text" name="search" id="search"/>
                <button className='btn'><i className="fa fa-search"></i></button>
                </div>

                <button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={() => alert('Produk Baru Telah Dibuat')}
                  >
                  Import
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => alert('Produk Baru Telah Dibuat')}
                  >
                  Tambah
                </button>
            </div>
          </div>
        </div>
        <TableEvent />
      </CardBody>
    </Card>
    )
}

export default CardTableEvent
