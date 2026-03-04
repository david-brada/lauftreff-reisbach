import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Mountain className="w-5 h-5" />
            <span className="font-bold">Lauftreff Reisbach</span>
          </div>
          <p className="text-sm">
            Gemeinsam laufen – gemeinsam stärker. 🏃‍♂️
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span>Powered by Strava</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
