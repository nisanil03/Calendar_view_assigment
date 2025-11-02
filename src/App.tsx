import { CalendarView } from './components/calendar';

export default function App() {
  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto py-6">
        <CalendarView />
      </div>
    </div>
  );
}
