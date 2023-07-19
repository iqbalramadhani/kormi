import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider, PaginationTotalStandalone, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator'

const products = [
        {"id": 1, "name": "Emmanuel", "email": "tempus.mauris@mauris.org", "company": "Natoque Penatibus Et Corporation", "address": "339-5277 Quisque Street", "phone": "(199) 376-1182", "city": "Brussel"},
        {"id": 2, "name": "Channing", "email": "Vivamus.nibh@tellusjusto.net", "company": "Nec Metus Facilisis Foundation", "address": "Ap #495-9952 Dictum St.", "phone": "(777) 718-2333", "city": "Mont-de-Marsan"},
        {"id": 3, "name": "Isaiah", "email": "Nunc@Nuncacsem.org", "company": "Ante Ipsum Inc.", "address": "1376 Rutrum, Street", "phone": "(908) 881-1492", "city": "Meerle"},
        {"id": 4, "name": "Cyrus", "email": "malesuada.id.erat@risusDonec.org", "company": "Enim Etiam Company", "address": "P.O. Box 648, 8001 Quisque Rd.", "phone": "(856) 184-9281", "city": "Saint-Remy"},
        {"id": 5, "name": "Ray", "email": "Cras.pellentesque@ettristique.co.uk", "company": "Diam Eu Dolor Corp.", "address": "8951 Pede Rd.", "phone": "(139) 765-4384", "city": "Dumbarton"},
        {"id": 6, "name": "Lane", "email": "magna.Phasellus.dolor@lobortistellus.net", "company": "Nascetur Ridiculus Mus Industries", "address": "928-7175 Lorem Street", "phone": "(695) 697-8825", "city": "Whyalla"},
        {"id": 7, "name": "Perry", "email": "ipsum.dolor.sit@tempor.net", "company": "Ultricies Adipiscing Enim Consulting", "address": "Ap #124-2910 Vel, St.", "phone": "(361) 767-1464", "city": "Hall in Tirol"},
        {"id": 8, "name": "Driscoll", "email": "mauris.sagittis.placerat@tellusnon.co.uk", "company": "Auctor Mauris Inc.", "address": "8340 Eu Rd.", "phone": "(270) 964-1844", "city": "South Dum Dum"},
        {"id": 9, "name": "Ivan", "email": "eget@velnisl.ca", "company": "Eu Eros Nam Foundation", "address": "P.O. Box 763, 4429 Cras Street", "phone": "(387) 677-5944", "city": "Wekweti"},
        {"id": 10, "name": "August", "email": "nec.malesuada@ligula.com", "company": "Elementum PC", "address": "Ap #886-8052 Cras Street", "phone": "(941) 887-7455", "city": "LaSalle"},
        {"id": 11, "name": "Finn", "email": "Cras.sed@Phasellus.edu", "company": "Sociosqu Inc.", "address": "P.O. Box 581, 3890 A, Av.", "phone": "(428) 750-6870", "city": "Shimanovsk"},
        {"id": 12, "name": "Wesley", "email": "urna.Nullam@velesttempor.net", "company": "Odio Nam Interdum LLP", "address": "450-417 Quis, Road", "phone": "(866) 804-4976", "city": "Altach"},
        {"id": 13, "name": "Barclay", "email": "ut.pellentesque@fringillaest.com", "company": "Arcu Ltd", "address": "P.O. Box 134, 5768 Elit. Street", "phone": "(135) 119-8414", "city": "Enschede"},
];

function actionFormatter(cell, row) {
    return (
        <div className='d-flex'>
            <span><i className='fas fa-cog'></i></span>
            <span><i className='far fa-edit mx-3'></i></span>
            <span><i className='far fa-trash-alt'></i></span>
        </div>
    )
}

const columns = [{
    dataField: 'id',
    text: 'ID'
},
{
    dataField: 'name',
    text: 'Name',
},
{
    dataField: 'email',
    text: 'email',
},
{
    dataField: 'company',
    text: 'Company',
},
{
    dataField: 'address',
    text: 'Address',
},
{
    dataField: 'phone',
    text: 'Phone',
},
{
    dataField: 'city',
    text: 'City',
    style: {
        textAlign: 'center'
    }
},
{
    dataField: 'action',
    text: 'Action',
    formatter: actionFormatter
},
];

const sizePerPageList = [
    { text: "10", value: 10 },
    { text: "5", value: 5 },
    { text: "3", value: 3 },
  ];


function TableEvent() {
    const option = {
        custom: true,
        totalSize: products.length,
        sizePerPageList: sizePerPageList,
    }

    return (
        <>
            <PaginationProvider pagination={ paginationFactory(option) } >
            {
                ({ paginationProps, paginationTableProps }) => {
                    return (
                        <div>
                            <BootstrapTable keyField='id' data={products} columns={columns} selectRow={{ mode: 'checkbox' }} {...paginationTableProps} />
                            <div className='row align-items-center mt-5'>
                                <div className='col-md-6'>
                                    <PaginationTotalStandalone { ...paginationProps }/>
                                </div>
                                <div className='col-md-6'>
                                    <div className='d-flex float-right'>
                                        <SizePerPageDropdownStandalone className='mr-5' {...paginationProps} />
                                        <PaginationListStandalone { ...paginationProps }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            </PaginationProvider>
        </>
    )
}

export default TableEvent
