import React, {useEffect, useState} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider, PaginationTotalStandalone, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator'
import ShowAlert from '../../libs/ShowAlert'
import { OrganizationStatusService } from '../../services';
import constants from "../../libs/constants";
import { Link } from 'react-router-dom'

function TableOrganizationStatus() {

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [filter, setFilter] = React.useState({});
    const [sort, setSort] = React.useState({});
    const [selectedRowId, setSelectedRowId] = React.useState([]);

    const [totalData, setTotalData] = useState(0);
    const [dataList, setData] = React.useState([]);

    const getData = async () => {
        let { data, error } = await OrganizationStatusService.browse({
          page,
        });
        if (data) {
          setData(data.data);
          if (totalData === 0) setTotalData(data.total);
        }
        if (error) {
            if (error.message) ShowAlert.failed(error.message);
        }
      };

      useEffect(() => {
          getData();
      }, [page, rowsPerPage, filter, sort])

    const handleDelete = async (id) => {
        ShowAlert.confirm().then(async (result) => {
            if (result.value) {
                let { data, error } = await OrganizationStatusService.delete(null, null, id)
                if (data) {
                    getData();
                }
                if (error) {
                    ShowAlert.failed(error.message)
                }
            }
        });
    };

    const selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
          let selected = [...selectedRowId]
          if (isSelect) {
            selected.push(row.id)
          } else {
            const index = selected.indexOf(row.id)
            selected.splice(index, 1)
          }
          setSelectedRowId(selected)
        },
        onSelectAll: (isSelect, rows, e) => {
          let selected = [...selectedRowId]
          if (isSelect) {
            selected = rows.map((row) => row.id)
          } else {
            selected = []
          }
          setSelectedRowId(selected)
        }
    };

    const actionFormatter = (cell, row) => {
        return (
            <div className='d-flex'>
                <span className='icon-button' onClick={() => console.log(row.id)}><i className='fas fa-cog'></i></span>
                <Link to={`/edit/status-organization?id=${row.id}`}>
                    <i className="far fa-edit mx-3"></i>
                </Link>
                <span onClick={() => {
                    handleDelete(row.id)
                }} className='icon-button'><i className='far fa-trash-alt'></i></span>
            </div>
        )
    }

    const handlePageChange = (index) => {
        console.log(index)
    }
    
    const columns = [{
        dataField: 'title',
        text: 'Title'
    },
    {
        dataField: 'description',
        text: 'Deskripsi',
    },
    {
        dataField: 'action',
        text: 'Action',
        formatter: actionFormatter
    },
    ];

      const paginateOption = {
        page,
        sizePerPage: constants.defaultPageSize,
        custom: true,
        totalSize: totalData,
        sizePerPageList: constants.pageSizeList,
      };

    return (
        <>
            <PaginationProvider pagination={ paginationFactory(paginateOption) } >
            {
                ({ paginationProps, paginationTableProps }) => {
                    return (
                        <div>
                            <BootstrapTable remote bootstrap4 keyField='id' data={dataList} columns={columns} selectRow={selectRow} {...paginationTableProps} />
                            <div className='row align-items-center mt-5'>
                                <div className='col-md-6'>
                                    <PaginationTotalStandalone { ...paginationProps }/>
                                </div>
                                <div className='col-md-6'>
                                    <div className='d-flex float-right'>
                                        <SizePerPageDropdownStandalone className='mr-5' {...paginationProps} />
                                        <PaginationListStandalone { ...paginationProps }  onPageChange={(e) => {
                                            handlePageChange(e)
                                        }} />
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

export default TableOrganizationStatus
