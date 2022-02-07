const navigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
};

export const AdminFooter = () => (
  <footer className="bg-white relative inset-x-0 bottom-0">
    <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav
        className="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        {navigation.main.map((item) => (
          <div key={item.name} className="px-5 py-2">
            <a
              href={item.href}
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {item.name}
            </a>
          </div>
        ))}
      </nav>
      <p className="mt-8 text-center text-base text-gray-400">
        &copy; 2020 Workflow, Inc. All rights reserved.
      </p>
    </div>
  </footer>
);
