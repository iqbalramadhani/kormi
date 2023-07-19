import React, { useEffect, useState } from "react";
import Chart from "./Components/Chart/Chart";
import { makeStyles, Paper, Grid } from '@material-ui/core';
import { DashboardServices } from "../services";
import StackedColumnChart from "../components/StackedColumnChart";
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  Table,
  Input
} from "reactstrap"

import BootstrapTable from "react-bootstrap-table-next";
import SVG from "react-inlinesvg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paper_left: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  header_class: {
    background: '#F8F9FA'
  }
}));

export function DashboardPage() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filter, setFilter] = React.useState({});
  const [sort, setSort] = React.useState({});
  const [totalData, setTotalData] = useState(0);
  const [data, setData] = React.useState({
    all_user: 0,
    app_current_month: 0,
    active_user: 0,
    chart_app_per_month: {},
    chart_apex: {},
    chart_data: [],
    chart_labels: [],
  });
  const [lastLogin, setLastLogin] = React.useState([]);
  const [years, setYears] = useState(true)
  const [month, setMonth] = useState(false)
  const [week, setWeek] = useState(false)
  const [analityc, setAnalityc] = useState("")

  const getData = async () => {
    let { data, error } = await DashboardServices.browse({
      analytic_duration: analityc,
    });
    if (data) {
      setData(data);
      setLastLogin(data.last_login);
    }
  };

  useEffect(() => {
    getData()
  }, [analityc]);

  // console.log(data)
  // console.log(analityc)

  const handleAnalityc = () => {}

  const reports = [
    { title: "Jumlah Anggota Terdaftar", iconClass: "/media/kormi/icons/terdaftar.svg", description: `${data.all_user}` },
    {
      title: "Penambahan Anggota Bulan ini",
      iconClass: "/media/kormi/icons/bulan.svg",
      description: `${data.app_current_month}`,
    },
    {
      title: "Anggota Aktif Saat ini",
      iconClass: "/media/kormi/icons/aktif.svg",
      description: `${data.active_user}`,
    },
  ]

  const date = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const classes = useStyles();

  const users = [
    {id: 1, name: 'Neal Matthews', date: 'Aktif 3 Menit yg lalu'},
    {id: 2, name: 'John Doe', date: 'Aktif 24 Menit yg lalu'},
    {id: 3, name: 'Mark Markoni', date: 'Aktif 1 Jam yg lalu'},
    {id: 4, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 5, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 6, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 7, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 8, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 9, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 10, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 11, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 12, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
    {id: 13, name: 'Sino Matilda', date: 'Aktif 2 Jam yg lalu'},
  ]

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true,
      sort: true,
    },
    {
      dataField: 'pesantren',
      text: 'Anggota Aktif',
      sort: true,
    },
    {
      dataField: 'time',
      text: 'Tanggal',
      sort: true,
    }
  ]

  return (
    <>
    <div className={classes.root}>
      {/* <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <h4>Total User Terdaftar</h4>
            <h1 style={{fontSize: '48px', color: '#4770FF'}}>{data.all_user}</h1>
            <h5>{data.current_user_count} + User</h5>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <div style={{height: '8.9rem'}}>
              <h4>Penambahan User Bulan ini</h4>
              <h1 style={{fontSize: '48px', color: '#4770FF'}} className="number-style">{data.app_current_month}</h1>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
          <div style={{height: '8.9rem'}}>
            <h4>User Aktif Saat ini</h4>
            <h1 style={{fontSize: '48px', color: '#4770FF'}} className="number-style">{data.active_user}</h1>
          </div>
          </Paper>
        </Grid>
      </Grid> */}
      <Row className="mb-4">
        {/* Reports Render */}
        {reports.map((report, key) => (
          <Col md="4" key={"_col_" + key}>
            <Card className="mini-stats-wid">
              <CardBody>
                <Media>
                  <Media body>
                    <p className="text-muted fw-medium">
                      {report.title}
                    </p>
                    <h4 className="mb-0">{report.description}</h4>
                  </Media>
                  <div className="mini-stat-icon avatar-sm align-self-center">
                    <span className="avatar-title" style={{background: '#fff'}}>
                      {/* <i style={{color: 'white'}}
                        className={
                          "bx " + report.iconClass + " font-size-24"
                        }
                      /> */}
                      <SVG src={report.iconClass} />
                    </span>
                  </div>
                </Media>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      {/* <Grid className='mt-2' container spacing={1}>
        <Grid item xs={12} sm={8}>
          <Paper className={classes.paper_left}>
            <h1>Analytic</h1>
            <small>
              as of {date.getDate()} {months[date.getMonth()]}{" "}
              {date.getFullYear()}, {date.getHours()}:{date.getMinutes()} PM
            </small>
            <p style={{ color: "#4770FF" }} className="my-3">
              Bertambah {data.current_user_count} User hari ini
            </p>
            <div className="px-3">
              <Chart data={data.chart_app_per_month} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper_left}>
            <div style={{ overflowY: "scroll", maxHeight: '60vh' }}>
            <h1>Last Login</h1>
            {lastLogin.map(login => {
              return(
              <p key={login.pesantren}>
              {login.pesantren}
              <span className="text-black-50">({login.time})</span>
            </p>
              )
            })}
          </div>
          </Paper>
        </Grid>
      </Grid> */}
      <Row>
        <Col md={8}>
      <Card>
        <CardBody>
          <div className="d-sm-flex flex-wrap">
            <div className="ms-auto">
              <ul className="nav nav-pills">
                  <li className="nav-item">
                    <Link className={
                        week ? "nav-link active" : "nav-link"
                      } onClick={() => {
                        setAnalityc("w")
                        setWeek(true)
                        setMonth(false)
                        setYears(false)
                      }} >
                      Minggu
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={
                        month ? "nav-link active" : "nav-link"
                      } onClick={() => {
                        setAnalityc("m")
                        setWeek(false)
                        setMonth(true)
                        setYears(false)
                      }} >
                      Bulan
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={
                        years ? "nav-link active" : "nav-link"
                      } onClick={() => {
                        setAnalityc("")
                        setWeek(false)
                        setMonth(false)
                        setYears(true)
                      }} >
                      Tahun
                    </Link>
                  </li>
              </ul>
            </div>
          </div>
          <div className="clearfix" />
          <StackedColumnChart dataLabels={data.chart_labels} dataBarChart={data.chart_data} />
        </CardBody>
      </Card>
        </Col>
        <Col md={4}>
        <Card>
          <CardBody>
            <CardTitle className="card-title mb-4 h4">
              Last Login
            </CardTitle>
            <div style={{overflowY: 'scroll', maxHeight: '380px'}}>
              <BootstrapTable bordered={ false } headerClasses={classes.header_class} keyField='id' columns={columns} data={lastLogin} bootstrap4 />
            </div>
          </CardBody>
        </Card>
        </Col>
      </Row>
    </div>
  </>
  )
}
