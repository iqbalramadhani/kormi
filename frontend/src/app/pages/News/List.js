/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { NewsServices, MasterServices, ParentOrganizationServices } from '../../services';
import { DropdownIcon } from '../../components/DropdownIcon';
import ShowToast from '../../libs/ShowToast';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import SVG from 'react-inlinesvg';
import moment from 'moment';
import Select from 'react-select';
import * as _ from 'lodash';
import useStore from '../../../zustand/store';
import { useSelector, shallowEqual } from 'react-redux';
require('moment/locale/id.js');

export function NewsListPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);
  const [cities, setCities] = useState([]);
  const [parent, setParent] = useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const getData = async () => {
    let { data, error } = await NewsServices.browse({
      page,
      sort_key: sort.sort_key ? sort.sort_key : '',
      sort_condition: sort.sort_condition ? sort.sort_condition : '',
      search: filter.search ? filter.search : '',
      status: filter.status ? filter.status : '',
      wilayah: filter.city ? filter.city : '',
      organitation_parent_id: filter.parents ? filter.parents : '',
      limit: rowsPerPage,
    });
    if (data) {
      setData(data.record.data);
      setTotalData(data.record.total);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  const getDataCities = async (search = '') => {
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : '',
    });
    if (data) {
      let cities = data.map((city) => {
        return { value: city.id, label: city.name };
      });
      let allCities = {
        value: 1,
        label: 'Semua Kab/Kota',
      };
      cities.unshift(allCities);
      setCities(cities);
    }
  };

  const getParent = async (search = '') => {
    let { data, error } = await ParentOrganizationServices.browse({
      search: search ? search : '',
    });
    if (data) {
      let dataParent = data.data;
      let parents = dataParent.map((parent) => {
        return { value: parent.id, label: parent.parent_name };
      });
      let allPerents = {
        value: 0,
        label: 'Semua Induk',
      };
      parents.unshift(allPerents);
      setParent(parents);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
    getDataCities();
    getParent();
  }, [page, rowsPerPage, filter, sort]);

  const handleDelete = async (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await NewsServices.delete(id);
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

  const handlePublish = async (id, status) => {
    let { data, error } = await NewsServices.publish(id, {
      is_publish: status,
    });
    if (data) {
      getData();
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
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
                <span className='btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
                  <SVG title=' ' src={toAbsoluteUrl('/media/svg/icons/General/Settings-1.svg')}></SVG>
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropdown-menu dropdown-menu-sm dropdown-menu-right'>
                <ul className='navi navi-hover py-5'>
                  {row.is_publish === 1 ? (
                    <li className='navi-item'>
                      <a
                        href='#'
                        className='navi-link'
                        onClick={(e) => {
                          e.preventDefault();
                          handlePublish(row.id, 0);
                        }}>
                        <span className='navi-icon'>
                          <i className='fa fa-download'></i>
                        </span>
                        <span className='navi-text'>Draft</span>
                      </a>
                    </li>
                  ) : (
                    <li className='navi-item'>
                      <a
                        href='#'
                        className='navi-link'
                        onClick={(e) => {
                          e.preventDefault();
                          handlePublish(row.id, 1);
                        }}>
                        <span className='navi-icon'>
                          <i className='fa fa-upload'></i>
                        </span>
                        <span className='navi-text'>Publikasi</span>
                      </a>
                    </li>
                  )}
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Link
            to={`/news/${row.id}/update`}
            className='btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <SVG title=' ' src={toAbsoluteUrl('/media/svg/icons/Communication/Write.svg')}></SVG>
          </Link>
          <span
            onClick={() => {
              handleDelete(row.id);
            }}
            className='btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <SVG title=' ' src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')}></SVG>
          </span>
        </div>
      );
    }
  };

  const statusFormatter = (cell, row) => {
    if (cell === 1) {
      return <span className={`label label-lg label-success label-inline`}>Terpublikasi</span>;
    } else {
      return <span className={`label label-lg label-secondary label-inline`}>Draft</span>;
    }
  };

  const datetimeFormatter = (cell, row) => {
    return row.publish_time ? moment(row.publish_time).format('DD-MM-YYYY, HH:mm:ss') : '';
  };

  const cityFormatter = (cell, row) => {
    if (row.location) return row.location_name;
  };

  const commentsFormatter = (cell, row) => {
    if (row.comments_count > 0) {
      return (
        <Link to={`/news/comments/${row.id}`} className='btn btn-success btn-sm cursor-pointer'>
          {row.comments_count}
        </Link>
      );
    }

    return row.comments_count;
  };
  const indukAdmin = {
    dataField: 'organitation_parent.parent_name',
    text: 'Induk',
  };

  const columns = [
    {
      dataField: 'title',
      text: 'Judul Berita',
    },
    {
      dataField: 'location',
      text: 'Wilayah',
      formatter: cityFormatter,
    },
    {
      dataField: 'tags',
      text: 'Tags',
    },
    {
      dataField: 'likes_count',
      text: 'Jumlah Like',
    },
    {
      dataField: 'comments_count',
      text: 'Jumlah Komentar',
      formatter: commentsFormatter,
    },
    {
      dataField: 'author',
      text: 'Penulis',
    },
    {
      dataField: 'publish_time',
      text: 'Waktu',
      formatter: datetimeFormatter,
    },
    {
      dataField: 'is_publish',
      text: 'Status',
      formatter: statusFormatter,
    },
    {
      dataField: 'action',
      text: 'Aksi',
      formatter: actionFormatter,
    },
  ];

  if (roleId == 0) {
    columns.splice(1, 0, indukAdmin);
  }

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
          let { data, error } = await NewsServices.delete(id);
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

  const setStatus = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.status = e.value;
    setFilter(newFilter);
  };

  const setCity = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.city = e.value > 1 ? e.value.toString() : '';
    setFilter(newFilter);
  };

  const setParents = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.parents = e.value > 0 ? e.value.toString() : '';
    setFilter(newFilter);
  };

  const clearFilter = () => {
    setPage(1);
    setFilter({});
    // console.log(filter)
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, function(o) {
      return o.value == selectedValue;
    });
    return index !== -1 ? list[index] : null;
  };

  // console.log(filter.induk)

  const handleExport = async () => {
    const { data } = await NewsServices.export();
    if (data) {
      window.open(data.file, '_blank');
    }
  };

  const optionsStatus = [
    { value: '', label: 'Semua' },
    { value: 'publish', label: 'Terpublikasi' },
    { value: 'unpublish', label: 'Draft' },
  ];
  return (
    <Card>
      <CardHeader title='Berita'>
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
          <div className='col-md-6'>
            <div className='row'>
              <div className='col-md-2 mr-6'>
                <Dropdown>
                  <Dropdown.Toggle variant='success' id='dropdown-basic'>
                    Pilih Aksi
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleBulkDelete()}>Hapus Sekaligus</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {roleId == 0 && (
                <div className='col-md-3'>
                  <Select
                    name='induk'
                    options={parent}
                    onChange={(e) => setParents(e, filter)}
                    value={getSelected(parent, filter.parents)}
                    placeholder='Induk'
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
              <div className={roleId == 0 ? 'col-md-3' : 'col-md-4'}>
                <Select
                  name='status'
                  options={optionsStatus}
                  onChange={(e) => setStatus(e, filter)}
                  value={getSelected(optionsStatus, filter.status)}
                  placeholder='Status'
                />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='d-flex mb-6 float-right'>
              <InputSearch placeholder='Judul Berita' onSearch={handleFilterChange} />
              <button
                type='button'
                className='btn btn-unggah mx-4'
                onClick={handleExport}
                style={{ height: 'max-content' }}>
                Unduh
              </button>
              <Link className='btn btn-primary' to='/news/create' style={{ height: 'max-content' }}>
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

export default NewsListPage;
