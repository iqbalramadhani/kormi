import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider,
    PaginationTotalStandalone,
    SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import useStore from "../../../zustand/store";
import { UserServices } from "../../services";
import ShowAlert from "../../libs/ShowAlert";
import constants from "../../libs/constants";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import WebAppSettingsServices from "../../services/modules/WebAppSettingsServices";
import Swal from 'sweetalert2';


export function PaymentCheckoutPage() {
  const selectedRows = useStore(state => state.selectedRows);
  const setSelectedRows = useStore(state => state.setSelectedRows);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [price, setPrice] = useState(0);
  const [paymentPage, setPaymentPage] = useState(null);
  const history = useHistory();


  const getPrice = async () => {
    let { data, error } = await WebAppSettingsServices.getSetting();
    if (data) {
      setPrice(data.register_price);
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  }

  const handleCheckout = async () => {
    if (selectedRows.length == 0) {
      ShowAlert.warning('Data pembayaran kosong');
      return;
    }
    ShowAlert.confirm('Konfirmasi Pembayaran?').then(async (result) => {
      if (result.value) {
        let formData = [];
        selectedRows.map(row => {
          formData.push({'user_ids[]': row.id});
        });
        // console.log(formData)
        let { data, data: {message_error, message_success}  } = await UserServices.bulkPayment(formData);
        if (message_success.length > 0) {
          setPaymentPage(data.payment.link);
          window.open(data.payment.link, '_blank');
        }
        if (message_error.length > 0) {
          let error = [];
          message_error.map((err, i) => {
            error.push(`<div style="line-height: 20px">(${i+1}.) ${err.text}</div><br>`);
          });
          let content = error.join(" ");
          Swal.fire({
            title: 'Pembayaran Gagal',
            html: `
            <div align="left" style="line-height: 12px">
              <div>Alasan gagal:</div><br>
              ${content}
            </div>`,
            icon: 'error',
            showCancelButton: true,
          })
        }
      }
    });
  }

  useEffect(() => {
    getPrice();
  }, []);

  const actionFormatter = (cell, row) => {
    if (selectedRows.length > 0) setTotalData(selectedRows.length);
    if (row) {
    return (
      <div className="d-flex">
        <span
        onClick={() => {
            handleDelete(row.id);
        }}
        className="btn btn-clean svg-icon svg-icon-primary svg-icon-xl btn-hover-light-primary btn-sm btn-icon cursor-pointer"
        >
        <SVG
            title=" "
            src={toAbsoluteUrl(
            "/media/svg/icons/General/Trash.svg"
            )}
        ></SVG>
        </span>
      </div>
    );
    }
  };

  const memberFormatter = (cell, row) => {
    let label_style = "label-light-warning";
    if (row.organitation_status.title == 'Pengurus') label_style = "label-pengurus";
    if (row.organitation_status.title == 'Anggota') label_style = "label-anggota";
    if (row.organitation_status.title == 'Pelatih') label_style = "label-pelatih";
    return (
      <div>
        {
          Object.keys(row.organitation_status).length > 0 ?
          (<span className={`label label-lg ${label_style} label-inline`}>
            {row.organitation_status.title}
          </span>) : ("")
        }
      </div>
    )
  };

  const columns = [
    {
      dataField: "name",
      text: "Nama",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "nik",
      text: "NIK",
    },
    {
      dataField: "role_label",
      text: "Keanggotaan",
      formatter: memberFormatter,
    },
    {
      dataField: "action",
      text: "Aksi",
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

  const handleDelete = (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        setSelectedRows(selectedRows.filter(item => item.id !== id));
      }
    });
  };

  const idCurrency = (value) => {
    if (value !== null) {
      return (value).toLocaleString('id-ID');
    }
    return 0;
  };

  return (
    <div className="row">
      <div className="col-md-9">
        <Card>
          <CardHeader title="Pembayaran">
            <CardHeaderToolbar>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            <PaginationProvider pagination={paginationFactory(paginateOption)}>
              {({ paginationProps, paginationTableProps }) => {
                return (
                  <div>
                    <BootstrapTable
                        keyField="id"
                        data={selectedRows}
                        columns={columns}
                        remote={{ pagination: true, filter: false, sort: false }}
                        noDataIndication="Belum ada data"
                        {...paginationTableProps}
                    />
                  </div>
                );
              }}
          </PaginationProvider>
          </CardBody>
        </Card>
      </div>
      <div className="col-md-3">
        <Card>
          <CardHeader title="Total">

          </CardHeader>
          <CardBody>
            <div className="d-flex" style={{justifyContent: 'space-between'}}>
              <span><b>Jumlah</b></span>
              <span>{selectedRows.length}</span>
            </div>
            <div className="d-flex" style={{justifyContent: 'space-between'}}>
              <span><b>Harga</b></span>
              <span>Rp {idCurrency(price)}</span>
            </div>
            <hr/>
            <div className="d-flex" style={{justifyContent: 'space-between'}}>
              <span><b>Sub-total</b></span>
              <span>Rp {idCurrency(price*selectedRows.length)}</span>
            </div>
            {
              paymentPage === null ? (
                <button 
                  type="submit" 
                  className="btn btn-success mt-5" 
                  style={{width: '100%'}}
                  onClick={handleCheckout}
                >Checkout</button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-success mt-5" 
                  style={{width: '100%'}}
                  onClick={() => {window.open(paymentPage, '_blank')}}
                >Halaman Pembayaran</button>
              )
            }
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default PaymentCheckoutPage;