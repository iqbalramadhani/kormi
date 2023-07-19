import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
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
import InputSearch from "../../components/InputSearch";
import constants from "../../libs/constants";
import ShowAlert from "../../libs/ShowAlert";
import ShowToast from "../../libs/ShowToast";
import { CommissionServices, ParentOrganizationServices } from "../../services";

export function CommissionMainOrganizationListPage(props) {
  const commissionId = props.match.params.id;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);

  const getData = async () => {
    let { data, error } = await CommissionServices.parentOrganization({
      page,
      sort_key: sort.sort_key ? sort.sort_key : "",
      sort_condition: sort.sort_condition ? sort.sort_condition : "",
      search: filter.search ? filter.search : "",
      limit: rowsPerPage,
      commission_id: commissionId
    });
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

  const handleDelete = async (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await ParentOrganizationServices.delete(null, null, id);
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

  // HANDLE DATA TABLE
  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className="d-flex">
          <Link
            to={`/main-organization/${row.id}/update`}
            className="btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <i className="far fa-edit mx-3"></i>
          </Link>
          <span
            onClick={() => {
              handleDelete(row.id);
            }}
            className="btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <i className="far fa-trash-alt"></i>
          </span>
        </div>
      );
    }
  };

  const columns = [
    {
      dataField: "parent_no",
      text: "No Induk",
    },
    {
      dataField: "parent_sk",
      text: "SK Induk Organisasi",
    },
    {
      dataField: "parent_name",
      text: "Nama Induk Organisasi",
    },
    {
      dataField: "total_file",
      text: "Jumlah Dokumen",
    },
    {
      dataField: "action",
      text: "Action",
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
    mode: "checkbox",
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
          let { data, error } = await ParentOrganizationServices.delete(null, null, id);
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

  return (
    <Card>
      <CardHeader title="Data Induk Organisasi">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-4">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Pilih Aksi
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleBulkDelete()}>
                  Hapus Sekaligus
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-md-5">
            <InputSearch onSearch={handleFilterChange} />
          </div>
          <div className="col-md-3">
            <div className="d-flex mb-6 float-right">
              <button
                type="button"
                className="btn btn-success mr-2"
                onClick={() => ShowToast.comingSoon()}
              >
                Import
              </button>
              <Link className="btn btn-success mr-2" to="/main-organization/create">
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
                  keyField="id"
                  data={dataList}
                  columns={columns}
                  selectRow={selectRow}
                  remote={{ pagination: true, filter: false, sort: false }}
                  noDataIndication="Belum ada data"
                  {...paginationTableProps}
                />
                <div className="row align-items-center mt-5">
                  <div className="col-md-6">
                    <PaginationTotalStandalone {...paginationProps} />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex float-right">
                      <SizePerPageDropdownStandalone
                        className="mr-5"
                        {...paginationProps}
                        onSizePerPageChange={(sizePerPage, page) => {
                          setRowsPerPage(sizePerPage);
                          setPage(1);
                        }}
                      />
                      <PaginationListStandalone
                        {...paginationProps}
                        onPageChange={(e) => {
                          handlePageChange(e);
                        }}
                      />
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

export default CommissionMainOrganizationListPage;
