import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase BEFORE importing modules that use it
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from "./Profile";
import { supabase } from "@/lib/supabase";

const mockProfiles = [
  { id: "1", username: "testuser1" },
  { id: "2", username: "testuser2" },
];

// Use vi.mocked to get a typed mock object
const mockedSupabase = vi.mocked(supabase, true);

describe("ProfilePage", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("displays loading state initially", () => {
    // Mock a pending promise to keep it in a loading state
    mockedSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue(new Promise(() => {})),
    } as any);

    render(<ProfilePage />);
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("fetches and displays profiles successfully", async () => {
    mockedSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockProfiles, error: null }),
    } as any);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
      expect(screen.getByText("testuser1")).toBeDefined();
      expect(screen.getByText("testuser2")).toBeDefined();
    });
  });

  it("handles error when fetching profiles and logs to console", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchError = new Error("Failed to fetch");

    mockedSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: fetchError }),
    } as any);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching profiles:", fetchError);
    expect(screen.queryByText("testuser1")).toBeNull();

    consoleSpy.mockRestore();
  });

  it('displays nothing if data is empty', async () => {
    mockedSupabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    const list = screen.getByRole('list');
    expect(list.children.length).toBe(0);
  });
});
