import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Tabs, Tab, Button, Col, Form, Row } from 'react-bootstrap';
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
import { ParentOrganizationServices, WebAppSettingsServices } from '../../services';
import { useSelector, shallowEqual } from 'react-redux';
import Editor from '../../components/Editor';
import Swal from 'sweetalert2';
import useStore from '../../../zustand/store';

export function MainOrganizationListPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(constants.defaultPageSize);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [selectedRowId, setSelectedRowId] = React.useState([]);

  const [totalData, setTotalData] = useState(0);
  const [dataList, setData] = React.useState([]);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;

  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoThumbnail, setLogoThumbnail] = useState(null);
  const [cardDesign, setCardDesign] = useState(null);
  const [cardDesignThumbnail, setCardDesignThumbnail] = useState(null);
  const [settingInduk, setSettingInduk] = useState({
    logo: '',
    description: '',
  });
  const setSidebarLogo = useStore((state) => state.setSidebarLogo);

  const getData = async () => {
    let { data, error } = await ParentOrganizationServices.browse({
      page,
      sort_key: sort.sort_key ? sort.sort_key : '',
      sort_condition: sort.sort_condition ? sort.sort_condition : '',
      search: filter.search ? filter.search : '',
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

  const getSettingInduk = async () => {
    let {
      data: {
        settings: { logo, desain_kartu, description },
      },
    } = await WebAppSettingsServices.getSettingInduk();

    let dataSettingInduk = {
      logo: '',
      description: '',
    };

    if (logo) dataSettingInduk.logo = logo;
    if (description) dataSettingInduk.description = description;
    setSidebarLogo(logo);

    setSettingInduk(dataSettingInduk);
  };

  const updateSettingInduk = async () => {
    let dataSettingInduk = { ...settingInduk };
    dataSettingInduk.logo = logo;
    dataSettingInduk.desain_kartu = cardDesign;
    setSidebarLogo(dataSettingInduk.logo);
    if (logo === null) {
      delete dataSettingInduk.logo;
    }
    if (cardDesign === null) {
      delete dataSettingInduk.desain_kartu;
    }
    let { data, error } = await WebAppSettingsServices.updateSettingInduk(dataSettingInduk);
    if (data) {
      getSettingInduk();
      ShowAlert.updated();
    }
    // if (error) {
    //   errors.map(err => {

    //   })
    // }
  };

  const deleteImage = (e) => {
    const name = e.target.attributes[0].value;
    Swal.fire({
      title: 'Hapus Gambar',
      text: 'Gambar akan dihapus, lanjutkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batalkan',
      width: 600,
    }).then(async (result) => {
      if (result.value) {
        if (!settingInduk.logo) {
          if (name === 'logo') {
            setLogo(null);
            setLogoThumbnail(null);
            document.getElementById('logo').value = null;
            history.push('/main-organization');
          } else {
            setCardDesign(null);
            setCardDesignThumbnail(null);
            document.getElementById('desain_kartu').value = null;
            history.push('/main-organization');
          }
        } else {
          if (name === 'logo') {
            let { message } = await WebAppSettingsServices.deleteSettingIndukImage('logo');
            if (message == 'Gambar telah dihapus') {
              setLogo(null);
              setLogoThumbnail(null);
              document.getElementById('logo').value = null;
              getSettingInduk();
            }
          } else {
            let { message } = await WebAppSettingsServices.deleteSettingIndukImage('desain_kartu');
            if (message == 'Gambar telah dihapus') {
              setCardDesign(null);
              setCardDesignThumbnail(null);
              document.getElementById('desain_kartu').value = null;
              getSettingInduk();
            }
          }
        }
      } else {
        getSettingInduk();
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettingInduk();
  };

  const prevPage = () => {
    history.goBack();
  };

  const handleChanges = async (e) => {
    let dataSettingInduk = { ...settingInduk };
    dataSettingInduk[e.target.name] = e.target.value;
    setSettingInduk(dataSettingInduk);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['jpg', 'png', 'jpeg'];
    let check = allowedExtensions.some((ext) => file.name.includes(ext));
    if (!file.type.includes('image/')) {
      ShowAlert.failed('File selain gambar tidak diperbolehkan');
      return;
    } else if (!check) {
      ShowAlert.failed('Silakan unggah file dalam format .jpg, .png, atau .jpeg');
      return;
    } else if (file.size > 2000000) {
      ShowAlert.failed('Ukuran gambar maksimal 2 MB');
      return;
    } else {
      const thumbnail = URL.createObjectURL(file);
      if (e.target.name === 'logo') {
        setLogoThumbnail(thumbnail);
        setLogo(file);
      } else {
        setCardDesignThumbnail(thumbnail);
        setCardDesign(file);
      }
    }
  };

  useEffect(() => {
    if (roleId === 0) {
      getData();
    } else {
      getSettingInduk();
    }
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

  console.log(dataList);

  const handleFilterChange = (changes) => {
    setPage(1);
    setFilter(changes);
  };

  // HANDLE DATA TABLE
  const actionFormatter = (cell, row) => {
    if (row) {
      return (
        <div className='d-flex'>
          <Link
            to={`/main-organization/${row.id}/update`}
            className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <i className='far fa-edit mx-3'></i>
          </Link>
          <span
            onClick={() => {
              handleDelete(row.id);
            }}
            className='btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer'>
            <i className='far fa-trash-alt'></i>
          </span>
        </div>
      );
    }
  };

  const columns = [
    {
      dataField: 'parent_no',
      text: 'No Induk',
    },
    {
      dataField: 'parent_sk',
      text: 'SK Induk Organisasi',
    },
    {
      dataField: 'parent_name',
      text: 'Nama Induk Organisasi',
    },
    {
      dataField: 'total_file',
      text: 'Jumlah Dokumen',
    },
    {
      dataField: 'action',
      text: 'Action',
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

  const handleExport = async () => {
    const { data } = await ParentOrganizationServices.export();
    if (data) {
      window.open(data.link_download, '_blank');
    }
  };

  return (
    <>
      {roleId === 0 ? (
        <Card>
          <CardHeader title='Data Induk Organisasi'>
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
              <div className='col-md-5'>
                <InputSearch onSearch={handleFilterChange} />
              </div>
              <div className='col-md-3'>
                <div className='d-flex mb-6 float-right'>
                  <button type='button' className='btn btn-success mr-2' onClick={handleExport}>
                    Export
                  </button>
                  <Link className='btn btn-success mr-2' to='/main-organization/create'>
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
      ) : (
        <Card>
          <Form noValidate onSubmit={handleSubmit} className='card-in-form'>
            <CardBody>
              <p style={{ fontSize: '1rem', marginBottom: '3px' }}>
                <b>Unggah Logo Induk</b>
              </p>
              <div className='upload-btn-wrapper' style={{ width: '50%' }}>
                <input
                  onChange={(e) => {
                    handleImage(e);
                  }}
                  type='file'
                  name='logo'
                  id='logo'
                />
                <div className='form-group feature-image-wrapper d-flex'>
                  {logoThumbnail !== null ? (
                    <div style={{ position: 'relative', maxWidth: '190px' }}>
                      <div onClick={deleteImage} name='logo' className='btn-delete'>
                        <i name='logo' className='far fa-trash-alt'></i>
                      </div>
                      <img
                        src={logoThumbnail}
                        alt='Logo'
                        // onClick={() => openAttachment(item)}
                        className='img-logo'
                      />
                    </div>
                  ) : settingInduk.logo ? (
                    <div style={{ position: 'relative', maxWidth: '190px' }}>
                      <div onClick={deleteImage} name='logo' className='btn-delete'>
                        <i name='logo' className='far fa-trash-alt'></i>
                      </div>
                      <img
                        src={settingInduk.logo}
                        alt='Logo'
                        // onClick={() => openAttachment(item)}
                        className='img-logo'
                      />
                    </div>
                  ) : (
                    <span style={{ alignSelf: 'center', opacity: '0.7' }}>Unggah Foto Utama</span>
                  )}
                  <button
                    className='btn btn-primary d-flex ml-auto'
                    style={settingInduk.logo || logo !== null ? { height: '40px', marginTop: '20px' } : {}}>
                    Pilih Foto
                  </button>
                </div>
                <label htmlFor='logo' className='font-size-sm'>
                  Format foto .JPG, .JPEG Max 2MB; disarankan resolusi gambar 1024x620 px;
                </label>
              </div>
              <br />
              <br />
              <Form.Group>
                <Form.Label>
                  <b>Tulis Tentang Induk</b>
                </Form.Label>
                <Editor
                  style={{ height: '290px' }}
                  name='description'
                  defaultValue={settingInduk.description}
                  onChange={handleChanges}
                />
              </Form.Group>
              <div className='d-flex'>
                <button type='button' className='btn btn-primary-light ml-auto mr-2' onClick={prevPage}>
                  Batal
                </button>
                <button type='submit' className='btn btn-primary'>
                  Simpan
                </button>
              </div>
            </CardBody>
          </Form>
        </Card>
      )}
    </>
  );
}

export default MainOrganizationListPage;
