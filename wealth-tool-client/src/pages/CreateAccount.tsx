import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERNAMEMIN, PASSWORDMIN } from "../modules/publicEnvVariables";
import {
  createAccountFormData,
  createAccountServerResponse,
} from "../../../types/typeInterfaces";
import { createAccountAttempt } from "../modules/serverRequests";
import { motion } from "framer-motion";
import "./CreateAccount.css";
import CardSpinner from "../components/CardSpinner";

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState<createAccountFormData>({
    username: "",
    password: "",
  });
  const [formSubmitResponse, setFormSubmitResponse] =
    useState<createAccountServerResponse>({});
  const [showResponseMessage, setshowResponseMessage] =
    useState<boolean>(false);
  const [showSpinner, setshowSpinner] = useState<boolean>(false);

  const updateFormDataState = (e: React.FormEvent<EventTarget>) => {
    const formDataCopy: createAccountFormData = { ...formData };
    const target = e.target as HTMLInputElement;

    const fieldName =
      target.getAttribute("name") ??
      (target.getAttribute("name") as keyof typeof FormData);
    formDataCopy[fieldName] = target.value;
    setFormData(formDataCopy);
  };

  const navigate = useNavigate();
  const createAccountRedirect = () => {
    // navigate("/");
    console.log("redirect initiated");
  };

  const submitFormData = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    // reset all relevant states ready for new server response
    setshowSpinner(true);
    setFormSubmitResponse({});
    setshowResponseMessage(false);
    const serverResponse = await createAccountAttempt(formData);
    setshowSpinner(false);
    setFormSubmitResponse(serverResponse);
    setshowResponseMessage(true);
    if (serverResponse.requestOutcome === true) {
      setTimeout(createAccountRedirect, 2000);
    }
  };

  return (
    <div className="form-container">
      <motion.form
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        method="POST"
        className="column-form createAccountForm"
        onSubmit={submitFormData}
      >
        <div className="createAccountFormInputRow">
          <label>
            Username
            <input
              className="createAccountFormInputField"
              name="username"
              minLength={USERNAMEMIN}
              required
              type="text"
              value={formData.username}
              onChange={updateFormDataState}
            />
          </label>
        </div>
        <div className="createAccountFormInputRow">
          <label>
            Password
            <input
              className="createAccountFormInputField"
              name="password"
              minLength={PASSWORDMIN}
              required
              type="text"
              value={formData.password}
              onChange={updateFormDataState}
            />
          </label>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          type="submit"
          className="buttonPrimary buttonCreateAccount"
        >
          Submit Details
        </motion.button>
      </motion.form>
      {showSpinner === true && (
        <CardSpinner cardTitle={"Creating Account... please wait...."} />
      )}
      {showResponseMessage === true &&
        formSubmitResponse.requestOutcome === false && (
          <div className="alertFailure createAccountAlertFailure">
            {formSubmitResponse.message}
          </div>
        )}
      {showResponseMessage === true &&
        formSubmitResponse.requestOutcome === true && (
          <div className="alertSuccess createAccountAlertSuccess">
            {formSubmitResponse.message}. If not redirected, please{" "}
            <Link to="/">click here.</Link>
          </div>
        )}
      <p className="loginLinkText">
        <Link to="/login">Already have an account? Click here to log in.</Link>
      </p>
    </div>
  );
};

export default CreateAccount;
