import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { sampleEvents } from '../../utils/event.utils';

const meta: Meta<typeof CalendarView> = {
  title: 'Assignment/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof CalendarView>;

export const Default: Story = {
  render: () => <CalendarView />,
};

export const EmptyState: Story = {
  render: () => (
    <div className="p-4">
      <MonthView events={[]} />
    </div>
  ),
};

export const WeekViewStory: Story = {
  render: () => (
    <div className="p-4">
      <WeekView events={sampleEvents} intervalMinutes={30} />
    </div>
  ),
};

export const LargeDataset: Story = {
  render: () => (
    <div className="p-4">
      <MonthView events={Array.from({ length: 25 }, (_, i) => ({
        id: `evt-${i}`,
        title: `Event ${i + 1}`,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), (i % 28) + 1, 9, 0),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), (i % 28) + 1, 10, 0),
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4],
      }))} />
    </div>
  ),
};

export const InteractivePlayground: Story = Default;

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <CalendarView />,
};

export const AccessibilityDemo: Story = {
  name: 'Accessibility (Keyboard Nav)',
  render: () => (
    <div className="p-4">
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">Use Arrow keys, PageUp/PageDown (Shift for year), Home/End, Enter/Space.</p>
      <CalendarView />
    </div>
  ),
};
