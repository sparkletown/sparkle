const navigation = [
  { name: "About", href: "#about" },
  { name: "Blog", href: "#blog" },
  { name: "Jobs", href: "#jobs" },
  { name: "Press", href: "#press" },
  { name: "Accessibility", href: "#accessibility" },
  { name: "Partners", href: "#partners" },
];

const renderedMenuItems = navigation.map((item) => (
  <div key={item.name} className="px-5 py-2">
    <a href={item.href} className="text-base text-gray-500 hover:text-gray-900">
      {item.name}
    </a>
  </div>
));

export const AdminFooter = () => (
  <footer className="AdminFooter bg-white relative inset-x-0 bottom-0">
    <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav
        className="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        {renderedMenuItems}
      </nav>
      <p className="mt-8 text-center text-base text-gray-400">
        &copy; Copyright SparkleVerse Inc & Contributors 2020 to 2021.
      </p>
    </div>
  </footer>
);
