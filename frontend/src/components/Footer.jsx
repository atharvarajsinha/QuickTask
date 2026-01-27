export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              © {new Date().getFullYear()} QuickTask. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Streamlining your workflow, one task at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}