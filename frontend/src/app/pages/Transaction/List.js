import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from 'react-bootstrap-table2-paginator';
import { Dropdown, Tabs, Tab, Button, Col, Form, Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls';
import InputSearch from '../../components/InputSearch';
import constants from '../../libs/constants';
import ShowAlert from '../../libs/ShowAlert';
import { TransactionServices } from '../../services';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import SVG from 'react-inlinesvg';

export function TransactionListPage() {
  const [registerPage, setRegisterPage] = useState(1);
  const [registerRowsPerPage, setRegisterRowsPerPage] = useState(constants.defaultPageSize);
  const [registerFilter, setRegisterFilter] = React.useState({});
  const [registerSort, setRegisterSort] = React.useState({});
  const [registerTotalData, setRegisterTotalData] = useState(0);
  const [registerDataList, setRegisterData] = React.useState([]);
  const [startDateRegister, setStartDateRegister] = useState('');
  const [endDateRegister, setEndDateRegister] = useState('');

  const [eventPage, setEventPage] = useState(1);
  const [eventRowsPerPage, setEventRowsPerPage] = useState(constants.defaultPageSize);
  const [eventFilter, setEventFilter] = React.useState({});
  const [eventSort, setEventSort] = React.useState({});
  const [eventTotalData, setEventTotalData] = useState(0);
  const [eventDataList, setEventData] = React.useState([]);
  const [startDateEvent, setStartDateEvent] = useState('');
  const [endDateEvent, setEndDateEvent] = useState('');

  // const [showUser, setShowUser] = useState("");

  const getRegisterData = async () => {
    let { data, error } = await TransactionServices.registerList({
      page: registerPage,
      sort_key: registerSort.sort_key ? registerSort.sort_key : '',
      sort_condition: registerSort.sort_condition ? registerSort.sort_condition : '',
      search: registerFilter.search ? registerFilter.search : '',
      limit: registerRowsPerPage,
      start_date: startDateRegister,
      end_date: endDateRegister,
    });
    if (data) {
      if (data.data) {
        setRegisterData(data.data);
      }
      if (data.total) {
        setRegisterTotalData(data.total);
      }
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  const getEventData = async () => {
    let { data, error } = await TransactionServices.eventList({
      page: eventPage,
      sort_key: eventSort.sort_key ? eventSort.sort_key : '',
      sort_condition: eventSort.sort_condition ? eventSort.sort_condition : '',
      search: eventFilter.search ? eventFilter.search : '',
      limit: eventRowsPerPage,
      start_date: startDateEvent,
      end_date: endDateEvent,
    });
    if (data) {
      if (data.data) {
        setEventData(data.data);
      }
      if (data.total) {
        setEventTotalData(data.total);
      }
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getRegisterData();
  }, [registerPage, registerRowsPerPage, registerFilter, registerSort, startDateRegister, endDateRegister]);

  useEffect(() => {
    getEventData();
  }, [eventPage, eventRowsPerPage, eventFilter, eventSort, startDateEvent, endDateEvent]);

  const openLink = async (row) => {
    window.open(row.payment_link);
  };

  // const showUserTable = (row) => {
  //   setRegisterShowUser(row.invoice_id);
  // };

  const handleRegisterFilterChange = (changes) => {
    setRegisterPage(1);
    setRegisterFilter(changes);
  };

  const handleEventFilterChange = (changes) => {
    setEventPage(1);
    setEventFilter(changes);
  };

  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className='d-flex'>
          <Link
            to={`/transaction/${row.order_id}`}
            style={{ marginRight: '10px' }}
            className='btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <SVG title=' ' src={toAbsoluteUrl('/media/svg/icons/General/Settings-1.svg')}></SVG>
          </Link>
          {row.status === 'PENDING' && (
            <span
              onClick={() => {
                openLink(row);
              }}
              style={{ marginRight: '10px' }}
              className='btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
              <SVG title=' ' src={toAbsoluteUrl('/media/svg/icons/Communication/Write.svg')}></SVG>
            </span>
          )}
        </div>
      );
    }
  };

  const priceFormatter = (cell, row) => {
    return 'Rp ' + idCurrency(row.total_price);
  };

  const statusFormatter = (cell, row) => {
    let label_style, status_text;
    if (row.status == 'PAID') {
      label_style = 'label-paid';
      status_text = 'Berhasil';
    }
    if (row.status == 'PENDING') {
      label_style = 'label-pending';
      status_text = 'Menunggu';
    }
    if (row.status == 'UNPAID' || row.status == 'EXPIRED') {
      label_style = 'label-unpaid';
      status_text = 'Kadaluarsa';
    }
    return (
      <span className={`label label-lg ${label_style} label-inline`} style={{ height: 'max-content' }}>
        {status_text}
      </span>
    );
  };

  // const listUsers = (cell, row) => {
  //   if (row) {
  //     return (
  //       <div style={row.status != 'PENDING' ? {display:"none"}:null}>
  //         <a onClick={()=>{showUserTable(row)}}>{row.invoice_id == showUser ? null/*<>&#9650;</>*/ : <>&#9660;</>} {row.users.length} Anggota </a>
  //         {row.invoice_id == showUser ?
  //           <ul>
  //             {row.users ? row.users.map((u) => (
  //               <li>{u.name} : {u.email} {u.phone_number}</li>
  //             )): null}
  //           </ul> : null
  //         }
  //       </div>
  //     );
  //   }
  // };

  const idCurrency = (value) => {
    if (value !== null && value !== undefined) {
      return value.toLocaleString('id-ID');
    }
    return 0;
  };

  const columns = [
    {
      dataField: 'invoice_id',
      text: 'Nomor Tagihan',
    },
    {
      dataField: 'order_id',
      text: 'Nomor Order',
    },
    {
      dataField: 'total_price',
      text: 'Jumlah',
      formatter: priceFormatter,
    },
    {
      dataField: 'created_at',
      text: 'Tanggal Transaksi',
    },
    {
      dataField: 'expired',
      text: 'Tanggal Kadaluarsa',
    },
    // {
    //   dataField: "users",
    //   text: "Anggota",
    //   formatter: listUsers,
    // },
    {
      dataField: 'status',
      text: 'Status',
      formatter: statusFormatter,
    },
    {
      dataField: 'action',
      text: 'Detail Tagihan',
      formatter: actionFormatter,
    },
  ];

  const registerPaginateOption = {
    page: registerPage,
    sizePerPage: registerRowsPerPage,
    custom: true,
    totalSize: registerTotalData,
    sizePerPageList: constants.pageSizeList,
  };

  const eventPaginateOption = {
    page: eventPage,
    sizePerPage: eventRowsPerPage,
    custom: true,
    totalSize: eventTotalData,
    sizePerPageList: constants.pageSizeList,
  };

  // END HANDLE DATA TABLE

  const handleRegisterPageChange = (page) => {
    setRegisterPage(page);
  };

  const handleEventPageChange = (page) => {
    setEventPage(page);
  };

  const handleExportAnggota = async () => {
    const { data } = await TransactionServices.exportAnggota();
    if (data) {
      window.open(data.file, '_blank');
    }
  };

  const handleExportAcara = async () => {
    const { data } = await TransactionServices.exportAcara();
    if (data) {
      window.open(data.file, '_blank');
    }
  };

  return (
    <Tabs defaultActiveKey='register-payment' id='uncontrolled-tab-example'>
      <Tab eventKey='register-payment' title='Pendaftaran Anggota' style={{ padding: '20px' }}>
        <Card>
          <CardBody>
            <div className='row'>
              <div className='col-md-5'>
                <div className='d-flex datepickers-wrapper'>
                  <input
                    type='date'
                    max={endDateRegister ? endDateRegister : ''}
                    name='start_date_register'
                    id='start_date_register'
                    className='form-control'
                    value={startDateRegister}
                    onChange={(e) => setStartDateRegister(e.target.value)}
                  />
                  <span style={{ marginRight: '10px', marginLeft: '10px', lineHeight: '35px' }}>—</span>
                  <input
                    type='date'
                    min={startDateRegister ? startDateRegister : ''}
                    name='end_date_register'
                    id='end_date_register'
                    className='form-control'
                    value={endDateRegister}
                    onChange={(e) => setEndDateRegister(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-5 ml-auto'>
                <div className='d-flex mb-6 float-right'>
                  <InputSearch placeholder='Nomor Tagihan/Status' onSearch={handleRegisterFilterChange} />
                  <button
                    type='button'
                    className='btn btn-success mx-2'
                    onClick={handleExportAnggota}
                    style={{ height: 'max-content' }}>
                    Export
                  </button>
                </div>
              </div>
            </div>
            <PaginationProvider pagination={paginationFactory(registerPaginateOption)}>
              {({ paginationProps, paginationTableProps }) => {
                return (
                  <div>
                    <BootstrapTable
                      keyField='id'
                      data={registerDataList}
                      columns={columns}
                      remote={{ pagination: true, filter: false, sort: false }}
                      noDataIndication='Belum ada data'
                      {...paginationTableProps}
                    />
                    <div className='row align-items-center mt-5'>
                      <div className='col-md-6'>
                        <PaginationListStandalone
                          {...paginationProps}
                          onPageChange={(e) => {
                            handleRegisterPageChange(e);
                          }}
                        />
                      </div>
                      <div className='col-md-6'>
                        <div className='d-flex float-right'>
                          <SizePerPageDropdownStandalone
                            className='mr-5'
                            {...paginationProps}
                            onSizePerPageChange={(sizePerPage, page) => {
                              setRegisterRowsPerPage(sizePerPage);
                              setRegisterPage(1);
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
      </Tab>
      <Tab eventKey='event-payment' title='Pendaftaran Acara' style={{ padding: '20px' }}>
        <Card>
          <CardBody>
            <div className='row'>
              <div className='col-md-5'>
                <div className='d-flex datepickers-wrapper'>
                  <input
                    type='date'
                    max={endDateEvent ? endDateEvent : ''}
                    name='start_date_event'
                    id='start_date_event'
                    className='form-control'
                    value={startDateEvent}
                    onChange={(e) => setStartDateEvent(e.target.value)}
                  />
                  <span style={{ marginRight: '10px', marginLeft: '10px', lineHeight: '35px' }}>—</span>
                  <input
                    type='date'
                    min={startDateEvent ? startDateEvent : ''}
                    name='end_date_event'
                    id='end_date_event'
                    className='form-control'
                    value={endDateEvent}
                    onChange={(e) => setEndDateEvent(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-6 ml-auto'>
                <div className='d-flex mb-6 float-right'>
                  <InputSearch onSearch={handleEventFilterChange} />
                  <button
                    type='button'
                    className='btn btn-success mx-2'
                    onClick={handleExportAcara}
                    style={{ height: 'max-content' }}>
                    Export
                  </button>
                </div>
              </div>
            </div>
            <PaginationProvider pagination={paginationFactory(eventPaginateOption)}>
              {({ paginationProps, paginationTableProps }) => {
                return (
                  <div>
                    <BootstrapTable
                      keyField='id'
                      data={eventDataList}
                      columns={columns}
                      remote={{ pagination: true, filter: false, sort: false }}
                      noDataIndication='Belum ada data'
                      {...paginationTableProps}
                    />
                    <div className='row align-items-center mt-5'>
                      <div className='col-md-6'>
                        <PaginationListStandalone
                          {...paginationProps}
                          onPageChange={(e) => {
                            handleEventPageChange(e);
                          }}
                        />
                      </div>
                      <div className='col-md-6'>
                        <div className='d-flex float-right'>
                          <SizePerPageDropdownStandalone
                            className='mr-5'
                            {...paginationProps}
                            onSizePerPageChange={(sizePerPage, page) => {
                              setEventRowsPerPage(sizePerPage);
                              setEventPage(1);
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
      </Tab>
    </Tabs>
  );
}

export default TransactionListPage;
