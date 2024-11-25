import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GuestMeeting from "../components/TwilioVideo/GuestMeeting";
import { startMeeting } from "../services/videoService";

// Mock the startMeeting function
jest.mock("../services/videoService");

const MockGuestMeeting = () => (
  <Router>
    <GuestMeeting />
  </Router>
);

// Mock MediaRecorder and getUserMedia for tests to avoid breaking on missing functionality
beforeAll(() => {
  global.MediaRecorder = jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    ondataavailable: jest.fn(),
    onstop: jest.fn(),
  }));

  global.MediaRecorder.isTypeSupported = jest.fn().mockReturnValue(true);

  // Mock getUserMedia properly with mediaDevices
  global.navigator.mediaDevices = global.navigator.mediaDevices || {};
  global.navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue({
    getTracks: () => [{ stop: jest.fn() }], // Mock implementation for getTracks
  });
});

afterAll(() => {
  delete global.MediaRecorder;
  delete global.navigator.mediaDevices.getUserMedia;
});

describe("GuestMeeting Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<MockGuestMeeting />);
  });

  // Test case for trying to join without a room name
  test("should display an error if trying to join without a room name", async () => {
    const joinButton = screen.getByRole("button", { name: /Join Meeting/i });

    await act(async () => {
      fireEvent.click(joinButton);
    });

    expect(
      await screen.findByText(/Please enter a valid room name before joining the meeting./i)
    ).toBeInTheDocument();
  });

  // Test case for non-existent or ended room
  test("should display an error for a non-existent or ended room", async () => {
    startMeeting.mockRejectedValueOnce({ response: { status: 404 } });

    const roomInput = screen.getByPlaceholderText(/Enter the invitation's link/i);
    const joinButton = screen.getByRole("button", { name: /Join Meeting/i });

    await act(async () => {
      fireEvent.change(roomInput, { target: { value: "InvalidRoom" } });
      fireEvent.click(joinButton);
    });

    // Use findByText to wait for the error message
    expect(
      await screen.findByText(
        /The meeting room you're trying to join doesn't exist or has already ended. Please verify the room name or link and try again./i
      )
    ).toBeInTheDocument();
  });

  // Test case for internal server error
  test("should display an error when an internal server error occurs", async () => {
    startMeeting.mockRejectedValueOnce({ response: { status: 500 } });

    const roomInput = screen.getByPlaceholderText(/Enter the invitation's link/i);
    const joinButton = screen.getByRole("button", { name: /Join Meeting/i });

    await act(async () => {
      fireEvent.change(roomInput, { target: { value: "ValidRoom" } });
      fireEvent.click(joinButton);
    });

    // Use findByText to wait for the error message
    expect(
      await screen.findByText(
        /An internal issue occurred while joining the meeting. Please try again in a few moments./i
      )
    ).toBeInTheDocument();
  });

  // Test case for successfully joining a meeting
  test("should successfully join the meeting and display success message", async () => {
    startMeeting.mockResolvedValueOnce("mockToken");

    const roomInput = screen.getByPlaceholderText(/Enter the invitation's link/i);
    const joinButton = screen.getByRole("button", { name: /Join Meeting/i });

    await act(async () => {
      fireEvent.change(roomInput, { target: { value: "ValidRoom" } });
      fireEvent.click(joinButton);
    });

    // Use findByText to ensure the "You have successfully joined the meeting!" message appears
    expect(await screen.findByText(/You have successfully joined the meeting!/i)).toBeInTheDocument();
  });
});
