import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Calendar, type CalendarProps } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    weekStartsOn: {
      control: { type: 'inline-radio' },
      options: [0, 1],
    },
    onDateClick: { action: 'date-click' },
    onMonthChange: { action: 'month-change' },
  },
  args: {
    date: new Date(),
    weekStartsOn: 0,
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const WeekStartsOnMonday: Story = {
  args: { weekStartsOn: 1 },
};

export const DifferentMonth: Story = {
  args: {
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  },
};

export const Interactive: Story = {
  render: (args: CalendarProps) => {
    const [current, setCurrent] = React.useState(args.date ?? new Date());
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
            Prev
          </button>
          <button className="px-3 py-1 rounded border" onClick={() => setCurrent(new Date())}>
            Today
          </button>
          <button className="px-3 py-1 rounded border" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
            Next
          </button>
        </div>
        <Calendar {...args} date={current} onDateClick={(d) => console.log('Clicked', d)} />
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: (args) => (
    <div className="dark bg-gray-950 text-gray-100 p-6">
      <Calendar {...args} />
    </div>
  ),
};

export const WithSelectedAndDisabled: Story = {
  args: {
    selectedDate: new Date(),
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), 3),
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), 26),
    isDateDisabled: (d: Date) => d.getDay() === 0, // disable Sundays
  },
};
