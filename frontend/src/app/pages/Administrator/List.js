import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
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
import { AdministratorServices } from "../../services";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { DropdownIcon } from "../../components/DropdownIcon";

export function AdministratorListPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);

  const getData = async () => {
    let { data, error } = await AdministratorServices.browse({
      page,
      sort_key: sort.sort_key ? sort.sort_key : "",
      sort_condition: sort.sort_condition ? sort.sort_condition : "",
      search: filter.search ? filter.search : "",
      limit: rowsPerPage,
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
        let { data, error } = await AdministratorServices.delete(id);
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

  const handleExport = async () => {
    const { data } = await AdministratorServices.export();
    if (data) {
      window.open(data.file, '_blank');
    }
  };

  // HANDLE DATA TABLE
  // const actionFormatter = (cell, row) => {
  //   if (row) {
  //     return (
  //       <div className="d-flex">
  //         <Link
  //           to={`/administrator/${row.id}/update`}
  //           style={{ marginRight: "10px" }}
  //         >
  //           <i className="far fa-edit mx-3"></i>
  //         </Link>
  //         <span
  //           onClick={() => {
  //             handleDelete(row.id);
  //           }}
  //           className="icon-button"
  //         >
  //           <i className="far fa-trash-alt"></i>
  //         </span>
  //       </div>
  //     );
  //   }
  // };
  const actionFormatter = (cell, row) => {
    if(row){
      return (
        <div className="d-flex" style={{justifyContent: 'space-evenly'}}>
              {/* <Dropdown className="dropdown dropdown-inline" alignRight>
                <Dropdown.Toggle
                  className="btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer"
                  variant="transparent"
                  id="dropdown-toggle-top-user-profile"
                  as={DropdownIcon}
                >
                  <span className="svg-icon svg-icon-primary svg-icon-xl">
                    <SVG
                      title=" "
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Settings-1.svg"
                      )}
                    ></SVG>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                  <ul className="navi navi-hover">
                      <li className="navi-item">
                        <a
                          href="#"
                          className="navi-link"
                        >
                          <span className="navi-icon">
                            <i className="fa fa-download"></i>
                          </span>
                          <span className="navi-text">Suspen</span>
                        </a>
                      </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown> */}
          <Link
            to={`/region-administrator/${row.id}`}
            style={{ marginRight: "10px" }}
            className="btn btn-clean svg-icon svg-icon-primary svg-icon-md btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <SVG
              title=" "
              src={toAbsoluteUrl(
                "/media/svg/icons/General/Settings-1.svg"
              )}
            ></SVG>
          </Link>
          <Link
            to={`/administrator/${row.id}/update`}
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

  const baktiFormatter = (cell, row) => {
    return row.created_at.split(" ")[0].split('-')[0] + ' - ' + row.last_date_sk.split(" ")[0].split('-')[0]
  };

  const typeFormatter = (cell, row) => {
    if (!row.city_name) {
      return row.province_name;
    } else if (!row.province_name) {
      return row.city_name;
    }
  };

  const columns = [
    {
      dataField: "no_sk",
      text: "No SK Pengurus",
    },
    {
      dataField: "type_text",
      text: "Status Kepengurusan",
    },
    {
      text: "Wilayah Kepengurusan",
      formatter: typeFormatter,
    },
    {
      dataField: "pengurus_count",
      text: "Jumlah Anggota",
    },
    {
      dataField: "last_date_sk",
      text: "Masa Bakti",
      formatter: baktiFormatter,
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
          let { data, error } = await AdministratorServices.delete(id);
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
      <CardHeader title="Pengurus">
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
          <div className="col-md-8">
            <div className="d-flex mb-6 float-right">
              <InputSearch placeholder="Nomor SK" onSearch={handleFilterChange} />
              <button
                type="button"
                className="btn btn-unggah mx-2"
                onClick={handleExport}
                style={{height: 'max-content'}}
              >
                Unduh
              </button>
              <Link 
                className="btn btn-success mr-2" 
                to="/administrator/create"
                style={{height: 'max-content'}}
              >
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
                  bordered={ false }
                  {...paginationTableProps}
                />
                <div className="row align-items-center mt-5">
                  <div className="col-md-6">
                  <PaginationListStandalone
                        {...paginationProps}
                        onPageChange={(e) => {
                          handlePageChange(e);
                        }}
                      />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex float-right">
                      <SizePerPageDropdownStandalone
                        className="mr-5"
                        {...paginationProps}
                        onSizePerPageChange={(sizePerPage, page) => {
                          // console.log(sizePerPage)
                          setRowsPerPage(sizePerPage);
                          setPage(1);
                        }}
                      />
                      <div className="my-auto">
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

export default AdministratorListPage;
