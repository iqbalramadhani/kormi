import React from 'react'
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls'
import TableCommission from './TableCommission'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { CommissionServices } from '../../services'
import ShowAlert from "../../libs/ShowAlert"

function CardTableCommission(props) {

  const [selectData, setSelectData] = React.useState([]);

  const handleSelectData = (arrData) => {
    console.log(arrData)
    setSelectData(arrData)
  }

  React.useEffect(() => {
    handleSelectData()
  }, [])

    return (
    <Card>
      <CardHeader title="Data Komisi">
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
              <Dropdown.Item onClick={ (e) => {
                  ShowAlert.confirm().then((result) => {
                    if (result.value) {
                      selectData.map( async (id) => {
                        let { data, error } = await CommissionServices.delete(null, null, id)
                      })
                    }
                  })
                  setTimeout(() => {
                    window.location.reload()
                  }, 4000)
                }}>Delete Selected</Dropdown.Item>
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
              <Link className="btn btn-success mr-2" to="/add/commission" >
                Tambah
              </Link>
            </div>
          </div>
        </div>
        <TableCommission handleSelectData={handleSelectData} />
      </CardBody>
    </Card>
    )
}

export default CardTableCommission
