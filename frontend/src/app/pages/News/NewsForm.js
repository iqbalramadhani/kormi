import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table, Card } from "react-bootstrap";
import Editor from "../../components/Editor";
import ValidationAlert from "../../components/ValidationAlert";
import uploadFileToBase64 from "../../libs/uploadFileToBase64";
import Select from "react-select";
import { NewsServices, MasterServices } from "../../services";
import * as _ from 'lodash';
import ShowAlert from "../../libs/ShowAlert";
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';

export function NewsForm(props) {
  // console.log(props)
  const [displayImage, setDisplayImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [imagesThumbnail, setImagesThumbnail] = useState([]);
  const [images, setImages] = useState([]);
  const history = useHistory();

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['jpg', 'png', 'jpeg'];
    let check = allowedExtensions.some(ext => file.name.includes(ext));
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
      setDisplayImage(URL.createObjectURL(file));
      const newData = { ...props.data };
      newData.image = file;
      document.getElementById('feature-image-wrapper').style.cssText = 'border-color: #B9B9B8';
      document.getElementById('invalid-feature-image').style.cssText = 'display: none'; 
      props.onChange(newData);
    }
  };

  let fileArray = [];
  let fileArrayThumbnail = [];
  
  const handleMultipleImages = (e) => {
    let files  = e.target.files;
    console.log(files)

    fileArray = images;
    fileArrayThumbnail = imagesThumbnail;
    
    if (
        props.data.news_files && (Object.keys(props.data.news_files).length > 0 && (props.data.news_files.length > 5 || files.length + props.data.news_files.length > 5))
        || (files.length > 5 || files.length + imagesThumbnail.length > 5)
      ) {
        ShowAlert.failed('Galeri maksimal berisi 5 foto');
    } else {
      files.forEach(img => {
        if (!img.type.includes('image/')) {
          ShowAlert.failed('File selain gambar tidak diperbolehkan');
          setImagesThumbnail(fileArrayThumbnail);
          return
        } else if (img.size > 2097152) {
          ShowAlert.warning("Ukuran gambar tidak boleh lebih dari 2 MB");
          setImagesThumbnail(fileArrayThumbnail);
          return;
        } else {
          fileArray.push(img);
          fileArrayThumbnail.push(URL.createObjectURL(img))
        }
      })
      setImagesThumbnail(fileArrayThumbnail);
      setImages(fileArray);

      const newData = { ...props.data };
      newData['galleries[]'] = images;
      props.onChange(newData);
      if (props.data.id) {
        history.push(`/news/${props.data.id}/update`);
      } else {
        history.push('/news/create');
      }
    }
  }

  const deleteImage = (idx, id) => {
    Swal.fire({
      title: 'Hapus Gambar',
      text:  'Gambar akan dihapus, lanjutkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batalkan',
    }).then(async (result) => {
      if (result.value) {
        if (id !== undefined) {
          const { data, error, message } = await NewsServices.deleteGallery(id);
          if (data) {
            ShowAlert.deleted(message);
          }
  
          if (error) {
            ShowAlert.warning(message);
          }
        }
        let tempImagesThumbnail = imagesThumbnail;
        setImagesThumbnail(tempImagesThumbnail.filter((item, i) => i !== idx));

        if (props.data.news_files !== undefined) {
          let temp = props.data.news_files;
          temp = temp.filter((item, i) => i !== idx);
          let newData = {...props.data, news_files: temp};
          props.onChange(newData);
        }
      }
    })
  }

  const handleChanges = async (e, name = null) => {
    let property = name
      ? name
      : e
      ? e.target
        ? e.target.name
          ? e.target.name
          : ""
        : ""
      : "";
    let value = e.value ? e.value : e.target.value;
    const newData = { ...props.data };
    newData[property] = value;
    props.onChange(newData);
  };

  const handleSubmit = (is_publish = 1) => {
    const newData = { ...props.data };
    // console.log(is_publish, newData);
    if (newData.title && newData.category && newData.tags && newData.location && newData.image) {
      newData['is_publish'] = is_publish;
    } else {
      newData['is_publish'] = -1;
    }
    // console.log(newData)
    if ((newData.image == undefined || newData.image == null) && (newData.displayImage == undefined || newData.displayImage == null)) {
      document.getElementById('feature-image-wrapper').style.cssText = 'border-color: #F64E60';
      document.getElementById('invalid-feature-image').style.cssText = 'display: block';
    }
    props.onChange(newData);
  };

  const getCategories = async (search = "") => {
    let { data } = await NewsServices.category();
    if (data) {
      let list = [];
      for (var i = 0; i < data.length; i++) {
        let l = { value: data[i], label: data[i] };
        list.push(l);
      }
      setCategories(list);
    }
  };

  const getCities = async (search = "") => {
    let { data } = await MasterServices.browseCity({
      search: search ? search : "",
      selectedForm: 1,
    });
    if (data) {
      setCities(data);
    }
  };

  const getSelected = (list, selectedValue) => {
    const index = _.findIndex(list, function(o) { return o.value == selectedValue; });
    return index !== -1 ? list[index] : null;
  }

  const getPropsData = () => {
    if (props.data.news_files !== undefined && !Array.isArray(props.data.news_files[0])) 
      setImagesThumbnail(props.data.news_files);
  }
  
  useEffect(() => {
    getCategories();
    getCities();
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
  }, []);

  return (
    <div className="row" onLoad={getPropsData}>
      <div className="col-md-8">
        <Form.Group>
          <Form.Label className="required">
            Judul Berita
          </Form.Label>
          <Form.Control
            name="title"
            defaultValue={props.data.title}
            placeholder="Masukkan Judul Berita"
            onChange={(e) => handleChanges(e)}
            required
          />
          <ValidationAlert state={props.errors} stateKey="title" />
          <Form.Control.Feedback type="invalid">
            Masukkan Judul Berita
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label className="required">Kategori</Form.Label>
          <Select
            name="category"
            options={categories}
            onChange={(e) => handleChanges(e, "category")}
            value={getSelected(categories, props.data.category)}
            required
          />
          <ValidationAlert state={props.errors} stateKey="category" />
          <Form.Control.Feedback type="invalid">
            Masukkan Kategori Berita
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label className="required">
            Tag Berita
          </Form.Label>
          <Form.Control
            name="tags"
            defaultValue={props.data.tags}
            placeholder="Masukkan Tags"
            onChange={(e) => handleChanges(e)}
            required
          />
          <ValidationAlert state={props.errors} stateKey="tags" />
          <Form.Control.Feedback type="invalid">
            Masukkan Tag Berita
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label className="required">Lokasi</Form.Label>
          <Select
            name="location"
            options={cities}
            onChange={(e) => handleChanges(e, "location")}
            value={getSelected(cities, props.data.location)}
            placeholder="Masukkan Lokasi"
            required
          />
          <ValidationAlert state={props.errors} stateKey="location" />
          <Form.Control.Feedback type="invalid">
            Masukkan Lokasi
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label className="required">Unggah Foto Utama Berita</Form.Label>
          <div className="upload-btn-wrapper">
            <input
              onChange={(e) => {
                handleUploadFile(e);
              }}
              type="file"
              name="logo"
              id="logo"
              accept="image/*"
              required={props.data.displayImage || displayImage ? false : true}
            />
            <div id="feature-image-wrapper" className="form-group feature-image-wrapper d-flex">
              {
                displayImage ? (
                  <div style={{position: "relative", maxWidth: "190px"}}>
                    {/* <div 
                      onClick={deleteImage}
                      name="logo" 
                      className="btn-delete">
                      <i name="logo" className="far fa-trash-alt"></i>
                    </div> */}
                    <img 
                      src={displayImage} alt="Logo" 
                      className="img-logo"/>
                  </div>
                ) : props.data.displayImage ? (
                  <div style={{position: "relative", maxWidth: "190px"}}>
                    {/* <div 
                      onClick={deleteImage}
                      name="logo" 
                      className="btn-delete">
                      <i name="logo" className="far fa-trash-alt"></i>
                    </div> */}
                    <img 
                      src={props.data.displayImage} alt="Logo" 
                      className="img-logo"/>
                  </div>
                ) : (
                  <span style={{alignSelf: 'center', opacity: '0.7'}}>
                    Unggah Foto Utama
                  </span>
                )
              }
              <button
                className="btn btn-primary d-flex ml-auto"
                style={
                  (props.data.displayImage || displayImage) ?
                  {height: "40px", marginTop: "20px", cursor: 'pointer'}
                  : {cursor: 'pointer'}
                }
              >
                Pilih Foto
              </button>
            </div>
            <div id="invalid-feature-image" className="invalid-feedback" style={{display: 'none'}}>Unggah Foto Utama</div> 
            <label htmlFor="logo" className="font-size-sm">Format foto .JPG, .JPEG, .PNG Max 2MB; disarankan resolusi gambar 1024x620 px;</label>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            URL Video
          </Form.Label>
          <Form.Control
            name="video_url"
            defaultValue={props.data.video_url}
            placeholder="Masukkan URL Video"
            onChange={(e) => handleChanges(e)}
          />
          <ValidationAlert state={props.errors} stateKey="video_url" />
        </Form.Group>
        <Row>
          <Col sm="12">
            <Form.Label>
              Text Editor
            </Form.Label>
            <Editor
              name="description"
              defaultValue={props.data.description}
              onChange={handleChanges}
            />
            <ValidationAlert state={props.errors} stateKey="description" />
          </Col>
        </Row>
      </div>
      <div className="col-md-4">
        <Card style={{marginBottom: '50px'}}>
          <Card.Header align="center">UNGGAH FOTO GALERI</Card.Header>
          <Card.Body>
            <div className="upload-btn-wrapper">
              <input
                accept="image/*"
                onChange={(e) => {
                  handleMultipleImages(e);
                }}
                type="file"
                name="news_files"
                id="file"
                multiple
              />
              <button
                className="btn btn-primary mb-5"
                style={{width: '100%'}}
              >
                Pilih File
              </button>
              <label htmlFor="news_files" className="font-size-sm">Max. 5 gambar & Max. 2MB tiap gambar; Disarankan resolusi gambar 1024x620 px;</label>
              <div className="form-group row">
                {imagesThumbnail.map((item, idx) => {
                  return (
                    <div className="col-md-4">
                      <div onClick={() => deleteImage(idx, item.id)} className="btn-delete">
                        <i className="far fa-trash-alt"></i>
                      </div>
                      <img src={typeof item == 'object' ? item.file_url : item} alt="..." className="img-multiple"/>
                    </div>
                  )
                })}
              </div> 
            </div>
          </Card.Body>
        </Card>

        <Card style={{marginBottom: '50px'}}>
          <Card.Header align="center">PUBLIKASI BERITA</Card.Header>
          <Card.Body>
            <p className="font-size-sm">Silakan pilih pilihan publikasi berita. 
              Anda dapat <b className="font-size-sm">publikasi</b> berita ke website portal 
              atau dapat menyimpannya terlebih dahulu sebagai <b className="font-size-sm">draft</b>.
            </p>
            <div className="news-status">
            Status saat ini: {
              props.data.is_publish == 1 ? <b style={{color: "#6EB64C"}}>Publikasi</b> 
              : props.data.is_publish == 0 ? <i><b>Draft</b></i>
              : <b>-</b>}
            </div>
            <button
              onClick={() => {handleSubmit(1)}}
              className="btn btn-primary mb-5"
              style={{width: '100%'}}
            >
              PUBLIKASI BERITA
            </button>
            <button
              onClick={() => {handleSubmit(0)}}
              className="btn btn-primary-light mb-5"
              style={{width: '100%'}}
            >
              SIMPAN SEBAGAI DRAFT
            </button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default NewsForm;
