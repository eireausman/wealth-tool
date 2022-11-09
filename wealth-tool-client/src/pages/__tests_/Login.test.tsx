import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";
import * as serverRequests from "../../modules/serverRequests";

afterEach(() => {
  // cleanup on exiting
  jest.clearAllMocks();
});

describe("Login page tests", () => {
  it("Login content renders correctly", async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
    expect(screen.getByTestId("usernameField")).toBeInTheDocument();
    expect(screen.getByTestId("passwordField")).toBeInTheDocument();
    expect(screen.getByTestId("loginButton")).toBeInTheDocument();
  });
  it("Login function fires and login fails", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
    (serverRequests.loginAttempt as jest.Mock) = jest.fn();
    (serverRequests.loginAttempt as jest.Mock).mockResolvedValue({
      requestOutcome: false,
      message: "fail",
    });
    expect(screen.getByTestId("loginButton")).toBeInTheDocument();

    expect(screen.getByTestId("usernameField")).toBeInTheDocument();
    expect(screen.getByTestId("passwordField")).toBeInTheDocument();
    userEvent.type(screen.getByTestId("usernameField"), "12345678");
    userEvent.type(screen.getByTestId("passwordField"), "12345678");

    expect(
      (screen.getByTestId("usernameField") as HTMLInputElement).value
    ).toBe("12345678");
    expect(
      (screen.getByTestId("passwordField") as HTMLInputElement).value
    ).toBe("12345678");

    await act(async () => {
      userEvent.click(screen.getByTestId("loginButton"));
    });
    expect(screen.getByTestId("loginAlertFailureMessage").textContent).toBe(
      "fail"
    );
  });
  it("Login function fires and login succeeds", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
    (serverRequests.loginAttempt as jest.Mock) = jest.fn();
    (serverRequests.loginAttempt as jest.Mock).mockResolvedValue({
      requestOutcome: true,
      message: "success",
    });
    expect(screen.getByTestId("loginButton")).toBeInTheDocument();

    expect(screen.getByTestId("usernameField")).toBeInTheDocument();
    expect(screen.getByTestId("passwordField")).toBeInTheDocument();
    userEvent.type(screen.getByTestId("usernameField"), "12345678");
    userEvent.type(screen.getByTestId("passwordField"), "12345678");

    expect(
      (screen.getByTestId("usernameField") as HTMLInputElement).value
    ).toBe("12345678");
    expect(
      (screen.getByTestId("passwordField") as HTMLInputElement).value
    ).toBe("12345678");

    await act(async () => {
      userEvent.click(screen.getByTestId("loginButton"));
    });
    expect(
      screen.getByTestId("loginAlertSuccessMessage").textContent
    ).toContain("success");
  });
});
