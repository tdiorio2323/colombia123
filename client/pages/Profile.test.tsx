import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfilePage from "./Profile";

describe("ProfilePage", () => {
  it("displays title and disabled message", () => {
    render(<ProfilePage />);
    expect(screen.getByText("User Profiles")).toBeDefined();
    expect(
      screen.getByText(
        "Supabase is currently disabled, so no profiles are being fetched.",
      ),
    ).toBeDefined();
  });

  it("does not show loading state since Supabase is disabled", () => {
    render(<ProfilePage />);
    expect(screen.queryByText("Loading...")).toBeNull();
  });

  it("displays disabled message in list", () => {
    render(<ProfilePage />);
    expect(
      screen.getByText("No profiles to display (Supabase disabled)."),
    ).toBeDefined();
  });

  it("renders the list element with single disabled item", () => {
    render(<ProfilePage />);
    const list = screen.getByRole("list");
    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain(
      "No profiles to display (Supabase disabled).",
    );
  });
});
