import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import { Link, useHistory } from "react-router-dom";
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
import { DropdownIcon } from "../../components/DropdownIcon";
import { EventServices, MasterServices, ParentOrganizationServices } from "../../services";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import moment from 'moment';
import * as _ from "lodash";
import { useSelector, shallowEqual } from "react-redux";
require('moment/locale/id.js');

export function EventMemberListPage(props) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;
  const history = useHistory();

  const getData = async () => {
    let { data, error } = await EventServices.member(
      {id: props.match.params.id}
      ,{
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

  const handleFilterChange = (changes) => {
    console.log(changes);
    setPage(1);
    setFilter(changes);
  };

  const columns = [
    {
      dataField: "id",
      text: "ID Anggota",
    },
    {
      dataField: "name",
      text: "Nama Anggota",
    },
    {
      dataField: "nik",
      text: "NIK",
    },
    {
      dataField: "province_name",
      text: "Wilayah",
    },
    {
      dataField: "city_name",
      text: "Kab/Kota",
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

  const clearFilter = () => {
    setPage(1);
    setFilter({});
    // console.log(filter)
  };

  const prevPage = () => {
    history.goBack();
  }

  return (
    <Card>
      <CardHeader title="Acara">
        <CardHeaderToolbar>
          {
            Object.keys(filter).length > 0 && (
              <button 
                type="submit" 
                className="btn btn-danger"
                onClick={clearFilter}
              >
                Hapus Filter
              </button>
            )
          }
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
      <div className="row">
          <div className="col-md-6">
            <div className="d-flex mb-6 float-left">
              <button
                type="button"
                className="btn btn-unggah mx-2"
                onClick={prevPage}
                style={{height: 'max-content'}}
                >
                Kembali
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex mb-6 float-right">
                <InputSearch placeholder="Nama Anggota" onSearch={handleFilterChange} />
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

export default EventMemberListPage;
