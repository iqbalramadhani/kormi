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
import { DropdownIcon } from '../../components/DropdownIcon';
import { NewsServices } from '../../services';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import * as _ from 'lodash';
import Select from 'react-select';
import { useSelector, shallowEqual } from 'react-redux';
require('moment/locale/id.js');

require('moment/locale/id.js');

export function CommentNewsList(props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);
  const [event, setEvent] = useState([]);
  const [cities, setCities] = useState([]);
  const [parent, setParent] = useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const [selSatu, setSelSatu] = useState('');
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const getData = async () => {
    let { data, error } = await NewsServices.comments(props.match.params.id);

    console.log(data);
    if (data) {
      setData(data.data);
      setTotalData(data.total);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, filter, sort]);

  const columns = [
    {
      dataField: 'user.name',
      text: 'Nama',
    },

    {
      dataField: 'description',
      text: ' ISI KOMENTAR',
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

  const clearFilter = () => {
    setPage(1);
    setFilter({});
    // console.log(filter)
  };

  // console.log(filter.city)

  return (
    <Card>
      <CardHeader title='Komentar News'>
        <CardHeaderToolbar>
          {Object.keys(filter).length > 0 && (
            <button type='submit' className='btn btn-danger' onClick={clearFilter}>
              Hapus Filter
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className='row'>
          <div className='col-md-7'>
            {/* <div className='row'>
              <div className='col-md-2'>
                
              </div>
              <div className={roleId == 0 ? 'col-md-3' : 'col-md-4'}>
                <Select
                  name='acara'
                  options={event}
                  onChange={(e) => {
                    setCategory(e, filter);
                  }}
                  value={getSelected(event, filter.category)}
                  placeholder='Kategori'
                />
              </div>
              {roleId == 0 && (
                <div className='col-md-4'>
                  <Select
                    name='penyelenggara'
                    options={parent}
                    onChange={(e) => setParents(e, filter)}
                    value={getSelected(parent, filter.parents)}
                    placeholder='Penyelenggara'
                  />
                </div>
              )}
              <div className={roleId == 0 ? 'col-md-3' : 'col-md-4'}>
                <Select
                  name='wilayah'
                  options={cities}
                  onChange={(e) => setCity(e, filter)}
                  value={getSelected(cities, filter.city)}
                  placeholder='Wilayah'
                />
              </div>
            </div> */}
          </div>
          <div className='col-md-5'>
            {/* <div className="row">
                <div className="col-md-7 ml-3">
                  <InputSearch placeholder="Acara" onSearch={handleFilterChange} />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-unggah"
                    onClick={handleExport}
                    >
                    Unduh
                  </button>
                </div>
                <div className="col-md-2">
                  <Link className="btn btn-primary" to="/event/create">
                    Tambah
                  </Link>
                </div>
              </div> */}
            {/* <div className='d-flex mb-6 float-right'>
              <InputSearch placeholder='Nama Acara' onSearch={handleFilterChange} />
              <button
                type='button'
                className='btn btn-unggah mx-2'
                onClick={handleExport}
                style={{ height: 'max-content' }}>
                Unduh
              </button>
              <Link className='btn btn-primary' to='/event/create' style={{ height: 'max-content' }}>
                Tambah
              </Link>
            </div> */}
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
                  bordered={false}
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
                          // console.log(sizePerPage)
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

export default CommentNewsList;
