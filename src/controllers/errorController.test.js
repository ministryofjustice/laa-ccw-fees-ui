import { showGenericErrorPage } from "./errorController";

describe("showGenericErrorPage", () => {
  let req = {};
  let res = {
    render: jest.fn(),
  };

  it("should render start page", () => {
    showGenericErrorPage(req, res);

    expect(res.render).toHaveBeenCalledWith("main/error", {
      error: "An error occurred.",
      status: "An error occurred",
    });
  });
});
