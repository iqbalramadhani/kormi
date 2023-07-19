import { CardMembershipRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ShowAlert from "../../libs/ShowAlert";
import ShowToast from "../../libs/ShowToast";
import { UserServices } from "../../services";
import BulkMemberForm from "./BulkMemberForm";

export function MemberBulkCreatePage(props) {
  const [formData, setFormData] = useState({});

  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/member",
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({});
  const [validated, setValidated] = useState(false);
  const [members, setMembers] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {}, []);

  const handleFormDataChanges = async function(changes) {
    await setMembers(changes, members);
  };

  const handleSubmit = async () => {
    let { data, error } = await UserServices.bulkAdd({
      users: JSON.stringify(members),
    });
    if (data) {
      setResponse(data)
      setSuccess(true)
    }
    if (error) {
      setErrors(error);
      if (error.message) ShowAlert.failed(error.message);
    }
  };

  return (
    <>
        <div style={!success ? {display:"none"} : null}>
          <Card>
              <CardHeader title="Pemberitahuan">
                <CardHeaderToolbar>
                  <button
                    type="button"
                    className="btn btn-success mr-2"
                    onClick={() => {
                      // window.open()
                      setPreviousPage({ ...previousPage, redirect: true });
                    }}
                  >
                    Pergi Ke List Anggota
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <label style={{color:"red"}}>Total Data Bermasalah : {response.message_error ? response.message_error.length : 0}</label>
                <ul>
                {response.message_error ? response.message_error.map((m) => (
                    <li>{m.subject} : {m.text}</li>
                )): null}  
                </ul>
                <br></br>
                <label style={{color:"green"}}>Total Data Berhasil : {response.message_success ? response.message_success.length : 0}</label>
                <ul>
                  {response.message_success ? response.message_success.map((ms) => (
                    <li>{ms}</li>
                  )): null}
                </ul>
                <br></br>
                
                {response.payment == undefined || response.payment.link == "" ? <div><Button
                    className="btn btn-warning mr-2"
                    onClick={(e) => {setSuccess(false)}}
                  >
                    Koreksi data
                </Button>
                <label style={{color:"red"}}>*tidak ada pembayaran yang bisa dilakukan</label> 
                </div>: <Button
                    className="btn btn-primary mr-2"
                    onClick={(e) => {if(response.payment)window.open(response.payment.link)}}
                  >
                    Lanjutkan Pembayaran
                </Button>}
              </CardBody>
            </Card>    
        </div>
     <div style={success ? {display:"none"} : null}>
        {previousPage.redirect ? (
            <Redirect to={previousPage.route} />
          ) : (
            <Card>
              <CardHeader title="Tambah Anggota">
                <CardHeaderToolbar>
                  <button
                    type="button"
                    className="btn btn-success mr-2"
                    onClick={() => {
                      // window.open()
                      setPreviousPage({ ...previousPage, redirect: true });
                    }}
                  >
                    Batal
                  </button>
                  <Button
                    type="submit"
                    className="btn btn-primary mr-2"
                    onClick={handleSubmit}
                  >
                    Simpan
                  </Button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <BulkMemberForm
                  data={formData}
                  errors={errors}
                  onChange={setMembers}
                />
              </CardBody>
            </Card>    
      )}
      </div>
    </>
  );
}

export default MemberBulkCreatePage;
