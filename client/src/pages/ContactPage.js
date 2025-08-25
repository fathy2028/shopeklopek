import React from "react";
import Layout from "./../components/Layout/Mylayout";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
import contact from "../images/contact.jpeg"
const ContactPage = () => {
  return (
    <Layout title={"Contact us - Queen Pharmacy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src={contact}
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about product feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 01007150979
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 01110094702
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
