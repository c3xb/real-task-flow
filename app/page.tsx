import Dashboard from "@/components/Dashboard";
import TaskCalendar from "@/components/Taskcalender";
import DailyNotebook from "@/components/dailynotebook";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Dashboard />
        
        {/* Constrained width container for Calendar & Recap */}
        <div className="max-w-5.3xl mx-auto space-y-6">
          <TaskCalendar />
          <DailyNotebook />
        </div>
      </div>
    </main>
  );
}