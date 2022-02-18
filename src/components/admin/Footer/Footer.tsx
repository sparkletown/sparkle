import {
  ABOUT_URL,
  ACCESSIBILITY_URL,
  BLOG_URL,
  COPYRIGHT_TEXT,
  JOBS_URL,
  PARTNERS_URL,
  PRESS_URL,
} from "settings";

const navigation = [
  { name: "About", href: ABOUT_URL },
  { name: "Blog", href: BLOG_URL },
  { name: "Jobs", href: JOBS_URL },
  { name: "Press", href: PRESS_URL },
  { name: "Accessibility", href: ACCESSIBILITY_URL },
  { name: "Partners", href: PARTNERS_URL },
];

const renderedMenuItems = navigation.map((item) => (
  <div key={item.name} className="px-5 py-2">
    <a href={item.href} className="text-base text-gray-500 hover:text-gray-900">
      {item.name}
    </a>
  </div>
));

export const Footer = () => (
  <footer className="AdminFooter bg-white relative inset-x-0 bottom-0">
    <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav
        className="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        {renderedMenuItems}
      </nav>
      <p className="mt-8 text-center text-base text-gray-400">
        {COPYRIGHT_TEXT}
      </p>
    </div>
  </footer>
);
