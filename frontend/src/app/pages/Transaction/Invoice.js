import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import {Table, Col, Row} from "react-bootstrap";
import { TransactionServices } from "../../services";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export function TransactionInvoicePage(props) {
  const [invoice, setInvoice] = useState({});
  const [previousPage, setPreviousPage] = useState({
    redirect: false,
    route: "/transaction",
  });
  
  const getInvoice = async () => {
    if (props.match.params.order_id.includes('EVENT')) {
      let { data } = await TransactionServices.eventDetail({
        order_id: props.match.params.order_id
      });
      if (data) {
        setInvoice(data);
      }
    } else {
      let { data } = await TransactionServices.registerDetail({
        order_id: props.match.params.order_id
      });
      if (data) {
        setInvoice(data);
      }
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const prevPage = () => {
    const redirect = { ...previousPage, redirect: true };
    setPreviousPage(redirect);
  }

  const idCurrency = (value) => {
    if (value !== null && value !== undefined) {
      return (value).toLocaleString('id-ID');
    }
    return 0;
  };

  useEffect(() => {
    getInvoice();
  }, []);

  return (
    <>
      {previousPage.redirect ? (
        <Redirect to={previousPage.route} />
      ) : (
        <Card>
          <CardHeader title={`Nomor Invoice #${invoice.invoice_id}`} className="ml-auto"/>
          <CardBody>
            <Row>
              <Col xs="6" className="mt-3">
                <address>
                  <strong>Nama Customer:</strong>
                  <br />
                  {invoice.admin_name}
                  <br />
                  {invoice.admin_role}
                  <br />
                  {invoice.city}
                </address>
              </Col>
              {/* <Col xs="6" className="mt-3 text-right">
                <address>
                  <strong>Order Date:</strong>
                  <br />
                  {invoice.orderDate}
                  <br />
                  <br />
                </address>
              </Col> */}
            </Row>
            <div className="py-2 mt-3">
              <h3 className="font-size-15 fw-bold">
                Detail Transaksi
              </h3>
            </div>
            <div className="table-responsive">
              <Table className="table-nowrap">
                <thead>
                  <tr className="invoice-tr">
                    <th style={{ width: "70px" }}>No.</th>
                    <th>Nama</th>
                    {
                      props.match.params.order_id.includes('EVENT') && (
                        <th>Judul Acara</th>
                      )
                    }
                    <th className="text-right">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    invoice.users !== undefined && invoice.users.map((item, key) => (
                      <tr className="invoice-tr" key={key}>
                        <td>{key+1}</td>
                        <td>{item.name}</td>
                        <td className="text-right">Rp {idCurrency(item.price)}</td>
                      </tr>
                    ))}
                  {
                    invoice.user !== undefined && (
                      <tr className="invoice-tr">
                        <td>1</td>
                        <td>{invoice.user.name}</td>
                        <td>{invoice.event.title}</td>
                        <td className="text-right">Rp {idCurrency(invoice.event.price)}</td>
                      </tr>
                    )
                  }
                  {
                    !props.match.params.order_id.includes('EVENT') && (
                      <tr className="invoice-tr">
                        <td colSpan="2" className="text-right">
                          Sub Total
                        </td>
                        <td className="text-right">
                          Rp {idCurrency(invoice.sub_total)}
                        </td>
                      </tr>
                    )
                  }
                  {/* <tr className="invoice-tr">
                    <td colSpan="2" className="border-0 text-right">
                      <strong>Shipping</strong>
                    </td>
                    <td className="border-0 text-right">
                      {invoice.orderSummary.shipping}
                    </td>
                  </tr> */}
                  <tr className="invoice-tr">
                    <td colSpan={props.match.params.order_id.includes('EVENT') ? '3' : '2'} className="border-0 text-right">
                      <strong>Total</strong>
                    </td>
                    <td className="border-0 text-right">
                      <h4 className="m-0">
                        Rp {props.match.params.order_id.includes('EVENT') && invoice.event !== undefined ? idCurrency(invoice.event.price) : idCurrency(invoice.grandtotal)}
                      </h4>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="d-print-none">
              <div className="float-right">
                <Link
                  to="#"
                  onClick={printInvoice}
                  className="btn btn-success mr-2"
                >
                  <i className="fa fa-print" />
                </Link>
                <Link
                  to="#"
                  onClick={prevPage}
                  className="btn btn-primary w-md "
                >
                  Kembali
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  )
  
}

export default TransactionInvoicePage;