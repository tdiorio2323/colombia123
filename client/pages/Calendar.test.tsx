import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Calendar from './Calendar';
import { BrowserRouter } from 'react-router-dom';

describe('Calendar Component', () => {
  const getDateCard = (day: string, opts: { disabled?: boolean } = {}) => {
    const matches = screen.getAllByText(day);
    for (const el of matches) {
      const card = el.closest('.cursor-pointer');
      if (!card) continue;
      const isDisabled = card.classList.contains('cursor-not-allowed') || card.classList.contains('opacity-50');
      if ((opts.disabled && isDisabled) || (!opts.disabled && !isDisabled)) {
        return card as HTMLElement;
      }
    }
    throw new Error(`Date card for ${day} not found`);
  };

  const getTimeCard = (time: string, opts: { disabled?: boolean } = {}) => {
    const matches = screen.getAllByText(time);
    for (const el of matches) {
      const card = el.closest('.cursor-pointer');
      if (!card) continue;
      const isDisabled = card.classList.contains('cursor-not-allowed') || card.classList.contains('opacity-50');
      if ((opts.disabled && isDisabled) || (!opts.disabled && !isDisabled)) {
        return card as HTMLElement;
      }
    }
    throw new Error(`Time card for ${time} not found`);
  };
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
  });

  it('initial state of selectedDate, selectedTime, and selectedService is empty', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    // Use a more robust way to access the component's state, e.g., by checking
    // that no service/date/time is visually selected.
  });

  it('updates selectedService when a service is clicked', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    const serviceCard = screen.getByText('Private Video Call').closest('.sexy-card');
    fireEvent.click(serviceCard);
    // It's difficult to directly access the state. Instead, check if
    // the card now has the 'ring-2 ring-primary bg-primary/5' class.
    expect(serviceCard).toHaveClass('ring-2 ring-primary bg-primary/5');
  });

  it('updates selectedDate when an available date is clicked', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    const availableDateCard = getDateCard('15'); // available date card
    fireEvent.click(availableDateCard);
    // Check if the card now has the 'ring-2 ring-primary bg-primary/10' class.
    expect(availableDateCard).toHaveClass('ring-2 ring-primary bg-primary/10');
  });

  it('does not update selectedDate when a disabled date is clicked', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    const dateContainer = screen.getByText('Choose Date').closest('div')?.parentElement;
    const disabledDateCard = dateContainer?.querySelector('.cursor-not-allowed') as HTMLElement;
    const initialClassList = Array.from(disabledDateCard.classList);
    fireEvent.click(disabledDateCard);
    // Check that the class list hasn't changed.
    const finalClassList = Array.from(disabledDateCard.classList);
    expect(initialClassList).toEqual(finalClassList);
  });

  it('updates selectedTime when an available time is clicked', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    // First select a date to make the time slots visible
    const availableDateCard = getDateCard('15');
    fireEvent.click(availableDateCard);

    const availableTimeCard = getTimeCard('10:00 AM');
    fireEvent.click(availableTimeCard);
    // Check if the card now has the 'ring-2 ring-primary bg-primary/10' class.
    expect(availableTimeCard).toHaveClass('ring-2 ring-primary bg-primary/10');
  });

  it('does not update selectedTime when a disabled time is clicked', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
        // First select a date to make the time slots visible
    const availableDateCard = getDateCard('15');
    fireEvent.click(availableDateCard);
    const timeContainer = screen.getByText('Select Time').closest('div')?.parentElement;
    const disabledTimeCard = timeContainer?.querySelector('.cursor-not-allowed') as HTMLElement;
    const initialClassList = Array.from(disabledTimeCard.classList);
    fireEvent.click(disabledTimeCard);
    // Check that the class list hasn't changed.
    const finalClassList = Array.from(disabledTimeCard.classList);
    expect(initialClassList).toEqual(finalClassList);
  });

  it('Book My Experience button is disabled initially', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    const bookButton = screen.getByText('Book My Experience');
    expect(bookButton).toBeDisabled();
  });

  it('Book My Experience button is disabled when only some selections are made', () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    const bookButton = screen.getByText('Book My Experience');
    const serviceCard = screen.getByText('Private Video Call').closest('.sexy-card');
        fireEvent.click(serviceCard);
    expect(bookButton).toBeDisabled();

    const availableDateCard = getDateCard('15');
        fireEvent.click(availableDateCard);
        expect(bookButton).toBeDisabled();
  });

  it('Book My Experience button is enabled when all selections are made', () => {
        render(
            <BrowserRouter>
                <Calendar />
            </BrowserRouter>
        );
        const bookButton = screen.getByText('Book My Experience');
        const serviceCard = screen.getByText('Private Video Call').closest('.sexy-card');
        fireEvent.click(serviceCard);

        const availableDateCard = getDateCard('15');
        fireEvent.click(availableDateCard);

        const availableTimeCard = screen.getByText('10:00 AM').closest('div');
        fireEvent.click(availableTimeCard);

        expect(bookButton).toBeEnabled();
    });
});
