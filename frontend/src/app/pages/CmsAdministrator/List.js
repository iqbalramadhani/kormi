import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from 'react-bootstrap-table2-paginator';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls';
import InputSearch from '../../components/InputSearch';
import constants from '../../libs/constants';
import ShowAlert from '../../libs/ShowAlert';
import ShowToast from '../../libs/ShowToast';
import { CmsAdministratorServices } from '../../services';
import { DropdownIcon } from '../../components/DropdownIcon';

export function CmsAdministratorListPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);

  const getData = async () => {
    let { data, error } = await CmsAdministratorServices.browse({
      page,
      sort_key: sort.sort_key ? sort.sort_key : '',
      sort_condition: sort.sort_condition ? sort.sort_condition : '',
      search: filter.search ? filter.search : '',
      limit: rowsPerPage,
    });
    if (data) {
      setData(data.result.data);
      setTotalData(data.result.total);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, filter, sort]);

  const handleDelete = async (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await CmsAdministratorServices.delete(id);
        if (data) {
          getData();
        }
        if (error) {
          if (error.message) ShowAlert.failed(error.message);
        }
      }
    });
  };

  const handleFilterChange = (changes) => {
    setPage(1);
    setFilter(changes);
  };

  const updateStatus = async (id, status) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await CmsAdministratorServices.updateStatus(id, {
          status: status,
        });
        if (data) {
          getData();
        }
        if (error) {
          if (error.message) ShowAlert.failed(error.message);
        }
      }
    });
  };

  // HANDLE DATA TABLE
  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className='d-flex'>
          <div className='d-flex justify-content-end'>
            <Dropdown className='dropdown dropdown-inline' alignRight>
              <Dropdown.Toggle
                className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'
                variant='transparent'
                id='dropdown-toggle-top-user-profile'
                as={DropdownIcon}>
                <i className='fas fa-cog'></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdown-menu dropdown-menu-sm dropdown-menu-right'>
                <ul className='navi navi-hover'>
                  {row.status == 1 && (
                    <li className='navi-item'>
                      <a
                        href='#'
                        className='navi-link'
                        onClick={(e) => {
                          e.preventDefault();
                          updateStatus(row.id, -1);
                        }}>
                        <span className='navi-icon'>
                          <i className='fa fa-download'></i>
                        </span>
                        <span className='navi-text'>Suspen</span>
                      </a>
                    </li>
                  )}
                  {row.status == -1 && (
                    <li className='navi-item'>
                      <a
                        href='#'
                        className='navi-link'
                        onClick={(e) => {
                          e.preventDefault();
                          updateStatus(row.id, 1);
                        }}>
                        <span className='navi-icon'>
                          <i className='fa fa-download'></i>
                        </span>
                        <span className='navi-text'>Aktif</span>
                      </a>
                    </li>
                  )}
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Link
            to={`/cms-administrator/${row.id}/detail`}
            className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <i className='far fa-eye mx-3'></i>
          </Link>
          <Link
            to={`/cms-administrator/${row.id}/update`}
            className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <i className='far fa-edit mx-3'></i>
          </Link>
          {row.status == -1 && (
            <span
              onClick={() => {
                handleDelete({ id: row.id });
              }}
              className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
              <i className='far fa-trash-alt'></i>
            </span>
          )}
        </div>
      );
    }
  };

  const regionFormatter = (cell, row) => {
    let region = '';
    if (row.city && row.city.name) region += row.city.name;
    if (row.city && row.city.name && row.province && row.province.name) region += ', ';
    if (row.province && row.province.name) region += row.province.name;
    return region;
  };

  const parentOrganizationFormatter = (cell, row) => {
    return row.organitation_parent?.parent_name;
  };

  const statusFormatter = (cell, row) => {
    let label_style = 'label-light';
    if (row.status == 1) label_style = 'label-light-warning';
    if (row.status == 0) label_style = 'label-light-success';
    if (row.status == 2) label_style = 'label-light-primary';
    return <span className={`label label-lg ${label_style} label-inline`}>{row.status_label}</span>;
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Nama',
    },
    {
      dataField: 'email',
      text: 'Email',
    },
    {
      dataField: 'province',
      text: 'Wilayah',
      formatter: regionFormatter,
    },
    {
      dataField: 'organitation_parent',
      text: 'Induk Olahraga',
      formatter: parentOrganizationFormatter,
    },
    {
      dataField: 'status_label',
      text: 'Status',
      formatter: statusFormatter,
    },
    {
      dataField: 'action',
      text: 'Aksi',
      formatter: actionFormatter,
    },
  ];

  const paginateOption = {
    page,
    sizePerPage: rowsPerPage,
    custom: true,
    totalSize: totalData,
    sizePerPageList: constants.pageSizeList,
  };

  // END HANDLE DATA TABLE

  const handlePageChange = (page) => {
    setPage(page);
  };

  const selectRow = {
    mode: 'checkbox',
    onSelect: (row, isSelect, rowIndex, e) => {
      let selected = [...selectedRowId];
      if (isSelect) {
        selected.push(row.id);
      } else {
        const index = selected.indexOf(row.id);
        selected.splice(index, 1);
      }
      setSelectedRowId(selected);
    },
    onSelectAll: (isSelect, rows, e) => {
      let selected = [...selectedRowId];
      if (isSelect) {
        selected = rows.map((row) => row.id);
      } else {
        selected = [];
      }
      setSelectedRowId(selected);
    },
  };

  const handleBulkDelete = async () => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        for (let index = 0; index < selectedRowId.length; index++) {
          const id = selectedRowId[index];
          let { data, error } = await CmsAdministratorServices.delete(id);
          if (data) {
            if (index < selectedRowId.length - 1) {
              continue;
            } else {
              getData();
            }
          }
          if (error) {
            if (error.message) ShowAlert.failed(error.message);
            break;
          }
        }
      }
    });
  };
  const handleExport = async () => {
    const { data } = await CmsAdministratorServices.export();
    if (data) {
      window.open(data.link_download, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader title='Data Admin'>
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className='row'>
          <div className='col-md-4'>
            <Dropdown>
              <Dropdown.Toggle variant='success' id='dropdown-basic'>
                Pilih Aksi
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleBulkDelete()}>Hapus Sekaligus</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='col-md-8'>
            <div className='d-flex mb-6 float-right'>
              <InputSearch onSearch={handleFilterChange} />
              <button
                type='button'
                className='btn btn-success mx-2'
                onClick={handleExport}
                style={{ height: 'max-content' }}>
                Export
              </button>
              <Link className='btn btn-success mr-2' to='/cms-administrator/create' style={{ height: 'max-content' }}>
                Tambah
              </Link>
            </div>
          </div>
        </div>
        <PaginationProvider pagination={paginationFactory(paginateOption)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <div>
                <BootstrapTable
                  keyField='id'
                  data={dataList}
                  columns={columns}
                  selectRow={selectRow}
                  remote={{ pagination: true, filter: false, sort: false }}
                  noDataIndication='Belum ada data'
                  {...paginationTableProps}
                />
                <div className='row align-items-center mt-5'>
                  <div className='col-md-6'>
                    <PaginationListStandalone
                      {...paginationProps}
                      onPageChange={(e) => {
                        handlePageChange(e);
                      }}
                    />
                  </div>
                  <div className='col-md-6'>
                    <div className='d-flex float-right'>
                      <SizePerPageDropdownStandalone
                        className='mr-5'
                        {...paginationProps}
                        onSizePerPageChange={(sizePerPage, page) => {
                          setRowsPerPage(sizePerPage);
                          setPage(1);
                        }}
                      />
                      <div className='my-auto'>
                        <PaginationTotalStandalone {...paginationProps} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </PaginationProvider>
      </CardBody>
    </Card>
  );
}

export default CmsAdministratorListPage;
