import { render, screen } from "@testing-library/react";
import App from "./App";

// PUBLIC_INTERFACE
test("renders dashboard header", () => {
  render(<App />);
  // Header in Layout shows "Kavia Dashboard"
  const title = screen.getByText(/Kavia Dashboard/i);
  expect(title).toBeInTheDocument();
});
