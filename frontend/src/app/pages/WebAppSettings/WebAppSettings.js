import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Row, Tabs, Tab } from 'react-bootstrap';
import { Card, CardBody, CardHeader, CardHeaderToolbar } from '../../../_metronic/_partials/controls';
import Editor from '../../components/Editor';
import ValidationAlert from '../../components/ValidationAlert';
import ShowAlert from '../../libs/ShowAlert';
import WebAppSettingsServices from '../../services/modules/WebAppSettingsServices';
import { useSelector, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export function WebAppSettings() {
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [settings, setSettings] = useState({
    register_price: null,
    kormi_profile: '',
    message_invitation_register: [],
  });
  const [newMessage, setNewMessage] = useState('');
  const [desainKartu, setDesainKartu] = useState({
    desain_kartu: '',
  });
  const [cardDesign, setCardDesign] = useState(null);
  const [cardDesignThumbnail, setCardDesignThumbnail] = useState(null);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roleId = user?.role;
  const history = useHistory();

  const getData = async () => {
    let { data, error } = await WebAppSettingsServices.getSetting();
    if (data) {
      setSettings({
        register_price: data.register_price,
        kormi_profile: data.kormi_profile,
        message_invitation_register: data.message_invitation_register.split('|'),
      });
    }
    if (error) {
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  useEffect(() => {
    getData();
    getDesainKartu();
  }, []);

  const getDesainKartu = async () => {
    let {
      data: {
        settings: { desain_kartu },
      },
    } = await WebAppSettingsServices.getSettingInduk();

    let dataDesainKartu = {
      desain_kartu: '',
    };

    if (desain_kartu) dataDesainKartu.desain_kartu = desain_kartu;
    setDesainKartu(dataDesainKartu);
  };

  const updateDesainKartu = async () => {
    let dataDesainKartu = { ...desainKartu };
    dataDesainKartu.desain_kartu = cardDesign;
    delete dataDesainKartu.logo;
    if (cardDesign === null) {
      delete dataDesainKartu.desain_kartu;
    }
    let { data, error } = await WebAppSettingsServices.updateSettingInduk(dataDesainKartu);
    if (data) {
      getDesainKartu();
      ShowAlert.updated();
    }
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
      setCardDesignThumbnail(thumbnail);
      setCardDesign(file);
    }
  };

  const deleteImage = () => {
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
        if (!desainKartu.desain_kartu) {
          setCardDesign(null);
          setCardDesignThumbnail(null);
          document.getElementById('desain_kartu').value = null;
          history.push('/web-app-settings');
        } else {
          let { message } = await WebAppSettingsServices.deleteSettingIndukImage('desain_kartu');
          if (message == 'Gambar telah dihapus') {
            setCardDesign(null);
            setCardDesignThumbnail(null);
            document.getElementById('desain_kartu').value = null;
            getDesainKartu();
          }
        }
      } else {
        getDesainKartu();
      }
    });
  };

  const prevPage = () => {
    history.goBack();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      saveSettings();
      updateDesainKartu();
    }
  };

  const saveSettings = async () => {
    console.log(settings);
    let updatedSettings = { ...settings };
    updatedSettings.message_invitation_register = updatedSettings.message_invitation_register.join('|');
    let { data, error } = await WebAppSettingsServices.updateSettings(updatedSettings);
    if (data) {
      ShowAlert.updated('Settings Updated');
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  const handleChanges = async (e) => {
    let tempSettings = { ...settings };
    tempSettings[e.target.name] = e.target.value;
    setSettings(tempSettings);
  };

  const onChangeValue = (e, index) => {
    let tempSettings = { ...settings };
    tempSettings.message_invitation_register[index] = e.target.value;
    setSettings(tempSettings);
  };

  const addNewMessage = async (e) => {
    let tempSettings = { ...settings };
    tempSettings.message_invitation_register.push(newMessage);
    setSettings(tempSettings);
    setNewMessage('');
  };

  const removeMessageTextField = (index) => {
    let tempSettings = { ...settings };
    tempSettings.message_invitation_register.splice(index, 1);
    setSettings(tempSettings);
  };

  return (
    <>
      <div className='d-flex mb-6 float-right mb-2'>
        <Link className='btn btn-primary' to='/pengurus' style={{ height: 'max-content' }}>
          Add new pengurus
        </Link>
      </div>

      <Tabs defaultActiveKey='setting' id='uncontrolled-tab-example'>
        <Tab eventKey='setting' title='Pengaturan' style={{ padding: '20px' }}>
          <Card>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className='card-in-form'>
              <CardHeader title='Setting'>
                <CardHeaderToolbar>
                  <Button
                    type='submit'
                    className='btn btn-primary mr-2'
                    // onClick={handleSubmit}
                  >
                    Simpan
                  </Button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {roleId == 0 && (
                  <Form.Group as={Row}>
                    <Form.Label column xl='3' lg='3'>
                      Harga Pendaftaran
                    </Form.Label>
                    <Col xl='9' lg='9'>
                      <Form.Control
                        name='register_price'
                        defaultValue={settings.register_price}
                        placeholder='Masukkan Harga Pendaftaran'
                        onChange={(e) => handleChanges(e)}
                        type='number'
                      />
                      <ValidationAlert state={errors} stateKey='register_price' />
                      <Form.Control.Feedback type='invalid'>Masukkan Harga Pendaftaran</Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                )}

                <Form.Group as={Row}>
                  <Form.Label column xl='3' lg='3'>
                    Profile
                  </Form.Label>
                  <Col xl='9' lg='9'>
                    <Editor name='kormi_profile' defaultValue={settings.kormi_profile} onChange={handleChanges} />
                    <ValidationAlert state={errors} stateKey='kormi_profile' />
                    <Form.Control.Feedback type='invalid'>Masukkan Profil</Form.Control.Feedback>
                  </Col>
                </Form.Group>
                {/* <Form.Group as={Row}>
                  <Form.Label column xl='3' lg='3'>
                    Pesan Ajakan Gabung
                  </Form.Label>
                  <Col xl='9' lg='9'>
                    <Table>
                      <TableBody>
                        {settings.message_invitation_register.map((message, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <input
                                type='text'
                                className='form-control'
                                id='message'
                                onKeyPress={(e) => {
                                  e.key === 'Enter' && e.preventDefault();
                                }}
                                value={message}
                                onChange={(e) => {
                                  e.preventDefault();
                                  onChangeValue(e, index);
                                }}
                                name='message'></input>
                            </TableCell>
                            <TableCell style={{ width: '1%', whiteSpace: 'nowrap' }}>
                              <button
                                className='btn btn-danger'
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeMessageTextField(index);
                                }}>
                                -
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <input
                              type='text'
                              placeholder='Tambahkan pesan baru'
                              className='form-control'
                              id='message'
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                e.key === 'Enter' && e.preventDefault();
                              }}
                              name='message'></input>
                          </TableCell>
                          <TableCell style={{ width: '1%' }}>
                            <button
                              className='btn btn-success'
                              onClick={(e) => {
                                e.preventDefault();
                                addNewMessage();
                              }}>
                              +
                            </button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <ValidationAlert state={errors} stateKey='message_invitation_register' />
                    <Form.Control.Feedback type='invalid'>Masukkan Pesan Ajakan Gabung</Form.Control.Feedback>
                  </Col>
                </Form.Group> */}
              </CardBody>
            </Form>
          </Card>
        </Tab>
        <Tab eventKey='card-design' title='Desain Kartu Anggota' style={{ padding: '20px' }}>
          <Card>
            <Form noValidate onSubmit={handleSubmit} className='card-in-form'>
              <CardBody>
                <div className='upload-btn-wrapper ml-auto mr-auto' style={{ width: '50%' }}>
                  <p style={{ fontSize: '1rem', marginBottom: '3px' }}>
                    <b>Unggah Desain Kartu Anggota</b>
                  </p>
                  <input
                    onChange={(e) => {
                      handleImage(e);
                    }}
                    type='file'
                    name='desain_kartu'
                    id='desain_kartu'
                  />
                  <div className='form-group feature-image-wrapper d-flex'>
                    {cardDesignThumbnail !== null || desainKartu.desain_kartu ? (
                      <div style={{ position: 'relative', maxWidth: '190px' }}>
                        <div onClick={deleteImage} name='desain_kartu' className='btn-delete'>
                          <i name='desain_kartu' className='far fa-trash-alt'></i>
                        </div>
                        <img
                          src={
                            cardDesignThumbnail !== null
                              ? cardDesignThumbnail
                              : desainKartu.desain_kartu
                              ? desainKartu.desain_kartu
                              : null
                          }
                          alt='Logo'
                          className='img-logo'
                        />
                      </div>
                    ) : (
                      <span style={{ alignSelf: 'center', opacity: '0.7' }}>Unggah Foto Utama</span>
                    )}
                    <button
                      className='btn btn-primary d-flex ml-auto'
                      style={
                        desainKartu.desain_kartu || cardDesign !== null ? { height: '40px', marginTop: '20px' } : {}
                      }>
                      Pilih Foto
                    </button>
                  </div>
                  <label htmlFor='logo' className='font-size-sm'>
                    Format foto .JPG, .JPEG Max 2MB; disarankan resolusi gambar 1024x620 px;
                  </label>
                  <div className='d-flex mt-10'>
                    <button type='button' className='btn btn-primary-light ml-auto mr-2' onClick={prevPage}>
                      Batal
                    </button>
                    <button type='submit' className='btn btn-primary mr-auto'>
                      Simpan
                    </button>
                  </div>
                </div>
              </CardBody>
            </Form>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
}

export default WebAppSettings;
