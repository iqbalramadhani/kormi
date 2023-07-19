import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls'
import TableHealt from './TableHealt'
import { Dropdown } from 'react-bootstrap'
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


function CardTableHealt(props) {
    return (
    <Card>
      <CardHeader title="Data Kesehatan">
          <CardHeaderToolbar>
            
          </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className='row'>
        <div className="col-md-4">
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
          <div className="col-md-5">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Append>
                <Button variant="outline-secondary">
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div className="col-md-3">
            <div className="d-flex mb-6 float-right">
              <button
                type="button"
                className="btn btn-success mr-2"
                onClick={() => alert("Produk Baru Telah Dibuat")}
              >
                Import
              </button>
              <Link className="btn btn-success mr-2" to="/news/create">
                Tambah
              </Link>
            </div>
          </div>
        </div>
        <TableHealt />
      </CardBody>
    </Card>
    )
}

export default CardTableHealt
