import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from "react-bootstrap-table2-paginator";
import { Link, useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import InputSearch from "../../components/InputSearch";
import constants from "../../libs/constants";
import ShowAlert from "../../libs/ShowAlert";
import ShowToast from "../../libs/ShowToast";
import { RegionAdministratorServices } from "../../services";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export function RegionAdministratorListPage(props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const [administratorId, setAdministratorId] = useState(0);
  const history = useHistory();

  const getData = async () => {
    let { data, error } = await RegionAdministratorServices.list({
      page,
      keyword: filter.search ? filter.search : "",
      limit: rowsPerPage,
      administrator_id: props.match.params.id,
    });
    if (data) {
      setData(data.data);
      setTotalData(data.total);
      setAdministratorId(props.match.params.id)
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
        let { data, error } = await RegionAdministratorServices.delete(id);
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

  const prevPage = () => {
    history.goBack();
  }

  // HANDLE DATA TABLE
  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className="d-flex">
          <Link
            to={`/region-administrator/${row.id}/update`}
            style={{ marginRight: "10px" }}
            className="btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <SVG
              title=" "
              src={toAbsoluteUrl(
                "/media/svg/icons/Communication/Write.svg"
              )}
            ></SVG>
          </Link>
          <span
            onClick={() => {
              handleDelete(row.id);
            }}
            className="btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer"
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

  const columns = [
    {
      dataField: "name",
      text: "Nama Anggota",
    },
    {
      dataField: "jabatan_text",
      text: "Jabatan",
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
          let { data, error } = await RegionAdministratorServices.delete(id);
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
    const { data } = await RegionAdministratorServices.export();
    if (data) {
      window.open(data.file, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader title="Daftar Pengurus">
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
            <InputSearch placeholder="Nama" onSearch={handleFilterChange} />
          </div>
          <div className="col-md-3">
            <div className="d-flex mb-6 float-right">
              <button
                type="button"
                className="btn btn-success mr-2"
                onClick={prevPage}
              >
                Kembali
              </button>
              <button
                type="button"
                className="btn btn-unggah mr-2"
                onClick={handleExport}
              >
                Unduh
              </button>
              <Link className="btn btn-success mr-2" to={`/region-administrator/${administratorId}/create`}>
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
                          setRowsPerPage(sizePerPage)
                          setPage(1)
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

export default RegionAdministratorListPage;
