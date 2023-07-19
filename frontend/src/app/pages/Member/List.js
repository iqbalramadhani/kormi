import React, { useEffect, useState } from "react";
import * as _ from "lodash";
import { Dropdown } from "react-bootstrap";
import Select from "react-select";
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
import InputSearch from "../../components/InputSearch";
import constants from "../../libs/constants";
import ShowAlert from "../../libs/ShowAlert";
import { UserServices, MasterServices } from "../../services";
import { DropdownIcon } from "../../components/DropdownIcon";
import { Form } from "react-bootstrap";
import store from "../../../redux/store";
import Swal from 'sweetalert2';
import mailIcon from '../../../icons/ic_mail.svg';
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import useStore from "../../../zustand/store";
import { useSelector, shallowEqual } from "react-redux";

export function MemberListPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const history = useHistory();
  const setSelectedRows = useStore(state => state.setSelectedRows);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const getData = async () => {
    let { data, error } = await UserServices.getMemberList({
      page,
      sort_key: sort.sort_key ? sort.sort_key : "",
      sort_condition: sort.sort_condition ? sort.sort_condition : "",
      search: filter.search ? filter.search : "",
      status: typeof(filter.status) == 'number' ? filter.status : "",
      membership: filter.membership ? filter.membership : "",
      province: filter.province ? filter.province : "",
      city: filter.city ? filter.city : "",
      limit: rowsPerPage,
    });
    if (data) {
      setData(data.record.data);
      setTotalData(data.record.total);
      if (statuses.length === 0) {
        setStatuses(data.status);
      }
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  const getDataProvinces = async (search = "") => {
    let { data, error } = await MasterServices.browseProvince({
      search: search ? search : "",
    });
    if (data) {
      let provinces = data.map((province) => {
        return { value: province.id, label: province.name };
      });
      let allProvinces = {
        value: 1,
        label: 'SEMUA PROVINSI'
      }
      provinces.unshift(allProvinces);
      setProvinces(provinces);
    }
  };

  const getDataCities = async (search = "", province_id = 0) => {
    let { data, error } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
      province_id: province_id
    });
    if (data) {
      let cities = data.map((city) => {
        return { value: city.value, label: city.label };
      });
      let allCities = {
        value: 1,
        label: 'SEMUA KAB/KOTA'
      }
      cities.unshift(allCities);
      setCities(cities);
    }
  };

  const membershipStatus = [
    {
      value: 8,
      label: 'Pengurus'
    },
    {
      value: 9,
      label: 'Pelatih'
    },
    {
      value: 10,
      label: 'Anggota'
    },
  ]

  useEffect(() => {
    getData();
    if (roleId < 2) getDataProvinces();
    // console.log(filter)
    // getDataCities();
  }, [page, rowsPerPage, filter, sort]);

  const handleDelete = async (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await UserServices.delete(id);
        if (data) {
          getData();
        }
        if (error) {
          if (error.message) ShowAlert.failed(error.message);
        }
      }
    });
  };

  const handleCreateInvoice = async (id) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await UserServices.createInvoice(id);
        console.log(data);
        if (data) {
          if(data.payment)window.open(data.payment.link)
          getData();
        }
        if (error) {
          if (error.message) ShowAlert.failed(error.message);
        }
      }
    });
  }

  const handleFilterChange = (changes) => {
    setPage(1);
    setFilter(changes);
  };

  const handlePublish = async (id, status) => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        let { data, error } = await UserServices.updateStatusMember(null, {
          id: id,
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

  const handleExport = async () => {
    const { message, data } = await UserServices.export();
    if (message == 'Sukses') {
      window.open(data.link_download, '_blank');
    } else {
      Swal.fire({
        title: 'Permintaan Data Berhasil',
        text: 'Data sudah kami proses dan segera kami kirimkan ke email anda, silahkan cek inbox anda beberapa saat lagi',
        imageUrl: mailIcon,
        imageWidth: 100,
        imageHeight: 100,
        confirmButtonText: 'Kembali',
        confirmButtonColor: '#34C38F',
      }).then(result => {
        if (result.value) {
          history.push('/member')
        }
      })
    }
  };

  // HANDLE DATA TABLE
  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className="d-flex" style={{justifyContent: 'space-evenly'}}>
          {row.status !== 0 && (
              <Dropdown className="dropdown dropdown-inline" alignRight>
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
                    {row.status === 1 && (
                      <li className="navi-item">
                        <a
                          href="#"
                          className="navi-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePublish(row.id, -1);
                          }}
                        >
                          <span className="navi-icon">
                            <i className="fa fa-download"></i>
                          </span>
                          <span className="navi-text">Suspen</span>
                        </a>
                      </li>
                    )}
                    {(row.status === 2 ||
                      row.status === -1) && (
                        <li className="navi-item">
                          <a
                            href="#"
                            className="navi-link"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePublish(row.id, 1);
                            }}
                          >
                            <span className="navi-icon">
                              <i className="fa fa-download"></i>
                            </span>
                            <span className="navi-text">Approve</span>
                          </a>
                        </li>
                      )}
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
          )}
          <Link
            to={`/member/${row.id}/detail`}
            className="btn btn-clean svg-icon svg-icon-primary svg-icon-xl btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <SVG
              title=" "
              src={toAbsoluteUrl(
                "/media/svg/icons/General/Visible.svg"
              )}
            ></SVG>
          </Link>

          {(row.status === 1) && (
          <Link
            to={`/member/${row.id}/update`}
            className="btn btn-clean svg-icon svg-icon-primary svg-icon-xl btn-hover-light-primary btn-sm btn-icon cursor-pointer"
          >
            <SVG
              title=" "
              src={toAbsoluteUrl(
                "/media/svg/icons/Communication/Write.svg"
              )}
            ></SVG>
          </Link>
          )}
          {(row.status === 0 || row.status === -1) && (
            <span
              onClick={() => {
                handleDelete({ id: row.id });
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
          )}
          {(row.status === -2) && (
            <span
              onClick={() => {
                handleCreateInvoice({ id: row.id });
              }}
              className="btn btn-clean svg-icon svg-icon-primary svg-icon-xl btn-hover-light-primary btn-sm btn-icon cursor-pointer"
            >
              <SVG
                title=" "
                src={toAbsoluteUrl(
                  "/media/svg/icons/Files/Selected-file.svg"
                )}
              ></SVG>
            </span>
          )}
        </div>
      );
    }
  };

  const regionFormatter = (cell, row) => {
    if (row.province) return row.province.name;
  };

  const cityFormatter = (cell, row) => {
    if (row.city) return row.city.name;
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
            <b>{row.organitation_status.title}</b>
          </span>) : ("")
        }
      </div>
    )
  };

  const idFormatter = (cell, row) => {
    return (
      <div>
        {row.member_number ? (
          row.member_number
        ) : (
          <label style={{ color: "grey" }}>Belum memiliki nomor</label>
          )}
      </div>
    );
  };
  
  const statusFormatter = (cell, row) => {
    let label_style = "label-light";
    if (row.status == 1) label_style = "label-light-success";
    if (row.status == 0) label_style = "label-light-primary";
    if (row.status == 2) label_style = "label-light-warning";
    if (row.status == -2) label_style = "label-light-warning";
    return (
      <span className={`label label-lg ${label_style} label-inline`} style={{height: 'max-content'}}>
        <b>{row.status_label}</b>
      </span>
    )
  };

  const columns = [
    {
      dataField: "member_number",
      text: "ID Anggota",
      formatter: idFormatter,
    },
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
    // {
    //   dataField: "phone_number",
    //   text: "Nomor HP",
    // },
    {
      dataField: "province",
      text: "Wilayah",
      formatter: regionFormatter,
    },
    {
      dataField: "city",
      text: "Kab/Kota",
      formatter: cityFormatter,
    },
    {
      dataField: "role_label",
      text: "Keanggotaan",
      formatter: memberFormatter,
    },
    {
      dataField: "status_label",
      text: "Status",
      formatter: statusFormatter,
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
      if (row.status === 0 || row.status === -1) {
        if (isSelect) {
          selected.push(row.id);
        } else {
          const index = selected.indexOf(row.id);
          selected.splice(index, 1);
        }
        setSelectedRowId(selected);
        const selectedUsers = dataList.filter(item => selected.includes(item.id));
        setSelectedRows(selectedUsers);
        console.log(selectedUsers)
      } else {
        return false;
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      let selected = [...selectedRowId];

      if (isSelect) {
        selected = rows
          .filter((r) => r.status === 0 || r.status === -1)
          .map((row) => row.id);
        setSelectedRowId(selected);
        const selectedUsers = dataList.filter(item => selected.includes(item.id));
        setSelectedRows(selectedUsers);
        console.log(selectedUsers)
        return selected;
      } else {
        selected = [];
        setSelectedRowId(selected);
        const selectedUsers = dataList.filter(item => selected.includes(item.id));
        setSelectedRows(selectedUsers);
        console.log(selectedUsers)
      }
    },
  };

  const handleBulkDelete = async () => {
    ShowAlert.confirm().then(async (result) => {
      if (result.value) {
        for (let index = 0; index < selectedRowId.length; index++) {
          const id = selectedRowId[index];
          let { data, error } = await UserServices.delete({id});
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
    let newFilter = { ...filter };
    // console.log(filter)
    newFilter.status = e.value;
    setFilter(newFilter);
  };

  const setMembership = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.membership = e.value;
    setFilter(newFilter);
  };

  const setProvince = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.province = e.value > 1 ? e.value : '';
    getDataCities("", e.value);
    setFilter(newFilter);
  };

  const setCity = (e, filter) => {
    setPage(1);
    // console.log(filter)
    let newFilter = { ...filter };
    newFilter.city = e.value > 1 ? e.value : '';
    setFilter(newFilter);
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, function(o) {
      return o.value == selectedValue;
    });
    return index !== -1 ? list[index] : null;
  };

  const clearFilter = () => {
    setPage(1);
    // console.log(filter)
    setFilter({});
  };

  const handleNextPage = ({
    page,
    onPageChange
  }) => () => {
    onPageChange(page + 1);
  }

  const handlePrevPage = ({
    page,
    onPageChange
  }) => () => {
    onPageChange(page - 1);
  }

  const handleSizePerPage = ({
    page,
    onSizePerPageChange
  }, newSizePerPage) => {
    onSizePerPageChange(newSizePerPage, page);
  }

  return (
    <Card>
      <CardHeader title="Anggota">
        <CardHeaderToolbar>
          {
            selectedRowId.length > 0 ? (
              <Link className="btn btn-success" to="/payment-checkout">
                Bayar
              </Link>
            ) : ""
          }
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
          <div className="col-md-7">
            <div className="d-flex justify-content-start">
              <div className="mx-2">
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
              {
                (roleId < 2) && (
                  <div className="mx-2" style={{width: '20%', fontSize: '11px'}}>
                    <Select
                      name="province"
                      options={provinces}
                      onChange={(e) => setProvince(e, filter)}
                      value={getSelected(provinces, filter.province)}
                      placeholder="Wilayah"
                    />
                  </div>
                )
              }
              <div className="mx-2" style={{width: '20%', fontSize: '11px'}}>
                <Select
                  name="cities"
                  options={cities}
                  onChange={(e) => setCity(e, filter)}
                  value={getSelected(cities, filter.city)}
                  placeholder="Kab/Kota"
                />
              </div>
              <div className="mx-2" style={{width: '22%', fontSize: '11px'}}>
                <Select
                  name="membership"
                  options={membershipStatus}
                  onChange={(e) => setMembership(e, filter)}
                  value={getSelected(membershipStatus, filter.membership)}
                  placeholder="Keanggotaan"
                />
              </div>
              <div className="mx-2" style={{width: '15%', fontSize: '11px'}}>
                <Select
                  name="status"
                  options={statuses}
                  onChange={(e) => setStatus(e, filter)}
                  value={getSelected(statuses, filter.status)}
                  placeholder="Status"
                />
              </div>
            </div>  
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-end"
            >
              <div className="mx-2">
                <InputSearch placeholder="Nama/Email" onSearch={handleFilterChange} />
              </div>
              <div className="mx-2">
                <button 
                  type="submit" 
                  className="btn btn-unggah"
                  onClick={handleExport}
                >
                  Unduh
                </button>
              </div>
              <div className="mx-2">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Tambah
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {history.push('/member/create')}} style={{justifyContent: 'space-evenly'}}>
                      Manual
                      <i class="fas fa-plus-circle"></i>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {history.push('/member/upload')}} style={{justifyContent: 'space-evenly'}}>
                      Unggah
                      <i class="fas fa-cloud-upload-alt"></i>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
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
{/* <div class="d-flex justify-content-between align-items-center flex-wrap">
    <div class="d-flex flex-wrap py-2 mr-3">
        <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-double-arrow-back icon-xs"></i></a>
        <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-arrow-back icon-xs"></i></a>

        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">...</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">23</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1">24</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">25</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">26</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">27</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">28</a>
        <a href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1">...</a>

        <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-arrow-next icon-xs"></i></a>
        <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1"><i class="ki ki-bold-double-arrow-next icon-xs"></i></a>
    </div>
    <div class="d-flex align-items-center py-3">
        <select class="form-control form-control-sm font-weight-bold mr-4 border-0 bg-light" style={{width: "75px"}}>
          {paginationProps.sizePerPageList.map(d => (
            <option value={d}>{d}</option>
            ))}
        </select>
        <span class="text-muted">Displaying {paginationProps.sizePerPage} of {paginationProps.totalSize} records</span>
    </div>
</div> */}
</div>
            );
          }}
        </PaginationProvider>
      </CardBody>
    </Card>
  );
}

export default MemberListPage;
